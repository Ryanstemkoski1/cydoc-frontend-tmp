import React, { useEffect } from 'react';

import { CenteredPaper } from 'components/Atoms/CenteredPaper';
import useAuth from 'hooks/useAuth';
import { useHistory } from 'react-router-dom';
import './Account.css';
import FirstLoginForm from './FirstLoginForm';
import LoginForm from './LoginForm';
import MfaVerificationForm from './MfaVerificationForm';

const LoginPage = () => {
    const { loginCorrect, isSignedIn, passwordResetRequired } = useAuth();
    const history = useHistory();

    useEffect(() => {
        loginCorrect && isSignedIn && history.push('/hpi/doctor');
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
