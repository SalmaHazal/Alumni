import { useState } from "react";
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
  makeStyles,
  List,
  ListItem,
  Button,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Help,
  Menu,
  Close,
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

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt} sx={{ boxShadow: 3 }}>
      <FlexBetween gap="1.75rem">
        {/* logo */}
        <Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
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
              <ListItem button>
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

            {/*<FormControl variant="standard" value={fullName} style={{width:"0px"}}>
            <Select
              
              sx={{
                marginLeft:"72px",
                width: "15px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  
                },
              }}
              input={<InputBase />}
            > 
             
              
              <MenuItem >
                <Typography variant="h9">
                {fullName}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>*/}
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
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
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <NotificationsActiveIcon sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "0px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    //target this specific className
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
