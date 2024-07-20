import React, { useState } from "react";
import Logoalumni from "/public/assets/logoalumni.png";
import Grid from "@mui/material/Grid";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  Button,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Menu,
  Grade,
} from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setPosts } from "../../state/index";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import { Link, useLocation } from "react-router-dom";
import AccountMenu from "../prof/prof";
import { Fade as Hamburger } from 'hamburger-react'
import { useTransition, animated } from "@react-spring/web";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const location = useLocation();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

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

  const transitions = useTransition(isMobileMenuToggled, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
    config: { tension: 220, friction: 20 },
  });

  return (
    <FlexBetween
      padding="1rem 6%"
      className="relative h-[70px]"
      backgroundColor={alt}
      sx={{ boxShadow: 3 }}
    >
      <FlexBetween gap="1.75rem">
        {/* logo */}
        <Typography>
          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
            <img
              src={Logoalumni}
              alt="Logo"
              style={{
                marginRight: "60px",
                width: "100px",
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
                sx={
                  location.pathname === "/home"
                    ? { background: "#C7C8CC", borderRadius: "10px" }
                    : null
                }
              >
                <HomeIcon
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/chat"
                sx={
                  location.pathname === "/chat"
                    ? { background: "#C7C8CC", borderRadius: "10px" }
                    : null
                }
              >
                <Message
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>

              <ListItem button>
                <NotificationsActiveIcon
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>
              <ListItem button>
                <WorkHistoryIcon
                  sx={{ fontSize: "25px" }}
                  style={{ margin: "0 17px" }}
                />
              </ListItem>
              <ListItem button onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </ListItem>
            </List>

            <AccountMenu />
          </FlexBetween>
        ) : (
          <div className="absolute right-6">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Hamburger direction="right" size={25} duration={0.2} color="#2e3e4d"  />
            </IconButton>
          </div>
        )}
        {/* search box */}
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.2rem"
          >
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton onClick={handleSearch}>
              <Search style={{ marginRight: "-10px" }} />
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
              position: 'fixed',
              right: 0,
              top: '70px',
              bottom: 0,
              height: '100%',
              zIndex: 10,
              maxWidth: '500px',
              minWidth: '300px',
              backgroundColor: background,
            }}
          >
            <FlexBetween style={{ marginTop: "15px", justifyContent: "center" }}>
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
                  sx={
                    location.pathname === "/home"
                      ? { background: "#C7C8CC", borderRadius: "10px" }
                      : null
                  }
                >
                  <HomeIcon
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>

                <ListItem
                  button
                  component={Link}
                  to="/chat"
                  sx={
                    location.pathname === "/chat"
                      ? { background: "#C7C8CC", borderRadius: "10px" }
                      : null
                  }
                >
                  <Message
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>

                <ListItem button>
                  <NotificationsActiveIcon
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>
                <ListItem button>
                  <WorkHistoryIcon
                    sx={{ fontSize: "25px" }}
                    style={{ margin: "0 17px" }}
                  />
                </ListItem>
                <ListItem button onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === "dark" ? (
                    <DarkMode style={{ margin: "0 17px" }} sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode style={{ margin: "0 17px" }} sx={{ color: dark, fontSize: "25px" }} />
                  )}
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
