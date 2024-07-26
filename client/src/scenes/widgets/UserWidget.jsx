import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiGraduationCapFill } from "react-icons/pi";
import { IoMailUnreadOutline } from "react-icons/io5";
import EditProfilePage from "../modify/EditProfilePage";
import { FaWhatsapp } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.text.primary;
  const medium = palette.text.secondary;
  const main = palette.primary.main;
  const [openEdit, setOpenEdit] = useState(false);

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    email,
    location,
    promotion,
    phonenumber,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${userId}`)}>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: "#545557",
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <IconButton onClick={() => setOpenEdit(true)}>
          <ManageAccountsOutlined />
        </IconButton>
      </FlexBetween>
      <Divider />

      {/* SECOND ROW */}
      <Box className="flex flex-column gap-1" p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined sx={{ color: "#545557", fontSize: "29px" }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined sx={{ color: "#545557", fontSize: "25px" }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
        <Box marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <PiGraduationCapFill size={"28px"} color="#545557" />
          <Typography color={medium}>{promotion}</Typography>
        </Box>
        <Box marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <IoMailUnreadOutline size={"25px"} color="#545557" />
          <Typography color={medium}>{email}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" fontWeight="500" mb="1rem">
          Professional Summary
        </Typography>

        {/* Example of social profile */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaWhatsapp size={"25px"} />
            <Box>
              <Typography fontWeight="500">
                Resume
              </Typography>
              <Typography color={medium}>{phonenumber}</Typography>
            </Box>
          </FlexBetween>
          <IconButton>
            <EditOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaLinkedinIn size={"25px"} />
            <Box>
              <Typography fontWeight="500">
                Portfolio
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <IconButton>
            <EditOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>
      </Box>


      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        {/* Example of social profile */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaWhatsapp size={"25px"} />
            <Box>
              <Typography fontWeight="500">
                Whatsapp Number
              </Typography>
              <Typography color={medium}>{phonenumber}</Typography>
            </Box>
          </FlexBetween>
          <IconButton>
            <EditOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaLinkedinIn size={"25px"} />
            <Box>
              <Typography fontWeight="500">
                LinkedIn
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <IconButton>
            <EditOutlined sx={{ color: main }} />
          </IconButton>
        </FlexBetween>
      </Box>
      {openEdit && <EditProfilePage onClose={() => setOpenEdit(false)} />}
    </WidgetWrapper>
  );
};

export default UserWidget;
