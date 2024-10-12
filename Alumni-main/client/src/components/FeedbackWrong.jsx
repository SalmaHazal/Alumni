import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem, Box } from '@mui/material';
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    area: '',    // Updated to match controller
    details: '', // Updated to match controller
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = '12345';  // You may replace this with the actual user ID logic

      const newFeedback = {
        area: formData.area,      // Correct field names
        details: formData.details, // Correct field names
        userId: userId,
      };

      // Make the POST request
      await makeRequest.post("/wrongfeedbacks", newFeedback);

      // Show success message
      toast.success("Wrong feedback sent successfully!");
    } catch (error) {
      console.error("Error adding feedback", error);
      toast.error("Error adding feedback");
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{  marginLeft: "30%", color: "#37B7C3", fontSize: "21px" }}>
        Something went wrong
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Choose an area"
          name="area"  // Updated to 'area'
          value={formData.area}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#37B7C3' },
              '&:hover fieldset': { borderColor: '#37B7C3' },
            },
          }}
        >
          <MenuItem value="ui">User Interface</MenuItem>
          <MenuItem value="performance">Performance</MenuItem>
          <MenuItem value="features">New Features</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Details"
          name="details"  // Updated to 'details'
          value={formData.details}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
          variant="outlined"
          margin="normal"
          placeholder="Please include as much info as possible..."
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#37B7C3' },
              '&:hover fieldset': { borderColor: '#37B7C3' },
            },
          }}
        />

        <Button variant="contained" component="label" sx={{ marginTop: 2, marginBottom: 2, backgroundColor: '#37B7C3' }}>
          Add a Screenshot or Video
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button
            variant="text"
            sx={{ color: '#b0b3b8' }}
            onClick={() => {
            navigate('/Feedbackpage');
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#37B7C3' }}
          >
            Submit
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: 2, color: '#37B7C3' }}>
          Let us know if you have ideas that can help make our products better.
        </Typography>
      </form>
    </>
  );
};

export default FeedbackForm;
