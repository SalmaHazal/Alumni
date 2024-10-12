import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../axios"; // Ensure axios is correctly set up

const Contactus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.message) errors.message = 'Message is required';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await makeRequest.post("/contactus", formData, { // Make sure "/api/contactus" matches your backend route
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success("Message sent successfully!");
      navigate('/Helppage');
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom color="#37B7C3">
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          required
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name ? errors.name : ''}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          required
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email ? errors.email : ''}
        />
        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          required
          multiline
          rows={4}
          error={Boolean(touched.message && errors.message)}
          helperText={touched.message && errors.message ? errors.message : ''}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button
            variant="text"
            sx={{ color: '#b0b3b8', width: '150px', marginTop: "20px" }}
            onClick={() => navigate('/Helppage')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '150px', marginTop: "20px" }}
          >
            Send
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Contactus;
