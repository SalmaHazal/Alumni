import { Box, Typography, useMediaQuery, Button } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@mui/material";
import React from "react";
import Settings from "../../scenes/settings/Settings";
import Languageselector from "../../components/language-selector";
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DarkMode, LightMode } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux"; 
import { setLogout, setMode } from "../../state/index"; 
import { FcPrivacy } from "react-icons/fc";
import { MdArrowForward } from "react-icons/md"; 
import { RiLockPasswordFill } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { useNavigate } from "react-router-dom";




const Privacypage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const language = i18n.language;  
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "Right",
          marginTop: "50px", 
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
          marginRight: "600px", 
        }}
      >
       
        <WidgetWrapper
          width="800px"
          sx={{
            marginTop: "20px", 
            marginLeft: language === "ar" ? "-10%" : "60%", 
          }}
        >
          <Typography color="#37B7C3" variant="h4" sx={{ marginLeft: language === "ar" ? "20%" : "39%" }}>
            {t("privacy")}
          </Typography>

          <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "Right",
          marginTop: "40px", // Contrôle de l'espace en haut
        }}
      >
      <Button
       onClick={()=> navigate('/Passwordpage')}

      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "70%",
        maxWidth: "97%", 
        backgroundColor: palette.background.alt,
        color: palette.text.primary,
        display: "flex",
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "none",
        padding: "1rem 2rem", 
        borderRadius: "8px",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: palette.primary.light,
        },
      }}
    >
     <RiLockPasswordFill style={{ width: "40px", height: "40px", marginRight: "1rem", color:"#F3C623" }}/> 
     
      <Box sx={{ flexGrow: 1 }} >
      
        <Typography
          variant="h6" 
          color={palette.text.secondary}
          sx={{ textAlign: "left", marginBottom: "0.25rem" }} // Align text to the left
        >
          { t ("password")}
        </Typography>
        <Typography
          variant="body2"
          color="#37B7C3"  
          sx={{ textAlign: "left" }}
        >
          { t ("passwordsubtitle")}
        </Typography>
      </Box>


      <MdArrowForward style={{ width: "24px", height: "24px", color: palette.text.secondary }} />
    </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "Right",
          marginTop: "40px", 
        }}
      >
           <Button
          onClick={() => {
          navigate('/Persenaldetailspage');
        }}
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "70%",
        maxWidth: "97%", 
        backgroundColor: palette.background.alt,
        color: palette.text.primary,
        display: "flex",
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "none",
        padding: "1rem 2rem", 
        borderRadius: "8px",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: palette.primary.light,
        },
      }}
    >
    
      <CiViewList  style={{ width: "40px", height: "40px", marginRight: "1rem", color:"#73EC8B" }} />


      <Box sx={{ flexGrow: 1 }}>
      
        <Typography
          variant="h6" 
          color={palette.text.secondary}
          sx={{ textAlign: "left", marginBottom: "0.25rem" }} 
        >
          { t ("Personal details")}
        </Typography>
        <Typography
          variant="body2"
          color="#37B7C3"  
          sx={{ textAlign: "left" }}
        >
          { t ("Check your details here")}
        </Typography>
      </Box>


      <MdArrowForward style={{ width: "24px", height: "24px", color: palette.text.secondary }} />
    </Button>
      </Box>

        </WidgetWrapper>
      </Box>
    </>
  );
};

export default Privacypage ;
