import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "../../scenes/settings/Settings";
import WidgetWrapper from "../../components/WidgetWrapper";

import { useTranslation } from 'react-i18next';


const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  newPassword: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmpassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const initialValuesLogin = {
  email: "",
  password: "",
  newPassword: "",
  confirmpassword: "",
};

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { t, i18n } = useTranslation();

  const language = i18n.language; 

 
  const changePassword = async (token, newPassword) => {
    try {
      const response = await fetch("http://localhost:3001/changepassword/pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify({ newPassword }), // Send the new password
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Password updated successfully!");
      } else {
        toast.error(result.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating the password.");
    }
  };

 
  const login = async (values, onSubmitProps) => {
    try {
    
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const loggedIn = await loggedInResponse.json();

 
      onSubmitProps.resetForm();

      if (loggedIn && loggedIn.user && loggedIn.token) {
     
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        
        await changePassword(loggedIn.token, values.newPassword);

        
        navigate("/home");
        toast.success("Password updated successfully!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    
    if (values.newPassword !== values.confirmpassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    
    await login(values, onSubmitProps);
  };

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
            marginTop: "-40px", // Contrôle de l'espace entre le texte et le widget
            marginLeft: language === "ar" ? "-10%" : "60%", // Adjust positioning based on language
          }}
        >
             <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {/* Email field */}
            <TextField
              label="Email"
              title="Example : John@gmail.com"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />

            {/* Current Password field */}
            <TextField
              label="Current Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />

            {/* New Password field */}
            <TextField
              label="New Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.newPassword}
              name="newPassword"
              error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
              sx={{ gridColumn: "span 4" }}
            />

            {/* Confirm New Password field */}
            <TextField
              label="Confirm New Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmpassword}
              name="confirmpassword"
              error={Boolean(touched.confirmpassword) && Boolean(errors.confirmpassword)}
              helperText={touched.confirmpassword && errors.confirmpassword}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* Submit Button */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Update
            </Button>
          </Box>
        </form>
      )}
    </Formik>
    </WidgetWrapper>
    </Box>
    

    </>
  );
};

export default Form;
