import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import getConversation from "../helpers/getConversation.js";
import CommunityConversation from "../models/CommunityConversation.js";

const app = express();

// online users
const onlineUsers = new Set();

// socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("A user has connected", socket.id);

  // Get the id of the community Conversation
  const communityConversationID = async () => {
    const getConversationMessage = await CommunityConversation.find();
    if (!getConversationMessage || getConversationMessage.length === 0) {
      console.error("No community conversation found.");
      return null; // Handle case where no community conversation exists
    }
    return getConversationMessage[0]._id;
  };
  const ID = await communityConversationID();

  const token = socket.handshake.auth.token;

  if (!token) {
    console.error("No authentication token provided.");
    return; // Ensure the token is provided
  }

  // current user detail
  const user = await getUserDetailsFromToken(token);

  if (!user) {
    console.error("Invalid or expired token.");
    return; // Handle the case where user details can't be fetched
  }

  // Community Messages
  socket.on("community", async () => {
    if (!ID) {
      socket.emit("community messages", []); // Emit empty array if no community ID
      return;
    }

    // get previous messages
    try {
      const getConversationMessage = await CommunityConversation.findById(ID)
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      socket.emit("community messages", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error fetching community messages:", error);
      socket.emit("community messages", []); // Emit empty array on error
    }
  });

  socket.on("new community message", async (data) => {
    if (!ID) {
      return; // Return if community ID is not available
    }

    try {
      const message = new Message({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });
      const saveMessage = await message.save();

      await CommunityConversation.updateOne(
        { _id: ID },
        {
          $push: { messages: saveMessage._id },
        }
      );

      const getConversationMessage = await CommunityConversation.findById(ID)
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      io.emit("community messages", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error saving new community message:", error);
    }
  });

  // Community Side Bar
  try {
    const getLastMessage = await CommunityConversation.findById(ID).populate({
      path: "messages",
      populate: {
        path: "msgByUserId",
        model: "User",
      },
      options: {
        sort: { updatedAt: -1 },
        limit: 1,
      },
    });

    const lastMessage = getLastMessage?.messages[0];

    socket.emit("community last message", lastMessage || {});
  } catch (error) {
    console.error("Error fetching last community message:", error);
    socket.emit("community last message", {}); // Emit empty object on error
  }

  // Create a room
  socket.join(user._id.toString());
  onlineUsers.add(user._id.toString());

  io.emit("getOnlineUsers", Array.from(onlineUsers));

  socket.on("message-page", async (userId) => {
    try {
      const userDetails = await User.findById(userId).select("-password");

      if (!userDetails) {
        console.error("User not found with id:", userId);
        return;
      }

      const payload = {
        _id: userDetails._id,
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
        picturePath: userDetails.picturePath,
        online: onlineUsers.has(userId),
      };
      socket.emit("message-user", payload);

      // get previous messages
      const getConversationMessage = await Conversation.findOne({
        $or: [
          { sender: user._id, receiver: userId },
          { sender: userId, receiver: user._id },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    } catch (error) {
      console.error("Error fetching user messages:", error);
      socket.emit("message", []); // Emit empty array on error
    }
  });

  // New message
  socket.on("new message", async (data) => {
    try {
      // Check if the conversation between the sender and the receiver exists
      let conversation = await Conversation.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      // If conversation is not available, create a new one
      if (!conversation) {
        const createConversation = new Conversation({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        conversation = await createConversation.save();
      }

      const message = new Message({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      });
      const saveMessage = await message.save();

      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $push: { messages: saveMessage._id },
        }
      );

      const getConversationMessage = await Conversation.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
      io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

      // Send conversation
      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit("conversation", conversationSender);
      io.to(data?.receiver).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  });

  // Sidebar
  socket.on("sidebar", async (currentUserId) => {
    try {
      const conversation = await getConversation(currentUserId);

      socket.emit("conversation", conversation);
    } catch (error) {
      console.error("Error fetching conversations for sidebar:", error);
      socket.emit("conversation", []); // Emit empty array on error
    }
  });

  socket.on("seen", async (msgByUserId) => {
    try {
      const conversation = await Conversation.findOne({
        $or: [
          { sender: user._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user._id },
        ],
      });

      const conversationMessageId = conversation?.messages || [];

      await Message.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      // Send conversation
      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user._id.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    console.log("A user has disconnected", socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers));
  });
});

export { app, server };
