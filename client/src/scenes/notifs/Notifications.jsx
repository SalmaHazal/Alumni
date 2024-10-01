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
  Card,
  Divider,
} from "@mui/material";
import Navbar from "../navbar/Navbar";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Link } from "react-router-dom";
import Avatar from "../widgets/Avatar";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

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
      console.log("API Response:", data); // Log the response
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);
  const { t } = useTranslation();

  return (
    <Box>
      <Box className="fixed-navbar">
        <Navbar />
      </Box>
      <Box
        width="100%"
        marginTop="80px"
        padding="2rem 5%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "20%" : "100%"}
          display={isNonMobileScreens ? "block" : "none"}
          paddingRight={2}
        >
          {/*<UserWidget userId={user?._id} picturePath={user?.picturePath} />*/}
        </Box>

        <WidgetWrapper flexBasis={isNonMobileScreens ? "75%" : "100%"}>
          <Box sx={{ padding: 2 }}>
            <Typography
              fontWeight="500"
              variant="h2"
              component="h2"
              color={theme.palette.primary.main}
              gutterBottom
              sx={{ marginBottom: "20px", textAlign: "center" }}
            >
              { t ("Notifications")}
            </Typography>
            <List sx={{ width: "100%", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification._id}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.divider}`,
                      padding: "1rem",
                      marginBottom: "0.5rem",
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: `0 2px 5px ${theme.palette.action.disabled}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ListItem alignItems="flex-start" sx={{ flex: 1 }}>
                      <Link to={notification.link} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
                        <ListItemAvatar>
                          <Avatar
                            imageUrl={notification.senderPhoto}
                            name={notification.senderName}
                            width={50}
                            height={50}
                            userId={notification.userId}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="textPrimary" sx={{ fontSize: '16px' }}>
                              {notification.text}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color={theme.palette.primary.main} style={{position:"absolute", marginLeft:"68%"}}>
                              {notification.createdAt && !isNaN(new Date(notification.createdAt).getTime())
                                ? new Date(notification.createdAt).toLocaleString('en-US', { 
                                    dateStyle: 'short', 
                                    timeStyle: 'short' 
                                  })
                                : "No date available"}
                            </Typography>
                          }
                        />
                      </Link>
                    </ListItem>
                    
                  </Card>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </WidgetWrapper>

        {isNonMobileScreens && (
          <Box flexBasis="20%">
            {/*<FriendListWidget userId={user?._id} />*/}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
