import React from 'react';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';

import './Account.css';

import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { Box, Stack } from '@mui/system';
import { ErrorText } from 'components/Atoms/ErrorText';
import LogoHeader from 'components/Atoms/LogoHeader';

const validationSchema = Yup.object({
    code: Yup.string()
        .label('Code')
        .required('Verification code is required')
        .min(1),
});

interface VerifyCodeSchema {
    code: string;
}

export default function MfaVerificationForm() {
    const { verifyMfaCode, authLoading, signOut } = useAuth();

    const onSubmit = async (
        { code }: VerifyCodeSchema,
        { setErrors, setSubmitting }: FormikHelpers<VerifyCodeSchema>
    ) => {
        setSubmitting(true);
        setErrors({}); // blow out old errors before re-submitting

        const { errorMessage } = await verifyMfaCode(code);

        if (errorMessage?.length) {
            setErrors({ code: errorMessage });
        }

        // successful logins should be handled by the hook/routes logic
        setSubmitting(false);
    };

    const focusInputField = (input: unknown) => {
        if (input) {
            setTimeout(() => {
                // @ts-expect-error focus exists on this ref type
                input?.focus();
            }, 100);
        }
    };

    return (
        <Formik<VerifyCodeSchema>
            initialValues={{
                code: '',
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ errors, submitForm, values }) => (
                <Stack alignItems='center'>
                    <LogoHeader title='Enter SMS verification code' />
                    <Field
                        name='code'
                        required
                        ref={focusInputField}
                        autoFocus
                        label='SMS Code'
                        id='code'
                        type='input'
                        as={TextField}
                        variant='outlined'
                        style={{ width: '12rem', marginTop: '1rem' }}
                    />
                    <Box
                        width='100%'
                        justifyContent='space-between'
                        marginTop='2rem'
                        display='flex'
                    >
                        <Button
                            size='small'
                            content='Restart'
                            style={buttonStyles}
                            onClick={signOut}
                        />
                        <Button
                            color='teal'
                            disabled={!values?.code?.length}
                            loading={authLoading}
                            size='small'
                            type='submit'
                            content='Submit'
                            style={buttonStyles}
                            onClick={submitForm}
                        />
                    </Box>
                    {Object.keys(errors).map((errorKey) => (
                        <ErrorText
                            key={errorKey}
                            message={`${
                                errors?.[errorKey as keyof VerifyCodeSchema]
                            }`}
                        />
                    ))}
                </Stack>
            )}
        </Formik>
    );
}

const buttonStyles = {
    paddingLeft: '2rem',
    paddingRight: '2rem',
};
