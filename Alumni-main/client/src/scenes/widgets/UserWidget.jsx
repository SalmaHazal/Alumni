import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Language,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
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
import resume from "../../assets/cv.png";
import portfolio from "../../assets/portfolio.png";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const UserWidget = ({ userId, picturePath }) => {
  const currentUser = useSelector((state) => state?.user);
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.text.primary;
  const medium = palette.text.secondary;
  const main = palette.primary.main;
  const [openEdit, setOpenEdit] = useState(false);

  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [resumelink, setResumeLink] = useState("");
  const [portfoliolink, setPortfolioLink] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedInlink, setLinkedInLink] = useState("");
  const [tempLink, setTempLink] = useState("");
  const { t } = useTranslation();

  const handleClickOpen = (type) => {
    setDialogType(type);
    setTempLink(
      type === "resume"
        ? resumeLink
        : type === "portfolio"
        ? portfolioLink
        : type === "phonenumber"
        ? phoneNumber
        : type === "linkedin"
        ? linkedInLink
        : ""
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      let url;
      const data = { link: tempLink, userId: userId };
      switch (dialogType) {
        case "resume":
          url = "http://localhost:3001/api/updateResumeLink";
          setResumeLink(tempLink);
          break;
        case "portfolio":
          url = "http://localhost:3001/api/updatePortfolioLink";
          setPortfolioLink(tempLink);
          break;
        case "phonenumber":
          url = "http://localhost:3001/api/updatePhoneNumber";
          setPhoneNumber(tempLink);
          break;
        case "linkedin":
          url = "http://localhost:3001/api/updateLinkedInLink";
          setLinkedInLink(tempLink);
          break;
        default:
          break;
      }
      if (url) {
        await axios.post(url, data);
        await getUser();
      }
      setOpen(false);
    } catch (error) {
      console.error(`Error updating ${dialogType} link:`, error);
    }
  };

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
    _id,
    firstName,
    lastName,
    email,
    location,
    promotion,
    phonenumber,
    occupation,
    resumeLink,
    portfolioLink,
    linkedInLink,
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
            <Typography color={medium}>{friends.length} { t ("friend")}</Typography>
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
          <LocationOnOutlined sx={{ color: "#3ABEF9", fontSize: "29px" }} />
          <Box>
            <Typography fontWeight="500">{ t ("Location")}</Typography>
            <Typography color="textSecondary">{location}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined sx={{ color: "#65B741", fontSize: "25px" }} />
          <Box>
            <Typography fontWeight="500">{ t ("Occupation")}</Typography>
            <Typography color="textSecondary">{occupation}</Typography>
          </Box>
        </Box>
        <Box marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <PiGraduationCapFill size={"28px"} color="#EF5A6F" />
          <Box>
            <Typography fontWeight="500">{ t ("Promotion")}</Typography>
            <Typography color="textSecondary">{promotion}</Typography>
          </Box>
        </Box>
        <Box marginTop={"9px"} display="flex" alignItems="center" gap="1rem">
          <IoMailUnreadOutline size={"25px"} color="#de9f33" />
          <Box>
            <Typography fontWeight="500">{ t ("Email")}</Typography>
            <Typography color="textSecondary">{email}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" fontWeight="500" mb="0.5rem" mt="-15px">
        { t ("Professional Summary")}
        </Typography>

        {/* Resume */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img width="29px" src={resume} alt="Resume Icon" />
            <Box>
              <Typography fontWeight="500">{ t ("Resume")}</Typography>
              <Typography color="textSecondary">
                {resumeLink ? (
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    { t ("Link to the resume")}
                  </a>
                ) : (
                  "Link to the resume"
                )}
              </Typography>
            </Box>
          </FlexBetween>
          {currentUser._id === _id && (
            <IconButton onClick={() => handleClickOpen("resume")}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
          )}
        </FlexBetween>

        {/* Portfolio */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img width="29px" src={portfolio} alt="Portfolio Icon" />
            <Box>
              <Typography fontWeight="500">{ t ("Portfolio")}</Typography>
              <Typography marginBottom="15px" color="textSecondary">
                {portfolioLink ? (
                  <a
                    href={portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    { t ("Link to the portfolio")}
                  </a>
                ) : (
                  "Link to the portfolio"
                )}
              </Typography>
            </Box>
          </FlexBetween>
          {currentUser._id === _id && (
            <IconButton onClick={() => handleClickOpen("portfolio")}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
          )}
        </FlexBetween>

        <Divider />

        <Typography fontSize="1rem" fontWeight="500" mt="4px" mb="10px">
        { t ("Social Profiles")}
        </Typography>

        {/* Phone Number */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaWhatsapp color="#65B741" size={"25px"} />
            <Box>
              <Typography fontWeight="500">{ t ("Whatsapp Number")}</Typography>
              <Typography color="textSecondary">
                {phonenumber || "Add your phone number"}
              </Typography>
            </Box>
          </FlexBetween>
          {currentUser._id === _id && (
            <IconButton onClick={() => handleClickOpen("phonenumber")}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
          )}
        </FlexBetween>

        {/* LinkedIn */}
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <FaLinkedinIn color="#3ABEF9" size={"25px"} />
            <Box>
              <Typography fontWeight="500">{ t ("LinkedIn")}</Typography>
              <Typography color="textSecondary">
                {linkedInLink ? (
                  <a
                    href={linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    { t ("Link to LinkedIn")}
                  </a>
                ) : (
                  "Link to LinkedIn"
                )}
              </Typography>
            </Box>
          </FlexBetween>
          {currentUser._id === _id && (
            <IconButton onClick={() => handleClickOpen("linkedin")}>
              <EditOutlined sx={{ color: "primary.main" }} />
            </IconButton>
          )}
        </FlexBetween>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Update{" "}
            {dialogType === "resume"
              ? "Resume"
              : dialogType === "portfolio"
              ? "Portfolio"
              : dialogType === "phonenumber"
              ? "Phone Number"
              : "LinkedIn"}{" "}
            Link
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={
                dialogType === "phonenumber"
                  ? "Phone Number"
                  : `${
                      dialogType.charAt(0).toUpperCase() + dialogType.slice(1)
                    } Link`
              }
              type="url"
              fullWidth
              variant="outlined"
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {openEdit && <EditProfilePage onClose={() => setOpenEdit(false)} />}
    </WidgetWrapper>
  );
};

export default UserWidget;
