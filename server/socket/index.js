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

// Online users
const onlineUsers = new Set();

// Live stream viewers tracking
const liveStreamViewers = {};

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

  // Handle authentication
  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("No authentication token provided.");
    socket.disconnect(); // Terminate connection if no token is provided
    return;
  }

  const user = await getUserDetailsFromToken(token);
  if (!user) {
    console.error("Invalid or expired token.");
    socket.disconnect(); // Terminate connection if user details can't be fetched
    return;
  }

  // Store user in online users
  socket.join(user._id.toString());
  onlineUsers.add(user._id.toString());
  io.emit("getOnlineUsers", Array.from(onlineUsers));

  // Fetch community conversation ID
  let communityConversationID;
  try {
    const communityConversation = await CommunityConversation.findOne().select(
      "_id"
    );
    if (!communityConversation) {
      console.error("No community conversation found.");
    } else {
      communityConversationID = communityConversation._id.toString();
    }
  } catch (error) {
    console.error("Error fetching community conversation ID:", error);
  }

  // Handle community messages
  socket.on("community", async () => {
    if (!communityConversationID) {
      socket.emit("community messages", []); // Emit empty array if no community ID
      return;
    }

    try {
      const getConversationMessage = await CommunityConversation.findById(
        communityConversationID
      )
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      socket.emit(
        "community messages",
        getConversationMessage?.messages || []
      );
    } catch (error) {
      console.error("Error fetching community messages:", error);
      socket.emit("community messages", []); // Emit empty array on error
    }
  });

  // Handle new community message
  socket.on("new community message", async (data) => {
    if (!communityConversationID) {
      console.error("Community conversation ID is not available.");
      return;
    }

    try {
      const message = new Message({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: user._id,
      });
      const savedMessage = await message.save();

      await CommunityConversation.updateOne(
        { _id: communityConversationID },
        {
          $push: { messages: savedMessage._id },
        }
      );

      const updatedConversation = await CommunityConversation.findById(
        communityConversationID
      )
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      io.emit("community messages", updatedConversation?.messages || []);
    } catch (error) {
      console.error("Error saving new community message:", error);
    }
  });

  // Handle community last message for the sidebar
  socket.on("get community last message", async () => {
    if (!communityConversationID) {
      socket.emit("community last message", null); // Emit null if no community ID
      return;
    }

    try {
      const getLastMessage = await CommunityConversation.findById(
        communityConversationID
      )
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
          options: {
            sort: { updatedAt: -1 },
            limit: 1,
          },
        })
        .sort({ updatedAt: -1 });

      const lastMessage = getLastMessage?.messages[0] || null;
      socket.emit("community last message", lastMessage);
    } catch (error) {
      console.error("Error fetching last community message:", error);
      socket.emit("community last message", null); // Emit null on error
    }
  });

  // Handle direct messages
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

      // Get previous messages
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

  // Handle new direct message
  socket.on("new message", async (data) => {
    try {
      // Check if the conversation between the sender and the receiver exists
      let conversation = await Conversation.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

      // If conversation is not available, create a new one
      if (!conversation) {
        conversation = new Conversation({
          sender: data.sender,
          receiver: data.receiver,
        });
        conversation = await conversation.save();
      }

      const message = new Message({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data.sender,
      });
      const savedMessage = await message.save();

      await Conversation.updateOne(
        { _id: conversation._id },
        {
          $push: { messages: savedMessage._id },
        }
      );

      const updatedConversation = await Conversation.findById(conversation._id)
        .populate({
          path: "messages",
          populate: {
            path: "msgByUserId",
            model: "User",
          },
        })
        .sort({ updatedAt: -1 });

      io.to(data.sender).emit("message", updatedConversation?.messages || []);
      io.to(data.receiver).emit("message", updatedConversation?.messages || []);

      // Send updated conversation lists
      const conversationSender = await getConversation(data.sender);
      const conversationReceiver = await getConversation(data.receiver);

      io.to(data.sender).emit("conversation", conversationSender);
      io.to(data.receiver).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  });

  // Handle sidebar
  socket.on("sidebar", async (currentUserId) => {
    try {
      const conversation = await getConversation(currentUserId);
      socket.emit("conversation", conversation);
    } catch (error) {
      console.error("Error fetching conversations for sidebar:", error);
      socket.emit("conversation", []); // Emit empty array on error
    }
  });

  // Mark messages as seen
  socket.on("seen", async (msgByUserId) => {
    try {
      const conversation = await Conversation.findOne({
        $or: [
          { sender: user._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user._id },
        ],
      });

      if (!conversation) {
        console.error("Conversation not found for marking as seen.");
        return;
      }

      const conversationMessageId = conversation.messages || [];

      await Message.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      // Send updated conversations
      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user._id.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  // **Live Streaming Section**
  // Start live stream
  socket.on("start-live-stream", async () => {
    try {
      const friends = await getFriends(user._id);

      if (!Array.isArray(friends)) {
        console.error("Friends list is not an array.");
        return;
      }

      // Initialize live stream viewers for this user
      liveStreamViewers[user._id.toString()] = new Set();

      // Notify friends about the live stream start
      friends.forEach((friendId) => {
        io.to(friendId._id.toString()).emit("live-stream-started", {
          userId: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          picturePath: user.picturePath,
        });
      });

      console.log(`${user.firstName} ${user.lastName} started a live stream.`);
    } catch (error) {
      console.error("Error starting live stream:", error);
    }
  });

  // Stop live stream
  socket.on("stop-live-stream", () => {
    if (liveStreamViewers[user._id.toString()]) {
      delete liveStreamViewers[user._id.toString()]; // Remove viewers tracking
    }

    io.emit("live-stream-stopped", user._id.toString());
    console.log(`${user.firstName} ${user.lastName} stopped the live stream.`);
  });

  // Join live stream
  socket.on("join-live-stream", (streamerId) => {
    if (!liveStreamViewers[streamerId]) {
      console.error("No such live stream exists.");
      return;
    }

    // Add the current user to the live stream viewers set
    liveStreamViewers[streamerId].add(user._id.toString());

    // Notify the streamer that a user has joined
    io.to(streamerId).emit("live-stream-viewer-joined", {
      userId: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      picturePath: user.picturePath,
    });

    console.log(
      `${user.firstName} ${user.lastName} joined the live stream of ${streamerId}.`
    );
  });

  // Leave live stream
  socket.on("leave-live-stream", (streamerId) => {
    if (liveStreamViewers[streamerId]) {
      liveStreamViewers[streamerId].delete(user._id.toString());

      // Notify the streamer that a user has left
      io.to(streamerId).emit("live-stream-viewer-left", {
        userId: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
      });

      console.log(
        `${user.firstName} ${user.lastName} left the live stream of ${streamerId}.`
      );
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    console.log("A user has disconnected", socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers));
  });
});

// Helper function to get user's friends
const getFriends = async (userId) => {
  try {
    const user = await User.findById(userId);

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    return friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
  } catch (err) {
    console.error("Error fetching friends:", err.message);
    return [];
  }
};

export { app, server };
