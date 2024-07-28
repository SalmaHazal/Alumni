import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../../context/SocketContext";
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, IconButton, useMediaQuery } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Navbar from "../navbar/Navbar";
import UserWidget from "../widgets/UserWidget";
import AdvertWidget from "../widgets/AdvertWidget";

const Notifications = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
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
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={user?._id} picturePath={user?.picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Notifications
            </Typography>
            <IconButton onClick={fetchNotifications} sx={{ mb: 2 }}>
              <RefreshIcon />
            </IconButton>
            <List ref={notificationRef} sx={{ width: '100%', maxWidth: 600 }}>
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
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
