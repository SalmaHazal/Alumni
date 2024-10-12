import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box, useTheme } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Validation schema for the form
const JobPostSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  company: Yup.string().required('Company name is required'),
  workPlaceType: Yup.string().required('Please select a workplace type'),
  workPlace: Yup.string().required('Workplace location is required'),
  workType: Yup.string().required('Please select an employment type'),
  rhLinkedIn: Yup.string().url('Enter a valid URL').required('RH LinkedIn profile is required'),
});

const JobPostForm = () => {
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme

  // Handle file upload
  const handleLogoUpload = (event) => {
    setLogo(event.currentTarget.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('company', values.company);
    formData.append('workPlaceType', values.workPlaceType);
    formData.append('workPlace', values.workPlace);
    formData.append('workType', values.workType);
    formData.append('rhLinkedIn', values.rhLinkedIn);
    if (logo) {
      formData.append('companyLogo', logo);
    }

    try {
      const response = await axios.post('http://localhost:3001/api/job-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Job Posted:', response.data);
      navigate('/post-jobs');
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('There was an error posting the job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: theme.palette.background.paper, // Use theme background color
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        mt: 5,
        color: theme.palette.text.primary, // Use theme text color
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Post a Job
      </Typography>
      <Typography variant="body2" align="center" gutterBottom>
        Improve the quality of your recruitment
      </Typography>

      <Formik
        initialValues={{
          title: '',
          company: '',
          workPlaceType: '',
          workPlace: '',
          workType: '',
          rhLinkedIn: '',
        }}
        validationSchema={JobPostSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Field name="title">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
              )}
            </Field>

            <Field name="company">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Company"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.company && Boolean(errors.company)}
                  helperText={touched.company && errors.company}
                />
              )}
            </Field>

            <FormControl
              fullWidth
              margin="normal"
              error={touched.workPlaceType && Boolean(errors.workPlaceType)}
            >
              <InputLabel>Workplace Type</InputLabel>
              <Field name="workPlaceType" as={Select} variant="outlined">
                <MenuItem value="onsite">Onsite</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Field>
              {touched.workPlaceType && errors.workPlaceType && (
                <Typography variant="caption" color="error">
                  {errors.workPlaceType}
                </Typography>
              )}
            </FormControl>

            <Field name="workPlace">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Workplace"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.workPlace && Boolean(errors.workPlace)}
                  helperText={touched.workPlace && errors.workPlace}
                />
              )}
            </Field>

            <FormControl
              fullWidth
              margin="normal"
              error={touched.workType && Boolean(errors.workType)}
            >
              <InputLabel>Employment Type</InputLabel>
              <Field name="workType" as={Select} variant="outlined">
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
              </Field>
              {touched.workType && errors.workType && (
                <Typography variant="caption" color="error">
                  {errors.workType}
                </Typography>
              )}
            </FormControl>

            <Field name="rhLinkedIn">
              {({ field }) => (
                <TextField
                  {...field}
                  label="RH LinkedIn Profile"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={touched.rhLinkedIn && Boolean(errors.rhLinkedIn)}
                  helperText={touched.rhLinkedIn && errors.rhLinkedIn}
                />
              )}
            </Field>

            <Field name="companyLogo">
              {({ field }) => (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ marginTop: '20px' }}
                />
              )}
            </Field>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#0073b1',
                '&:hover': {
                  backgroundColor: '#005f8d',
                },
              }}
            >
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                marginTop: '10px',
                padding: '10px',
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={() => navigate('/post-jobs')}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default JobPostForm;
