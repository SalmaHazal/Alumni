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

// online user
const onlineUser = new Set();

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
    return getConversationMessage[0]._id;
  };
  const ID = await communityConversationID();

  const token = socket.handshake.auth.token;

  // current user detail
  const user = await getUserDetailsFromToken(token);

  // Community Side Bar
  socket.on("community side bar", async () => {
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

    const lastMessage = getLastMessage.messages[0];

    io.emit("community last message", lastMessage);
  });

  // Community Messages
  socket.on("community", async () => {
    // get previous message
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
  });

  socket.on("new community message", async (data) => {
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

    // Community Side Bar
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

    const lastMessage = getLastMessage.messages[0];

    io.emit("community last message", lastMessage);
  });

  //create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("getOnlineUsers", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await User.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: `${userDetails?.firstName} ${userDetails?.lastName}`,
      email: userDetails?.email,
      picturePath: userDetails?.picturePath,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    // get previous message
    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // new message
  socket.on("new message", async (data) => {
    // check if the conversation between the sender and the receiver exists
    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    // if conversation is not available
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

    const updateConversation = await Conversation.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
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
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  // sidebar
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on('fetch-conversations-unseen-count', async (userId) => {
    try {
      // Find conversations where the user is either the sender or receiver
      const conversations = await Conversation.find({
        $or: [{ sender: userId }, { receiver: userId }],
      }).populate('messages');

      // Calculate the number of conversations with at least one unseen message
      const conversationsWithUnseen = conversations.filter(conversation =>
        conversation.messages.some(message => !message.seen && message.msgByUserId.toString() !== userId)
      );

      const unseenConversationsCount = conversationsWithUnseen.length;

      // Emit the count to the client
      socket.emit('update-unseen-conversations-count', unseenConversationsCount);
    } catch (error) {
      console.error('Error fetching unseen conversations count:', error);
    }
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await Message.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);

    // Update the count of unseen conversations
    const conversations = await Conversation.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    }).populate('messages');

    const conversationsWithUnseen = conversations.filter(conversation =>
      conversation.messages.some(message => !message.seen && message.msgByUserId.toString() !== user._id.toString())
    );

    const unseenConversationsCount = conversationsWithUnseen.length;

    io.emit('update-unseen-conversations-count', unseenConversationsCount);
  
  });

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user._id);
    console.log("a user has disconnected", socket.id);
  });
});

export { app, server };
