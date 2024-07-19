import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";

const EditProfilePage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
    picturePath: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Failed to load user data");
      }
      setLoading(false);
    };

    getUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);
    formData.append("location", user.location);
    formData.append("occupation", user.occupation);
    if (selectedFile) {
      formData.append("picture", selectedFile);
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        navigate(`/profile/${userId}`);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding="2rem">
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          label="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          name="location"
          value={user.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Occupation"
          name="occupation"
          value={user.occupation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" component="span" fullWidth>
            Add Picture Here
          </Button>
        </label>
        {selectedFile && (
          <Box mt={2}>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "5px",
                marginBottom: "1rem",
              }}
            />
            <Typography>{selectedFile.name}</Typography>
          </Box>
        )}
        <br />
        <br />
        
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </form>
    </Box>
  );
};

export default EditProfilePage;
