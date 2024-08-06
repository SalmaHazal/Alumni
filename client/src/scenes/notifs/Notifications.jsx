import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import io from "socket.io-client"; // Import Socket.IO

import Navbar from "../navbar/Navbar";
import UserWidget from "../widgets/UserWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import WidgetWrapper from "../../components/WidgetWrapper";
import Avatar from "../widgets/Avatar";

// Initialize socket connection
const socket = io("http://localhost:3001", {
  auth: {
    token: localStorage.getItem("token"), // Assuming token is stored in localStorage
  },
});

const Notifications = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state?.user);
  const token = useSelector((state) => state.token);
  const [notifications, setNotifications] = useState([]);
  const theme = useTheme();

  const fetchNotifications = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(
        `http://localhost:3001/notifications/${user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]); // Removed `notifications` from dependencies

  useEffect(() => {
    // Connect to the socket
    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    return () => {
      socket.off("notification"); // Cleanup on unmount
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <Box>
      <Box className="fixed-navbar">
        <Navbar />
      </Box>
      <Box
        width="100%"
        marginTop="80px"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : "100%"}
          display={isNonMobileScreens ? "block" : "none"}
        >
          <UserWidget userId={user?._id} picturePath={user?.picturePath} />
        </Box>

        <WidgetWrapper flexBasis={isNonMobileScreens ? "40%" : "100%"}>
          <Box sx={{ padding: 2 }}>
            <Typography
              fontWeight="500"
              variant="h3"
              component="h2"
              gutterBottom
            >
              Notifications
            </Typography>
            <List sx={{ width: "100%", maxWidth: 600 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  className={`py-3 flex flex-start ${
                    theme.palette.mode === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-[#383838]"
                  }`}
                >
                  <Link
                    to={notification.link}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      gap: "8px",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        imageUrl={notification.senderPhoto}
                        name={notification.senderName}
                        width={40}
                        height={40}
                        userId={notification.userId}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          className={`${
                            theme.palette.mode === "light"
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {notification.text}
                        </Typography>
                      }
                    />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </WidgetWrapper>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget userId={user?._id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
