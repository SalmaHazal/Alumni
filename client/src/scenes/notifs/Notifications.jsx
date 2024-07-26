import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../../context/SocketContext";
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const Notifications = () => {
  const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state.token);
  const { socket } = useSocketContext();
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (notificationRef.current) {
      notificationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(`http://localhost:3001/notifications/${user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user?._id && socket) {
      fetchNotifications();

      socket.emit("notification-page", user._id);

      socket.on("notification", (notification) => {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [user?._id, socket]);

  return (
    <Box 
      sx={{ 
        padding: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Notifications
      </Typography>
      <IconButton onClick={fetchNotifications} sx={{ mb: 2 }}>
        <RefreshIcon />
      </IconButton>
      <List 
        ref={notificationRef} 
        sx={{ width: '100%', maxWidth: 600 }}
      >
        {notifications.map((notification) => (
          <ListItem key={notification._id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={`http://localhost:3001/assets/${notification.senderPhoto}`} alt={notification.senderName} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="body1">{notification.text}</Typography>}
              secondary={
                <Typography variant="caption" color="text.secondary">
                  <a href={notification.link}>View</a>
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
