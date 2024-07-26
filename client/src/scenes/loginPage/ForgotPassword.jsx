import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Box, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forgot-password", { email })
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Please Check Your Email");
          navigate("/");
        }
      })
      .catch((err) => toast.error("An Error Occurred"));
  };

  const handleCancel = () => {
    navigate("/"); // Change this path to your desired route
  };

  return (
    <Box className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <Box className="bg-white rounded p-3 w-full max-w-lg mx-auto mt-60">
        <Typography variant="h4" align="center" gutterBottom>
          Find Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Typography variant="body1" className="text-[17px] my-3">
              Please enter your email address to search for your account
            </Typography>
            <TextField
              label="Email"
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ flexGrow: 1 }}
            >
              Send
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={handleCancel}
              sx={{ flexGrow: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
