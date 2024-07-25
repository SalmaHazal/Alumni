import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    axios
      .post(`http://localhost:3001/reset-password/${id}/${token}`, { password })
      .then((res) => {
        console.log("Response:", res.data); // Debug log
        if (res.data.Status === "Success") {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    navigate("/"); // Change this path to your desired route
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
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box className="mb-3" sx={{ mb: 3 }}>
            <TextField
              label="New Password"
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
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
