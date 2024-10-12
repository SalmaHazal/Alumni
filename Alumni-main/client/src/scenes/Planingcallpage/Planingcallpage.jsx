import {
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
  import { FaUserEdit } from "react-icons/fa";
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
  import Settings from "../../scenes/settings/Settings";
  import SendIcon from '@mui/icons-material/Send';
 
  
  const Planingcallpage = () => {
    const currentUser = useSelector((state) => state.user);
    const userId = currentUser?._id; 
    const picturePath = currentUser?.picturePath; // Derive userId from Redux
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
    const [resumeLink, setResumeLink] = useState("");
    const [portfolioLink, setPortfolioLink] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [linkedInLink, setLinkedInLink] = useState("");
    const [tempLink, setTempLink] = useState("");
    const { t ,  i18n} = useTranslation();
    const language = i18n.language;
   
  
  
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "Right",
            marginTop: "20px", // Contrôle de l'espace en haut
          }}
        >
          <Settings />
        </Box>
  
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            marginTop: "-600px",
            marginRight: "600px", // Contrôle de l'espace en haut
          }}
        >
          <WidgetWrapper
            width="800px"
            sx={{
              marginTop: "-40px", // Contrôle de l'espace entre le texte et le widget
              marginLeft: language === "ar" ? "-10%" : "60%", // Adjust positioning based on language
            }}
          >
          
      </WidgetWrapper>
      </Box>
      
  
      </>
    );
  };
  
  export default Planingcallpage;
  