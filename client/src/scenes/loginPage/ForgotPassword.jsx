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

    const handleCancel = () => {
        navigate('/'); // Change this path to your desired route
    };

    return (
        <Box className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <Box className="bg-white p-3 rounded" sx={{ width: '25%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Forgot Password
                </Typography>
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
