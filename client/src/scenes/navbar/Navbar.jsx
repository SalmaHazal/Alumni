import React, { useEffect, useState } from "react";
import Logoalumni from "/public/assets/logoalumni.png";
import alumnidark2 from "/public/assets/alumnidark2.jpg";
import hashtag from "/public/assets/hashtag.01.png";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
} from "@mui/material";
import { Search, Message, RateReview } from "@mui/icons-material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setPosts } from "../../state/index";
import FlexBetween from "../../components/FlexBetween";
import { Link, useLocation } from "react-router-dom";
import AccountMenu from "../prof/prof";
import { Fade as Hamburger } from "hamburger-react";
import { useTransition, animated } from "@react-spring/web";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { useUnseenMessages } from "../../context/UnseenMessagesContext";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { unseenConversationsCount } = useUnseenMessages();

  const location = useLocation();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;
  const backgroundColor =
    theme.palette.mode === "light" ? "#C7C8CC" : "#3b3b3b";

  const isChatPath = /\/chat(\/\d+)?/.test(location.pathname);

  const fullName = `${user.firstName} ${user.lastName}`;

  const posts = useSelector((state) => state.posts);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/search?query=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data.posts }));
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // Fetch notifications and update unread count
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

      setNotifications(data); // Update notifications state

      const unreadNotifications = data.filter(
        (notification) => !notification.read
      ).length;
      setUnreadCount(unreadNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, token]);

  const markAllAsRead = async () => {
    if (notifications.length === 0) return; // No notifications to mark as read

    try {
      await Promise.all(
        notifications.map((notification) =>
          axios.put(
            `http://localhost:3001/notifications/read/${notification._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const transitions = useTransition(isMobileMenuToggled, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
    config: { tension: 220, friction: 20 },
  });
  const { t } = useTranslation();
  return (
    <FlexBetween
      padding="1rem 6%"
      className="relative h-[70px]"
      backgroundColor={alt}
      sx={{ boxShadow: 3 }}
    >
      <FlexBetween gap="1.75rem">
        {/* logo */}
        <Typography component="div">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={theme.palette.mode === "dark" ? alumnidark2 : Logoalumni}
              alt="Logo"
              style={{
                marginRight: "20px",
                width: "100px",
                height: "auto",
                borderRadius: "6px",
              }}
            />
            <img
              src={hashtag}
              alt="hashtag"
              style={{
                width: "200px",
                height: "auto",
                borderRadius: "6px",
              }}
            />
          </Box>
        </Typography>
        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween
            gap="2rem"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "100px",
              paddingRight: "100px",
              width: "100%",
            }}
          >
            <List style={{ display: "flex", flexDirection: "row", padding: 0 }}>
              <ListItem
                button
                component={Link}
                to="/home"
                sx={{
                  borderRadius: "10px",
                  background:
                    location.pathname === "/home"
                      ? backgroundColor
                      : "transparent",
                }}
              >
                <Badge
                  title="Home"
                  badgeContent={posts.length <= 15 ? posts.length : "+15"}
                  color="error"
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                >
                  <HomeIcon />
                </Badge>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/chat"
                sx={{
                  borderRadius: "10px",
                  background: isChatPath ? backgroundColor : "transparent",
                }}
              >
                <Badge
                  title="Messages"
                  badgeContent={unseenConversationsCount}
                  color="error"
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                >
                  <Message />
                </Badge>
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/notifications"
                onClick={markAllAsRead} // Call markAllAsRead when the notifications icon is clicked
                sx={{
                  borderRadius: "10px",
                  background:
                    location.pathname === "/notifications"
                      ? backgroundColor
                      : "transparent",
                }}
              >
                {/* Badge Component around Notifications Icon */}
                <Badge
                  title="Notifications"
                  badgeContent={unreadCount} // Display unread count
                  color="error"
                  max={99} // Maximum number to display before showing '+'
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                >
                  <NotificationsActiveIcon />
                </Badge>
              </ListItem>

              <ListItem title="Jobs" button>
                <WorkHistoryIcon
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>
              <ListItem title="Reviews" button>
                <RateReview
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>
            </List>

            <AccountMenu />
          </FlexBetween>
        ) : (
          <div className="absolute right-6">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Hamburger
                direction="right"
                size={25}
                duration={0.2}
                color="#526482"
              />
            </IconButton>
          </div>
        )}
        {/* search box */}
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="5rem"
            padding="0.1rem 1.2rem"
          >
            <InputBase
              placeholder={ t ("Search...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton onClick={handleSearch}>
              <Search style={{ borderRadius: "50%", marginRight: "" }} />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* MOBILE NAV */}
      {transitions((style, item) =>
        item ? (
          <animated.div
            style={{
              ...style,
              position: "fixed",
              right: 0,
              top: "70px",
              bottom: 0,
              height: "100%",
              zIndex: 10,
              maxWidth: "500px",
              minWidth: "300px",
              backgroundColor: background,
            }}
          >
            <FlexBetween
              style={{ marginTop: "15px", justifyContent: "center" }}
            >
              <List
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "3rem",
                }}
              >
                <ListItem
                  button
                  component={Link}
                  to="/home"
                  sx={{
                    borderRadius: "10px",
                    background:
                      location.pathname === "/home"
                        ? backgroundColor
                        : "transparent",
                  }}
                >
                  <Badge
                    badgeContent={posts.length <= 15 ? posts.length : "+15"}
                    color="error"
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  >
                    <HomeIcon />
                  </Badge>
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/chat"
                  sx={{
                    borderRadius: "10px",
                    background: isChatPath ? backgroundColor : "transparent",
                  }}
                >
                  <Badge
                    badgeContent={unseenConversationsCount}
                    color="error"
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  >
                    <Message />
                  </Badge>
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/notifications"
                  onClick={markAllAsRead} // Call markAllAsRead when the notifications icon is clicked
                  sx={{
                    borderRadius: "10px",
                    background:
                      location.pathname === "/notifications"
                        ? "#C7C8CC"
                        : "transparent",
                  }}
                >
                  {/* Badge Component around Notifications Icon */}
                  <Badge
                    title="Notifications"
                    badgeContent={unreadCount} // Display unread count
                    color="error"
                    max={99} // Maximum number to display before showing '+'
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  >
                    <NotificationsActiveIcon />
                  </Badge>
                </ListItem>

                <ListItem button>
                  <WorkHistoryIcon
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>
                <ListItem title="Jobs" button>
                  <RateReview
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>

                <AccountMenu />
              </List>
            </FlexBetween>
          </animated.div>
        ) : null
      )}
    </FlexBetween>
  );
};

export default Navbar;
