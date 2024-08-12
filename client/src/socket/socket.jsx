import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3001'; // Your Socket.IO server URL

let socket; // Global socket instance to ensure a single connection

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState(null);

  // Extract and parse the token from localStorage
  const persistRootString = localStorage.getItem("persist:root");
  let token = null;
  
  try {
    const persistRootObject = JSON.parse(persistRootString);
    token = JSON.parse(persistRootObject.token);
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
  }

  useEffect(() => {
    if (!socket && token) { // Ensure socket is not already connected and token is available
      console.log("Connecting to socket server...");
      
      socket = io(SOCKET_SERVER_URL, {
        auth: {
          token, // Attach token for authentication
        },
      });

      socket.on('connect', () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on('connect_error', (err) => {
        console.error("Socket connection error:", err.message);
      });

      socket.on('disconnect', () => {
        console.log("Socket disconnected");
      });

      setSocketInstance(socket);
    }

    // Clean up socket connection on component unmount or token change
    return () => {
      if (socket) {
        console.log("Disconnecting socket...");
        socket.disconnect();
        socket = null; // Ensure global socket is reset
      }
    };
  }, [token]); // Re-run only if token changes

  return socketInstance;
};

// Emit a live stream started event
export const emitLiveStreamStarted = (userId, streamData) => {
  if (socket) {
    console.log("Emitting live stream started for user:", userId);
    socket.emit('live-stream-started', { userId, stream: streamData }); // Include stream data if needed
  }
};

// Emit a live stream stopped event
export const emitLiveStreamStopped = (userId) => {
  if (socket) {
    console.log("Emitting live stream stopped for user:", userId);
    socket.emit('live-stream-stopped', { userId });
  }
};

// Listen for a live stream started event
export const onLiveStreamStarted = (callback) => {
  if (socket) {
    socket.on('live-stream-started', (data) => {
      console.log("Live stream started event received:", data);
      callback(data);
    });
  }
};

// Listen for a live stream stopped event
export const onLiveStreamStopped = (callback) => {
  if (socket) {
    socket.on('live-stream-stopped', (data) => {
      console.log("Live stream stopped event received:", data);
      callback(data);
    });
  }
};

// Emit join live stream event
export const emitJoinLiveStream = (streamerId) => {
  if (socket) {
    console.log("Joining live stream for streamer:", streamerId);
    socket.emit('join-live-stream', { streamerId }); // Use object for consistency
  }
};

// Emit leave live stream event
export const emitLeaveLiveStream = (streamerId) => {
  if (socket) {
    console.log("Leaving live stream for streamer:", streamerId);
    socket.emit('leave-live-stream', { streamerId }); // Use object for consistency
  }
};
