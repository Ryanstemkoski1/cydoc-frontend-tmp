import React from 'react';
import { Formik, FormikHelpers } from 'formik';

import './Account.css';

import './Account.css';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { DbUser } from '@cydoc-ai/types';
import ModalHeader from 'components/Atoms/ModalHeader';
import { Button } from 'semantic-ui-react';
import SignUpTextInput from './SignUpTextInput';
import { PasswordErrorMessages } from './PasswordErrorMessage';
import { Box, Grid, Paper, Stack } from '@mui/material';
import invariant from 'tiny-invariant';
import { passwordIsValid } from 'constants/passwordErrors';
import { updateDbUser } from 'modules/user-api';
import { stringFromError } from 'modules/error-utils';
import { log } from 'modules/logging';
import { useHistory } from 'react-router-dom';
import { ErrorText } from 'components/Atoms/ErrorText';

export interface FistLoginFormData
    extends Pick<DbUser, 'firstName' | 'lastName' | 'phoneNumber'> {
    newPassword: string;
    confirmNewPassword: string;
    confirmPhoneNumber: string;
    signUpError?: string;
}

const INITIAL_VALUES: FistLoginFormData = {
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmNewPassword: '',
    phoneNumber: '',
    confirmPhoneNumber: '',
};

// Same validation object used in sign up
export const FirstLoginFormSpec = {
    firstName: Yup.string()
        .label('firstName')
        .required('First Name is required')
        .min(1, 'First Name is required'),
    lastName: Yup.string()
        .label('lastName')
        .required('Last Name is required')
        .min(1, 'Last Name is required'),
    phoneNumber: Yup.string()
        .label('phoneNumber')
        .required('Phone number is required')
        .min(9, 'Phone number is required'),
    confirmPhoneNumber: Yup.string()
        .label('confirmPhoneNumber')
        .required('Please confirm phone number')
        .min(9, 'Please confirm phone number')
        .test({
            name: 'phone-number-match',
            test: (value, context) => {
                const existingValue = context.parent as FistLoginFormData;
                invariant(
                    existingValue,
                    'invalid yup phone number object shape'
                );

                return existingValue?.phoneNumber === value;
            },
            message: 'Phone numbers must match',
            exclusive: false,
        }),
    newPassword: Yup.string()
        .label('newPassword')
        .required('Password is required')
        .min(1, 'Password is required'),
    confirmNewPassword: Yup.string()
        .label('confirmNewPassword')
        .required('Please confirm new password')
        .min(1, 'Please confirm new password')
        .test({
            name: 'passwords-match',
            test: (value, context) => {
                const existingValue = context.parent as FistLoginFormData;
                invariant(existingValue, 'invalid yup password object shape');

                return existingValue?.newPassword === value;
            },
            message: 'Passwords must match',
            exclusive: false,
        })
        .test({
            name: 'confirm-new-password-requirements',
            test: (value) => passwordIsValid(value),
            message: 'Password must meet requirements',
            exclusive: false,
        }),
};

const validationSchema = Yup.object<FistLoginFormData>(FirstLoginFormSpec);

const FirstLoginForm = () => {
    const { completeFirstLoginUpdate, cognitoUser } = useAuth();
    const history = useHistory();

    const onSubmit = async (
        { firstName, lastName, phoneNumber, newPassword }: FistLoginFormData,
        { setErrors, setSubmitting }: FormikHelpers<FistLoginFormData>
    ) => {
        try {
            const email = cognitoUser?.challengeParam?.userAttributes?.email;
            invariant(
                email,
                'Sign-In error, try refreshing and logging in again.'
            );

            setErrors({});
            setSubmitting(true);

            const { errorMessage } = await completeFirstLoginUpdate(
                newPassword,
                phoneNumber
            );
            const { errorMessage: dbErrorMessage } = await updateDbUser({
                email,
                firstName,
                lastName,
                phoneNumber,
            });

            if (errorMessage?.length || dbErrorMessage) {
                setErrors({
                    signUpError: errorMessage || dbErrorMessage,
                });
            } else {
                console.log(`user info updated successfully`, {
                    errorMessage,
                    dbErrorMessage,
                });

                history.push('/');
            }
        } catch (e) {
            setErrors({
                signUpError: stringFromError(e),
            });
            log(`[FirstLoginSubmit] ${stringFromError(e)}`, {
                firstName,
                lastName,
                phoneNumber,
                newPassword,
                e,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                padding: '10rem',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Paper elevation={6} sx={{ width: '80%' }}>
                <Formik<FistLoginFormData>
                    initialValues={INITIAL_VALUES}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >
                    {({ errors, submitForm, isSubmitting, touched }) => (
                        <div>
                            <ModalHeader title='Enter User Info' />
                            <Grid container spacing={4} padding='2rem'>
                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        label='First Name'
                                        fieldName='firstName'
                                        placeholder='Jane'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        label='Last Name'
                                        fieldName='lastName'
                                        placeholder='Doe'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        fieldName='phoneNumber'
                                        label='U.S. Phone Number'
                                        placeholder='XXXXXXXXXX'
                                        type='tel'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        fieldName='confirmPhoneNumber'
                                        label='Confirm U.S. Phone Number'
                                        placeholder='XXXXXXXXXX'
                                        type='tel'
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        label='New password'
                                        fieldName='newPassword'
                                        type='password'
                                        placeholder='new password'
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <SignUpTextInput
                                        label='Confirm new password'
                                        fieldName='confirmNewPassword'
                                        type='password'
                                        placeholder='confirm new password'
                                    />
                                </Grid>
                                {Object.keys(errors)?.length ? (
                                    <Grid item xs={12}>
                                        <Stack>
                                            {Object.keys(errors)
                                                ?.slice(0, 1)
                                                .map((errorKey) => (
                                                    <ErrorText
                                                        key={errorKey}
                                                        message={`${
                                                            errors?.[
                                                                errorKey as keyof FistLoginFormData
                                                            ]
                                                        }`}
                                                    />
                                                ))}
                                        </Stack>
                                    </Grid>
                                ) : null}
                                <Box
                                    marginTop='2rem'
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Button
                                        color='teal'
                                        disabled={
                                            isSubmitting ||
                                            !!Object.keys(errors).length ||
                                            !Object.keys(touched).length
                                        }
                                        loading={isSubmitting}
                                        content={'Save'}
                                        onClick={submitForm}
                                        type='submit'
                                    />
                                </Box>

                                <PasswordErrorMessages />
                            </Grid>
                        </div>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default FirstLoginForm;
