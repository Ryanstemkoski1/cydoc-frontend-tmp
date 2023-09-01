import React from 'react';
import { useHistory } from 'react-router-dom';
import SignUpForm from './Account/SignUpForm';

export default function SignUp() {
    const history = useHistory();

    return <SignUpForm modalOpen closeModal={history.goBack} />;
}
