import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Box, Typography, useTheme } from "@mui/material";
import ViewerList from "./ViewerList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LiveStreamPage = () => {
  const { streamerId } = useParams();
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewers, setViewers] = useState([]);
  const videoRef = useRef(null);
  const socket = useRef(null);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

  useEffect(() => {
    socket.current = io("http://localhost:3001", {
      auth: {
        token: token,
      },
    });

    socket.current.emit("join-live-stream", streamerId);

    socket.current.on("start-live-stream", () => {
      setIsStreaming(true);
    });

    socket.current.on("stream-video", (data) => {
      const videoElement = videoRef.current;
      if (videoElement) {
        try {
          const blob = new Blob([data], { type: "video/mpeg" });
          const url = window.URL.createObjectURL(blob);
          videoElement.src = url;
          videoElement.play().catch((error) => {
            console.error("Error playing video stream:", error);
            toast.error("Error playing the live stream. Please try again.");
          });
        } catch (error) {
          console.error("Error processing video stream data:", error);
          toast.error("Error processing the live stream data.");
        }
      }
    });

    socket.current.on("live-stream-viewer-joined", (viewer) => {
      setViewers((prevViewers) => [...prevViewers, viewer]);
    });

    socket.current.on("live-stream-viewer-left", (viewer) => {
      setViewers((prevViewers) =>
        prevViewers.filter((v) => v.userId !== viewer.userId)
      );
    });

    socket.current.on("live-stream-stopped", () => {
      setIsStreaming(false);
      toast.info("The live stream has ended.");
    });

    socket.current.on("disconnect", () => {
      setIsStreaming(false);
    });

    return () => {
      socket.current.emit("leave-live-stream", streamerId);
      socket.current.disconnect();
    };
  }, [streamerId, token]);

  return (
    <Box sx={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Live Stream
      </Typography>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          borderRadius: "8px",
          boxShadow: `0px 0px 10px ${palette.primary.main}`,
          marginBottom: "1rem",
        }}
        controls
        autoPlay
        muted
      />
      {isStreaming ? (
        <Typography variant="h6" color="success.main">
          Live
        </Typography>
      ) : (
        <Typography variant="h6" color="error.main">
          Offline
        </Typography>
      )}
      <ViewerList viewers={viewers} />
    </Box>
  );
};

export default LiveStreamPage;
