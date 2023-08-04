import React, { useState } from 'react';
import { Container, Image, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import './Account.css';
import ForgotPasswordEmailForm from './ForgotPasswordEmailForm';
import ForgotPasswordCodeForm from './ForgotPasswordCodeForm';
import { Stack, Typography } from '@mui/material';
import { CenteredPaper } from 'components/Atoms/CenteredPaper';

const ForgotPasswordPage = () => {
    const [codeSentEmail, setCodeSentEmail] = useState('');
    const [obfuscatedEmail, setObfuscatedEmail] = useState('');

    const [codeVerified, setCodeVerified] = useState(false);

    return (
        <CenteredPaper>
            <Container textAlign='center'>
                <Image size='tiny' href='/' src={Logo} alt='logo' />
                <Header as='h1' className='logo-text' content='Cydoc' />
                <Typography>Forgot password</Typography>
            </Container>

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
                Password updated.
            </Typography>
            <Link
                style={{ color: '#007db3' }}
                to='/login'
                className='forgot-password-button'
            >
                Back to Login Page
            </Link>
        </Stack>
    );
}
