import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import getConversation from "../helpers/getConversation.js";
import Notification from "../models/Notification.js";

const app = express();

// Online users
const onlineUsers = new Set();

// Socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("A user has connected", socket.id);

  const token = socket.handshake.auth.token;

  if (!token) {
    console.error("No token provided");
    socket.disconnect();
    return;
  }

  let user;
  try {
    user = await getUserDetailsFromToken(token);
    console.log("User verified:", user._id.toString());
  } catch (error) {
    console.error("Error verifying token:", error.message);
    socket.disconnect();
    return;
  }

  if (!user) {
    console.error("Invalid token or user not found");
    socket.disconnect();
    return;
  }

  // Create a room for the user
  socket.join(user._id.toString());
  onlineUsers.add(user._id.toString());

  io.emit("getOnlineUsers", Array.from(onlineUsers));

  // Handle the "message-page" event
  socket.on("message-page", async (userId) => {
    try {
      const userDetails = await User.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: `${userDetails?.firstName} ${userDetails?.lastName}`,
        email: userDetails?.email,
        picturePath: userDetails?.picturePath,
        online: onlineUsers.has(userId),
      };
      socket.emit("message-user", payload);

      // Get previous messages
      const getConversationMessage = await Conversation.findOne({
        $or: [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
      socket.emit("error", { message: "Unable to fetch messages" });
    }
  });

  // New message event handling
  socket.on("new message", async (data) => {
    try {
      let conversation = await Conversation.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      // Create a new conversation if it doesn't exist
      if (!conversation) {
        const createConversation = new Conversation({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      // Save the new message
      const message = new Message({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
        createdAt: new Date(),  // Ensure timestamps are included
      });
      const savedMessage = await message.save();

      // Update conversation with the new message
      await Conversation.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: savedMessage?._id },
          updatedAt: new Date(),
        }
      );

      // Fetch updated conversation messages
      const getConversationMessage = await Conversation.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      // Emit message to both sender and receiver
      io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
      io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

      // Emit updated conversation list to both sender and receiver
      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit("conversation", conversationSender);
      io.to(data?.receiver).emit("conversation", conversationReceiver);

      // Create and send a notification to the receiver
      const senderUser = await User.findById(data.sender);

      const newNotification = new Notification({
        userId: data.receiver,
        type: "message",
        text: `New message from ${senderUser.firstName} ${senderUser.lastName}`,
        link: `/chat/${data.sender}`,
        senderPhoto: senderUser.picturePath,
        createdAt: new Date(),  // Ensure timestamps are included
        read: false,            // Default to unseen
      });

      await newNotification.save();
      io.to(data.receiver).emit("notification", newNotification);

      console.log(`Notification sent to user: ${data.receiver}`);
    } catch (err) {
      console.error("Error sending new message:", err.message);
      socket.emit("messageError", { message: err.message });
    }
  });

  // Sidebar event
  socket.on("sidebar", async (currentUserId) => {
    try {
      const conversation = await getConversation(currentUserId);
      socket.emit("conversation", conversation);
    } catch (err) {
      console.error("Error fetching sidebar conversations:", err.message);
      socket.emit("error", { message: "Unable to fetch conversations" });
    }
  });

  // Seen message event
  socket.on("seen", async (msgByUserId) => {
    try {
      const conversation = await Conversation.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];

      await Message.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      // Send updated conversation to both sender and receiver
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    } catch (err) {
      console.error("Error updating seen messages:", err.message);
      socket.emit("error", { message: "Unable to update seen messages" });
    }
  });

  // Post comment event
  socket.on("new comment", async ({ postId, userId, comment }) => {
    try {
      // Find post and post's author
      const post = await Post.findById(postId).populate("userId", "_id firstName lastName");
      
      if (!post) {
        throw new Error("Post not found");
      }

      const newComment = new Comment({
        text: comment,
        user: userId,
        postId,
      });

      await newComment.save();

      // Update post's comments
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });

      // Emit comment update to all users viewing the post
      io.to(postId).emit("comment update", {
        postId,
        comment: newComment,
      });

      // Notify post author if commenter is a different user
      if (post.userId._id.toString() !== userId) {
        const commentingUser = await User.findById(userId);

        const newNotification = new Notification({
          userId: post.userId._id,
          type: "comment",
          text: `${commentingUser.firstName} commented on your post`,
          link: `/posts/${postId}`,
          senderPhoto: commentingUser.picturePath,
          createdAt: new Date(),
          read: false,
        });

        await newNotification.save();
        io.to(post.userId._id.toString()).emit("notification", newNotification);
      }
    } catch (err) {
      console.error("Error posting comment:", err.message);
      socket.emit("commentError", { message: err.message });
    }
  });

  // Post like event
  socket.on("like post", async ({ postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const isLiked = post.likes.get(userId);

      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }

      await post.save();

      io.to(postId).emit("like update", {
        postId,
        likes: post.likes,
      });

      // Notify post author if liker is a different user
      if (post.userId.toString() !== userId) {
        const likingUser = await User.findById(userId);

        const newNotification = new Notification({
          userId: post.userId,
          type: "like",
          text: `${likingUser.firstName} liked your post`,
          link: `/post/${postId}`,
          senderPhoto: likingUser.picturePath,
          createdAt: new Date(),
          read: false,
        });

        await newNotification.save();
        io.to(post.userId.toString()).emit("notification", newNotification);
      }
    } catch (err) {
      console.error("Error liking post:", err.message);
      socket.emit("likeError", { message: err.message });
    }
  });

  // New post event
  socket.on("new post", async ({ userId, description, picturePath }) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      });

      await newPost.save();

      io.emit("post update", {
        postId: newPost._id,
        post: newPost,
      });

      // Send notifications to all online friends
      const friends = await User.find({ friends: userId });
      for (const friend of friends) {
        const newNotification = new Notification({
          userId: friend._id,
          type: "post",
          text: `${user.firstName} created a new post`,
          link: `/post/${newPost._id}`,
          senderPhoto: user.picturePath,
          createdAt: new Date(),
          read: false,
        });

        await newNotification.save();
        io.to(friend._id.toString()).emit("notification", newNotification);
      }
    } catch (err) {
      console.error("Error creating post:", err.message);
      socket.emit("postError", { message: err.message });
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    io.emit("getOnlineUsers", Array.from(onlineUsers)); // Notify all users of the updated online list
    console.log("A user has disconnected", socket.id);
  });
});

export { app, server };
