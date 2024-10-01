import { Box, Typography, useMediaQuery } from "@mui/material";
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



const Light_Dark = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const language = i18n.language;  // Get the current language

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "Right",
          marginTop: "50px", // Contrôle de l'espace en haut
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
            marginTop: "20px", // Contrôle de l'espace entre le texte et le widget
            marginLeft: language === "ar" ? "-10%" : "60%", // Adjust positioning based on language
          }}
        >
          <Typography color="#37B7C3" variant="h4" sx={{ marginLeft: language === "ar" ? "20%" : "39%" }}>
            {t("Select your mode")}
          </Typography>

          <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "Right",
          marginTop: "40px", // Contrôle de l'espace en haut
        }}
      >
        {/* Add Dark Mode/Light Mode toggle item */}
        <MenuItem onClick={() => dispatch(setMode())}>
          <ListItemIcon sx={{padding:"5px"}}>
            {theme.palette.mode === "dark" ? (
              <LightMode fontSize="large" />
            ) : (
              <DarkMode fontSize="large" />
            )}
              </ListItemIcon>
              <Typography
                style={{
                fontSize: theme.palette.mode === "dark" ? "18px" : "14px",
                marginLeft: "10px"
            }}
            >
              {theme.palette.mode === "dark" ? t("Light Mode") : t("Dark Mode")}
              </Typography>

        </MenuItem>
        <Typography color="#37B7C3" variant="h9" sx={{marginLeft:"30px", fontFamily:"inherit"}} >
        {t("Adjust the appearance of Alumni to reduce glare and give your eyes a break")}
        </Typography>
      </Box>

        </WidgetWrapper>
      </Box>
    </>
  );
};

export default Light_Dark;
