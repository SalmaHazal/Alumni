import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup"; // Import Yup for validation
import { useFormik } from "formik"; // Use Formik for handling form state and validation

function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  // Define validation schema using Yup
  const validationSchema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  // Use Formik for form handling
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(`http://localhost:3001/reset-password/${id}/${token}`, {
          password: values.password,
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            toast.success("Password Successfully Updated");
            navigate("/");
          }
        })
        .catch((err) => toast.error("An Error Occurred"));
    },
  });

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Box
      className="d-flex justify-content-center align-items-center bg-secondary vh-100"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "secondary.main",
      }}
    >
      <Box
        className="bg-white p-3 rounded w-25"
        sx={{ backgroundColor: "white", p: 3, borderRadius: 1, width: "25%" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box className="mb-3" sx={{ mb: 3 }}>
            <TextField
              label="New Password"
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              fullWidth
              variant="outlined"
              value={formik.values.password} // Bind value to Formik state
              onChange={formik.handleChange} // Use Formik change handler
              onBlur={formik.handleBlur} // Use Formik blur handler
              error={formik.touched.password && Boolean(formik.errors.password)} // Show error if field is touched and has an error
              helperText={formik.touched.password && formik.errors.password} // Show helper text for the error
            />
          </Box>
          <Box className="mb-3" sx={{ mb: 3 }}>
            <TextField
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              name="confirmPassword"
              fullWidth
              variant="outlined"
              value={formik.values.confirmPassword} // Bind value to Formik state
              onChange={formik.handleChange} // Use Formik change handler
              onBlur={formik.handleBlur} // Use Formik blur handler
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              } // Show error if field is touched and has an error
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              } // Show helper text for the error
            />
          </Box>
          <Box className="d-flex gap-2" sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#00CFFF",
                "&:hover": { backgroundColor: "#00B0E0" },
              }}
            >
              Update
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default ResetPassword;
