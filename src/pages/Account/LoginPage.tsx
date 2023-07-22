import React, { useEffect, useState } from 'react';

import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';
import SignUpForm from './SignUpForm';

import './Account.css';
import LoginForm from './LoginForm';
import { useAuth } from 'hooks/useAuth';
import MfaVerificationForm from './MfaVerificationForm';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const { isSignedIn, mfaCompleted } = useAuth();
    const history = useHistory();

    const [isFirstLogin, setIsFirstLogin] = useState(false);

    useEffect(() => {
        isSignedIn && mfaCompleted && history.push('/');
    });

    if (isFirstLogin) {
        return (
            <SignUpForm
                modalOpen={isFirstLogin}
                closeModal={() => {
                    // Don't allow users to close modal when requiring their "first login" user info
                    null;
                }}
            />
        );
    } else {
        // TODO: move NavMenu logic to routes
        return (
            <>
                <NavMenu attached={'top'} displayNoteName={false} />
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        padding: '10rem',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{ width: '30rem', padding: '2.5rem' }}
                    >
                        {isSignedIn ? <MfaVerificationForm /> : <LoginForm />}
                    </Paper>
                </Box>
            </>
        );
    }
};

export default Login;
