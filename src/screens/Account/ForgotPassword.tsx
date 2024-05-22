'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './Account.css';
import ForgotPasswordEmailForm from './ForgotPasswordEmailForm';
import ForgotPasswordCodeForm from './ForgotPasswordCodeForm';
import { Stack, Typography } from '@mui/material';
import { CenteredPaper } from '@components/Atoms/CenteredPaper';
import LogoHeader from '@components/Atoms/LogoHeader';

const ForgotPasswordPage = () => {
    const [codeSentEmail, setCodeSentEmail] = useState('');
    const [obfuscatedEmail, setObfuscatedEmail] = useState('');

    const [codeVerified, setCodeVerified] = useState(false);

    return (
        <CenteredPaper>
            <LogoHeader title='Forgot password' />
            <div className='forgot-password-email'>
                {!codeSentEmail || !obfuscatedEmail ? (
                    <ForgotPasswordEmailForm
                        onSuccessfulSubmission={(email, newObfuscatedEmail) => {
                            setCodeSentEmail(email);
                            setObfuscatedEmail(newObfuscatedEmail);
                        }}
                    />
                ) : !codeVerified ? (
                    <ForgotPasswordCodeForm
                        obfuscatedEmail={obfuscatedEmail}
                        email={codeSentEmail}
                        onSuccess={() => setCodeVerified(true)}
                        onReset={() => {
                            setCodeSentEmail('');
                            setObfuscatedEmail('');
                        }}
                    />
                ) : (
                    <SuccessMessage />
                )}
            </div>
        </CenteredPaper>
    );
};

export default ForgotPasswordPage;

function SuccessMessage() {
    return (
        <Stack display='flex'>
            <Typography margin='1rem' paddingTop='1rem' textAlign='center'>
                Password updated!
            </Typography>
            <Link
                href='/login'
                style={{ color: '#007db3' }}
                className='forgot-password-button'
            >
                Back to Login Page
            </Link>
        </Stack>
    );
}
