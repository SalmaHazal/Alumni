import { Box, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@mui/material";
import React from "react";
import Settings from "../../scenes/settings/Settings";
import Languageselector from "../../components/language-selector";


const  Activitylog= () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const { t, i18n } = useTranslation();

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
            {t("Select your language")}
          </Typography>
          
        </WidgetWrapper>
      </Box>
    </>
  );
};

export default Activitylog;
