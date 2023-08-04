import React, { useEffect } from 'react';

import './Account.css';

import './Account.css';
import useAuth from 'hooks/useAuth';
import MfaVerificationForm from './MfaVerificationForm';
import { useHistory } from 'react-router-dom';
import FirstLoginForm from './FirstLoginForm';
import LoginForm from './LoginForm';
import { CenteredPaper } from 'components/Atoms/CenteredPaper';

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
            <CenteredPaper>
                {loginCorrect ? <MfaVerificationForm /> : <LoginForm />}
            </CenteredPaper>
        );
    }
};

export default LoginPage;
