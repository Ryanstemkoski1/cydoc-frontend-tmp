import React, { useEffect } from 'react';

import './Account.css';

import './Account.css';
import useAuth from 'hooks/useAuth';
import MfaVerificationForm from './MfaVerificationForm';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';
import FirstLoginForm from './FirstLoginForm';
import LoginForm from './LoginForm';

const LoginPage = () => {
    const { loginCorrect, isSignedIn, passwordResetRequired } = useAuth();
    const history = useHistory();

    useEffect(() => {
        loginCorrect && isSignedIn && history.push('/');
    });

    if (passwordResetRequired) {
        // if (true) {
        return <FirstLoginForm />;
    } else {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    padding: '10rem',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Paper elevation={6} sx={{ width: '30rem', padding: '2.5rem' }}>
                    {loginCorrect ? <MfaVerificationForm /> : <LoginForm />}
                </Paper>
            </Box>
        );
    }
};

export default LoginPage;
