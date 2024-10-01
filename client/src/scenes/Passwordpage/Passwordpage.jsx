import React, { useState } from "react";
import { Box, Typography, useMediaQuery, Button, TextField } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import Settings from "../../scenes/settings/Settings";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Passwordpage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const language = i18n.language;  
  const navigate = useNavigate();

  // State management for passwords
  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }
    
    try {
      
      const response = await fetch(`http://localhost:3001/changepassword/pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actualPassword,
          newPassword,
        }),
      });
     if (response.ok) {
      const result= response.json();
      setSuccessMessage(result.message || "Password updated successfully!");
      setErrorMessage("");
      setActualPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
     }

    }
    catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }

  };

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
            {t("Change your Password")}
          </Typography>
          
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Right",
              marginTop: "40px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <TextField 
                id="actual-password" 
                label="Actual password" 
                variant="outlined" 
                fullWidth
                value={actualPassword}
                onChange={(e) => setActualPassword(e.target.value)}
              />
              
              <TextField 
                id="new-password" 
                label="New password" 
                variant="outlined" 
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
              <TextField 
                id="confirm-password" 
                label="Confirm your password" 
                variant="outlined" 
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              {successMessage && <Typography color="success">{successMessage}</Typography>}
              
              <Button variant="outlined" startIcon={<DeleteIcon />} type="submit">
                Update
              </Button>
            </form>
          </Box>
        </WidgetWrapper>
      </Box>
    </>
  );
};

export default Passwordpage;
