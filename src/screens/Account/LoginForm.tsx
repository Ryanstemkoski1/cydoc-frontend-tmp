import React from 'react';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';

import './Account.css';

import { Button } from 'semantic-ui-react';
import Link from 'next/link';
import './Account.css';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';
import { ErrorText } from '@components/Atoms/ErrorText';
import { Box } from '@mui/system';
import LogoHeader from '@components/Atoms/LogoHeader';
import { SubmitOnEnter } from '@components/Atoms/SubmitOnEnter';

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
        .min(7),
});

interface LoginSchema {
    email: string;
    password: string;
    loginError?: string;
}

const LoginForm = () => {
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
                        <LogoHeader title='Login' />
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
                        <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Link
                                href='/forgot-password'
                                className='forgot-password-button'
                                style={{ color: '#007db3' }}
                            >
                                Forgot Password?
                            </Link>
                            <SubmitOnEnter />
                            <Button
                                color='teal'
                                size='small'
                                type='submit'
                                loading={isSubmitting}
                                aria-label='login-button'
                                content='Login'
                                onClick={submitForm}
                                style={{ marginTop: '.5rem' }}
                            />
                        </Box>
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

export default LoginForm;
