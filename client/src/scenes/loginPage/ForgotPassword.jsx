import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button, Box, TextField, Typography } from '@mui/material';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/forgot-password', { email })
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/');
                }
            }).catch(err => console.log(err));
    }

    return (
        <Box className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <Box className="bg-white p-3 rounded" sx={{ width: '25%' }}>
                <Typography variant="h4">Forgot Password</Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <Typography variant="body1" component="label" htmlFor="email" fontWeight="bold">
                            Email
                        </Typography>
                        <TextField
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{ 
                            borderRadius: 0, 
                            backgroundColor: '#87CEEB', // Sky blue color
                            '&:hover': { 
                                backgroundColor: '#00BFFF' // Deep sky blue color for hover
                            } 
                        }}>
                        Send
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default ForgotPassword;
