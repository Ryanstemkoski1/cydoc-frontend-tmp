'use client';
import React, { useEffect } from 'react';

import { CenteredPaper } from '@components/Atoms/CenteredPaper';
import useAuth from 'hooks/useAuth';
import { useRouter } from 'next/navigation';
import './Account.css';
import FirstLoginForm from './FirstLoginForm';
import LoginForm from './LoginForm';
import MfaVerificationForm from './MfaVerificationForm';

const LoginPage = () => {
    const { loginCorrect, isSignedIn, passwordResetRequired } = useAuth();
    const router = useRouter();

    useEffect(() => {
        loginCorrect && isSignedIn && router.push('/hpi/doctor');
    });

    if (passwordResetRequired) {
        return <FirstLoginForm />;
    } else {
        return (
            <CenteredPaper>
                {loginCorrect ? <MfaVerificationForm /> : <LoginForm />}
            </CenteredPaper>
        );
    }
};

export default LoginPage;
