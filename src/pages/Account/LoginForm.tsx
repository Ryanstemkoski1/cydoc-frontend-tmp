import React from 'react';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';

import './Account.css';

import { Button, Container, Image, Header, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import './Account.css';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { ErrorText } from 'components/Atoms/ErrorText';

const validationSchema = Yup.object({
    email: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
    password: Yup.string()
        .label('Password')
        .trim()
        .required('Password is required')
        .min(6), // TODO: link up min with ACTUAL password minimum
});

interface LoginSchema {
    email: string;
    password: string;
    loginError?: string;
}

const Login = () => {
    const { signIn } = useAuth();

    const onSubmit = async (
        { email, password }: LoginSchema,
        { setErrors, setSubmitting }: FormikHelpers<LoginSchema>
    ) => {
        setErrors({});
        setSubmitting(true);
        const { errorMessage } = await signIn(email, password);
        if (errorMessage?.length) {
            setErrors({ loginError: errorMessage });
        }
        // successful logins should be handled by the hook/routes logic

        setSubmitting(false);
    };

    return (
        <>
            <Formik<LoginSchema>
                initialValues={{
                    email: '',
                    password: '',
                }}
                onSubmit={onSubmit}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm, isSubmitting }) => (
                    <div>
                        <Container textAlign='center'>
                            <Image size='tiny' href='/' src={Logo} alt='logo' />
                            <Header
                                as='h1'
                                className='logo-text'
                                content='Cydoc'
                            />
                        </Container>
                        <Container
                            className='login-header'
                            color='black'
                            textAlign='center'
                            content='Login'
                        />
                        <Field
                            name='email'
                            margin='normal'
                            required
                            fullWidth
                            label='Email'
                            id='email'
                            type='input'
                            as={TextField}
                            variant='outlined'
                        />
                        <Field
                            fullWidth
                            name='password'
                            margin='normal'
                            autoComplete='current-password'
                            required
                            label='Password'
                            type='password'
                            id='password'
                            as={TextField}
                            variant='outlined'
                        />
                        <Grid align='middle'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Link
                                        style={{ color: '#007db3' }}
                                        to='/forgotpasswordemail'
                                        className='forgot-password-button'
                                    >
                                        Forgot Password?
                                    </Link>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                    <Button
                                        color='teal'
                                        size='small'
                                        type='submit'
                                        loading={isSubmitting}
                                        aria-label='login-button'
                                        content='Login'
                                        onClick={submitForm}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <ErrorText
                            key={'loginError'}
                            message={errors?.loginError || null}
                        />
                    </div>
                )}
            </Formik>
        </>
    );
};

export default Login;
