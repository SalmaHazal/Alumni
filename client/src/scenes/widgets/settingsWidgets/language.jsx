import { Button, Box, Typography } from "@mui/material";
import { MdLanguage } from "react-icons/md";
import { useTheme } from "@mui/material/styles";
import { Language } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

import Changelang from "./Changelanguage";
import {useState } from "react";
import { useNavigate } from "react-router-dom";

const LanguageWidget = () => {
  const theme = useTheme();
  const { palette } = theme;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
          navigate('/choselang');
        }}
      sx={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        width: "90%",
        height: "90%",
        backgroundColor: palette.background.alt,
        color: palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "none", // to keep the case of the text as is
        padding: "1rem",
        borderRadius: "8px", // Rounded corners
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: palette.primary.light, // Change background on hover
        },
      }}
    >
      <MdLanguage
        style={{
          width: "40%", // Reduced size for better visual balance
          height: "40%",
          marginBottom: "0.5rem", // Added margin to separate icon from text
          color:"#3ABEF9"
        }}
      />
      <Typography variant="h8" align="center" color="#3ABEF9">
      { t ("language")}
      </Typography>

    </Button>
  );
};

export default LanguageWidget;
