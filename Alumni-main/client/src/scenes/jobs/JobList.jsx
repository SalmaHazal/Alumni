import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Typography, Container, Paper, Grid, Avatar, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from "../navbar/Navbar"; // Import the Navbar

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/job-posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Reverse the jobs array to display the most recent ones first
        const jobsArray = Array.isArray(response.data) ? response.data.reverse() : [];
        setJobs(jobsArray);
        setError(null);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs. Please try again later.');
        setJobs([]);
      }
    };
  
    fetchJobs();
  }, [token]);
  

  const handleAddJobClick = () => {
    navigate('/job-form');
  };

  return (
    <Box>
      <Navbar />
     <Container>
      <Grid container spacing={2}>
        {/* Left Sidebar */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={2} style={{ padding: '10px' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
              my job offers
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddJobClick}
              style={{
                backgroundColor: '#0073b1',
                marginBottom: '20px',
              }}
            >
              Add Job
            </Button>
          </Paper>
        </Grid>

        {/* Main Content - Job Listings */}
        <Grid item xs={12} sm={8} md={9}>
          <Paper elevation={2} style={{ padding: '10px', marginBottom: '20px' }}>
            <Typography variant="h5">new job offers</Typography>
          </Paper>

          {error && (
            <Typography color="error" style={{ marginBottom: '20px' }}>
              {error}
            </Typography>
          )}

          {(!Array.isArray(jobs) || jobs.length === 0) && !error ? (
            <Typography>No jobs available.</Typography>
          ) : (
            <div>
              {jobs.map((job) => {
                console.log(job); // Log the job object to inspect its structure
                return (
                  <Paper
                    key={job._id}
                    style={{
                      display: 'flex',
                      padding: '10px',
                      marginBottom: '10px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Job Logo */}
                    <Avatar
                      src={
                        job.companyLogo
                          ? `http://localhost:3001/${job.companyLogo.replace(/\\/g, '/')}`
                          : '/default-logo.png'
                      }
                      alt={`${job.company || 'Company'} Logo`}
                      style={{ marginRight: '15px', width: '60px', height: '60px' }}
                    />

                    <Box style={{ flexGrow: 1 }}>
                      {/* Job Title */}
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {job.title}
                      </Typography>

                      {/* Company Name and Location */}
                      <Typography variant="body1">
                        {job.company || 'Unknown'} - {job.workPlace || 'Unknown'}
                      </Typography>

                      {/* Workplace Type and Promotion */}
                      <Typography variant="body2" color="textSecondary">
                        {job.workPlaceType || '-'} {job.isPromoted && ' - Promu(e)'}
                      </Typography>

                      {/* HR LinkedIn Profile */}
                      {job.rhLinkedIn && (
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                          <Link href={job.rhLinkedIn} target="_blank" rel="noopener noreferrer">
                            HR LinkedIn Profile
                          </Link>
                        </Typography>
                      )}
                    </Box>

                    {/* Promotion Label */}
                    {job.isPromoted && (
                      <Typography
                        variant="caption"
                        style={{
                          backgroundColor: '#ececec',
                          padding: '5px',
                          borderRadius: '5px',
                          fontWeight: 'bold',
                        }}
                      >
                        Promu(e)
                      </Typography>
                    )}
                  </Paper>
                );
              })}
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default JobList;
