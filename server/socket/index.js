import express from "express";
import { Server } from "socket.io";
import http from "http";
import { exec } from "child_process";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import getConversation from "../helpers/getConversation.js";
import CommunityConversation from "../models/CommunityConversation.js";
import Notification from "../models/Notification.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Online users and live stream viewers
const onlineUsers = new Set();
const liveStreamViewers = {};

// Object to track live stream sessions and processes
const liveStreamSessions = {};

io.on("connection", async (socket) => {
  console.log("A user has connected", socket.id);

  const token = socket.handshake.auth.token;
  if (!token) {
    console.error("No authentication token provided.");
    socket.disconnect();
    return;
  }

  const user = await getUserDetailsFromToken(token);
  if (!user) {
    console.error("Invalid or expired token.");
    socket.disconnect();
    return;
  }

  socket.join(user._id.toString());
  onlineUsers.add(user._id.toString());
  io.emit("getOnlineUsers", Array.from(onlineUsers));

  let communityConversationID;
  try {
    const communityConversation = await CommunityConversation.findOne().select(
      "_id"
    );
    if (communityConversation) {
      communityConversationID = communityConversation._id.toString();
    }
  } catch (error) {
    console.error("Error fetching community conversation ID:", error);
  }

  socket.on("community", async () => {
    if (!communityConversationID) {
      socket.emit("community messages", []);
      return;
    }
    try {
      const getConversationMessage = await CommunityConversation.findById(
        communityConversationID
      )
        .populate({
          path: "messages",
          populate: { path: "msgByUserId", model: "User" },
        })
        .sort({ updatedAt: -1 });

      socket.emit(
        "community messages",
        getConversationMessage?.messages || []
      );
    } catch (error) {
      console.error("Error fetching community messages:", error);
      socket.emit("community messages", []);
    }
  });

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
        { $push: { messages: savedMessage._id } }
      );

      const updatedConversation = await CommunityConversation.findById(
        communityConversationID
      )
        .populate({
          path: "messages",
          populate: { path: "msgByUserId", model: "User" },
        })
        .sort({ updatedAt: -1 });

      io.emit("community messages", updatedConversation?.messages || []);
    } catch (error) {
      console.error("Error saving new community message:", error);
    }
  });

  socket.on("get community last message", async () => {
    if (!communityConversationID) {
      socket.emit("community last message", null);
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
          options: { sort: { updatedAt: -1 }, limit: 1 },
        })
        .sort({ updatedAt: -1 });

      const lastMessage = getLastMessage?.messages[0] || null;
      socket.emit("community last message", lastMessage);
    } catch (error) {
      console.error("Error fetching last community message:", error);
      socket.emit("community last message", null);
    }
  });

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
      socket.emit("message", []);
    }
  });

  socket.on("new message", async (data) => {
    try {
      let conversation = await Conversation.findOne({
        $or: [
          { sender: data.sender, receiver: data.receiver },
          { sender: data.receiver, receiver: data.sender },
        ],
      });

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
        { $push: { messages: savedMessage._id } }
      );

      const updatedConversation = await Conversation.findById(conversation._id)
        .populate({
          path: "messages",
          populate: { path: "msgByUserId", model: "User" },
        })
        .sort({ updatedAt: -1 });

      io.to(data.sender).emit("message", updatedConversation?.messages || []);
      io.to(data.receiver).emit("message", updatedConversation?.messages || []);

      const conversationSender = await getConversation(data.sender);
      const conversationReceiver = await getConversation(data.receiver);

      io.to(data.sender).emit("conversation", conversationSender);
      io.to(data.receiver).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  });

  socket.on("sidebar", async (currentUserId) => {
    try {
      const conversation = await getConversation(currentUserId);
      socket.emit("conversation", conversation);
    } catch (error) {
      console.error("Error fetching conversations for sidebar:", error);
      socket.emit("conversation", []);
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

      if (!conversation) {
        console.error("Conversation not found for marking as seen.");
        return;
      }

      const conversationMessageId = conversation.messages || [];

      await Message.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );

      const conversationSender = await getConversation(user._id.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user._id.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  socket.on("start-live-stream", async () => {
    try {
      const friends = await getFriends(user._id);

      if (!Array.isArray(friends)) {
        console.error("Friends list is not an array.");
        return;
      }

      // Start the live stream using ffmpeg
      const ffmpegCommand = `ffmpeg -re -i video.mp4 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 500k -bf 0 -`;
      const ffmpegProcess = exec(ffmpegCommand);

      liveStreamSessions[user._id.toString()] = {
        viewers: new Set(),
        ffmpegProcess: ffmpegProcess,
      };

      // Broadcast the stream to all viewers
      ffmpegProcess.stdout.on("data", (data) => {
        io.to(user._id.toString()).emit("stream-video", data);
      });

      ffmpegProcess.on("error", (err) => {
        console.error("FFmpeg error:", err);
        io.to(user._id.toString()).emit("stream-error", "Error starting video stream.");
      });

      const notifications = friends.map((friend) => {
        const newNotification = new Notification({
          userId: friend._id,
          type: "liveStream",
          text: `${user.firstName} ${user.lastName} has started a live stream!`,
          link: `/live/${user._id}`,
          senderPhoto: user.picturePath,
          senderName: `${user.firstName} ${user.lastName}`,
          read: false,
        });

        newNotification.save().catch((err) => {
          console.error("Error saving notification:", err.message);
        });

        io.to(friend._id.toString()).emit("notification", newNotification);

        return newNotification;
      });

      console.log(`${user.firstName} ${user.lastName} started a live stream.`);
    } catch (error) {
      console.error("Error starting live stream:", error);
    }
  });

  socket.on("stop-live-stream", () => {
    if (liveStreamSessions[user._id.toString()]) {
      liveStreamSessions[user._id.toString()].ffmpegProcess.kill();
      delete liveStreamSessions[user._id.toString()];
    }

    io.emit("live-stream-stopped", user._id.toString());
    console.log(`${user.firstName} ${user.lastName} stopped the live stream.`);
  });

  socket.on("join-live-stream", (streamerId) => {
    if (!liveStreamSessions[streamerId]) {
      console.error("No such live stream exists.");
      return;
    }

    liveStreamSessions[streamerId].viewers.add(user._id.toString());

    io.to(streamerId).emit("live-stream-viewer-joined", {
      userId: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      picturePath: user.picturePath,
    });

    console.log(
      `${user.firstName} ${user.lastName} joined the live stream of ${streamerId}.`
    );
  });

  socket.on("leave-live-stream", (streamerId) => {
    if (liveStreamSessions[streamerId]) {
      liveStreamSessions[streamerId].viewers.delete(user._id.toString());

      io.to(streamerId).emit("live-stream-viewer-left", {
        userId: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
      });

      console.log(
        `${user.firstName} ${user.lastName} left the live stream of ${streamerId}.`
      );
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user._id.toString());
    console.log("A user has disconnected", socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers));

    // Remove the user from any live streams they were viewing
    for (const sessionId in liveStreamSessions) {
      const session = liveStreamSessions[sessionId];
      if (session.viewers.has(socket.id)) {
        session.viewers.delete(socket.id);
        if (session.viewers.size === 0) {
          session.ffmpegProcess.kill();
          delete liveStreamSessions[sessionId];
        }
      }
    }
  });
});

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
