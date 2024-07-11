'use client';

import React, { useCallback } from 'react';
import { Field, Formik, FormikHelpers } from 'formik';

import './Account.css';

import { Button } from 'semantic-ui-react';
import './Account.css';
import * as Yup from 'yup';
import { ErrorText } from '@components/Atoms/ErrorText';
import { TextField } from '@mui/material';
import { sendResetPasswordCode } from 'auth/cognito';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
    email: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
});

interface EmailSchema {
    email: string;
    emailError?: string;
}

interface Props {
    onSuccessfulSubmission: (email: string, obfuscatedEmail: string) => void;
}

const ForgotPasswordEmailForm = ({ onSuccessfulSubmission }: Props) => {
    const router = useRouter();
    // const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    const onSubmit = useCallback(
        async (
            { email }: EmailSchema,
            { setErrors, setSubmitting }: FormikHelpers<EmailSchema>
        ) => {
            setErrors({});
            setSubmitting(true);

            // enter email and send code
            const emailResponse = await sendResetPasswordCode(email);

            if (emailResponse.success && emailResponse?.obfuscatedEmail) {
                onSuccessfulSubmission(email, emailResponse?.obfuscatedEmail);
            }
            setSubmitting(false);
        },
        [onSuccessfulSubmission]
    );

    return (
        <>
            <Formik<EmailSchema>
                initialValues={{
                    email: '',
                }}
                onSubmit={onSubmit}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm, isSubmitting }) => (
                    <div>
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
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            marginTop='1rem'
                        >
                            <Button
                                basic
                                color='teal'
                                content='Cancel'
                                type='button'
                                onClick={() => router.push('/login')}
                            />
                            <Button
                                color='teal'
                                size='small'
                                type='submit'
                                loading={isSubmitting}
                                aria-label='continue-button'
                                content='Continue'
                                onClick={submitForm}
                            />
                        </Box>
                        <ErrorText
                            key={'loginError'}
                            message={errors?.emailError || null}
                        />
                    </div>
                )}
            </Formik>
        </>
    );
};

export default ForgotPasswordEmailForm;
