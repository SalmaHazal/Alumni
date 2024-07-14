import express from "express";
import { Server } from "socket.io";
import http from "http";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";

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

  const token = socket.handshake.auth.token;

  // current user detail
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user._id);
  onlineUser.add(user._id);

  io.emit("getOnlineUsers", Array.from(onlineUser));

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user._id);
    console.log("a user has disconnected", socket.id);
  });
});

export { app, server };
