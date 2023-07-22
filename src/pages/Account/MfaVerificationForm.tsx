import React from 'react';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField, Typography } from '@mui/material';

import './Account.css';

import { Button, Image } from 'semantic-ui-react';
import Logo from '../../assets/cydoc-logo.svg';
import * as Yup from 'yup';
import { useAuth } from 'hooks/useAuth';
import { Box } from '@mui/system';
import { ErrorText } from 'components/Atoms/ErrorText';

const validationSchema = Yup.object({
    code: Yup.string()
        .label('Code')
        .required('Verifcation code is required')
        .min(1),
});

interface VerifyCodeSchema {
    code: string;
}

export default function MfaVerificationForm() {
    const { verifyMfaCode, loading, signOut } = useAuth();

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

    return (
        <Formik<VerifyCodeSchema>
            initialValues={{
                code: '',
            }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ errors, submitForm, values }) => (
                <Box textAlign='center'>
                    <Image size='tiny' href='/' src={Logo} alt='logo' />
                    <Typography
                        variant='h5'
                        color='common.black'
                        style={{
                            margin: '2rem',
                        }}
                    >
                        Enter SMS verification code
                    </Typography>
                    <Field
                        name='code'
                        margin='1rem'
                        required
                        fullWidth
                        label='SMS Code'
                        id='code'
                        type='input'
                        as={TextField}
                        variant='outlined'
                    />
                    <Button
                        // color='teal'
                        size='small'
                        content='Restart'
                        style={{ marginRight: '2rem' }}
                        onClick={signOut}
                    />
                    <Button
                        color='teal'
                        disabled={!values?.code?.length}
                        loading={loading}
                        size='small'
                        type='submit'
                        content='Submit'
                        style={{ marginTop: '2rem' }}
                        onClick={submitForm}
                    />
                    {Object.keys(errors).map((errorKey) => (
                        <ErrorText
                            key={errorKey}
                            message={`${
                                errors?.[errorKey as keyof VerifyCodeSchema]
                            }`}
                        />
                    ))}
                </Box>
            )}
        </Formik>
    );
}
