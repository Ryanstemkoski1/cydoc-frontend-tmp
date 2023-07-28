import React from 'react';
import './ManagerDashboard.css';
import { Box, Divider, Grid } from '@mui/material';
import SignUpTextInput from 'pages/Account/SignUpTextInput';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ModalHeader from 'components/Atoms/ModalHeader';
import { Button, Modal } from 'semantic-ui-react';
import { ErrorText } from 'components/Atoms/ErrorText';
import { DbUser } from 'types/users';
import { inviteUser } from 'modules/public-api';
import useUser from 'hooks/useUser';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object<NewClinicianSchema>({
    email: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
    confirmEmail: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
    firstName: Yup.string()
        .label('firstName')
        .trim()
        .required('First name is required'),
    lastName: Yup.string()
        .label('lastName')
        .trim()
        .required('Last name is required'),
});
export interface NewClinicianSchema {
    email: string;
    confirmEmail: string;
    firstName: string;
    lastName: string;
    role: DbUser['role'];
    submitError?: string;
}

const InviteClinicianModal = ({ isOpen, onClose }: Props) => {
    const { user } = useUser();

    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={onClose}
            open={isOpen}
            style={{ padding: '1rem' }}
        >
            <Formik<NewClinicianSchema>
                initialValues={{
                    email: '',
                    confirmEmail: '',
                    firstName: '',
                    lastName: '',
                    role: 'clinician',
                }}
                onSubmit={async (
                    { email, firstName, lastName, role },
                    { setSubmitting }
                ) => {
                    const result = await inviteUser({
                        email,
                        firstName,
                        lastName,
                        role,
                        institutionId: user?.institutionId,
                    });
                    setSubmitting(false);

                    if (result?.errorMessage) {
                        alert(result.errorMessage);
                    } else {
                        onClose();
                    }
                }}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm, isSubmitting, touched }) => (
                    <>
                        <ModalHeader title='Invite a clinician to your Institution' />
                        <Grid
                            container
                            spacing={4}
                            style={{ padding: '1rem', marginTop: '1rem' }}
                        >
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
                                    label='Email'
                                    fieldName='email'
                                    placeholder='name@example.com'
                                    type='email'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <SignUpTextInput
                                    label='Confirm Email'
                                    fieldName='confirmEmail'
                                    placeholder='name@example.com'
                                    type='email'
                                />
                            </Grid>
                        </Grid>
                        <Divider
                            sx={{
                                margin: '1.5rem',
                            }}
                        />
                        <Box
                            sx={{
                                margin: '1.5rem',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Button
                                    basic
                                    color='teal'
                                    content='Cancel'
                                    type='button'
                                    onClick={onClose}
                                />

                                <Button
                                    color='teal'
                                    disabled={
                                        isSubmitting ||
                                        !!Object.keys(errors).length ||
                                        !Object.keys(touched).length
                                    }
                                    loading={isSubmitting}
                                    content={'Create Account'}
                                    onClick={submitForm}
                                    type='submit'
                                />
                            </Box>
                            {Object.keys(errors).length ? (
                                <>
                                    {Object.keys(errors).map((errorKey) => (
                                        <ErrorText
                                            key={errorKey}
                                            message={`${errorKey}: ${
                                                errors?.[
                                                    errorKey as keyof NewClinicianSchema
                                                ]
                                            }`}
                                        />
                                    ))}
                                </>
                            ) : null}
                        </Box>
                    </>
                )}
            </Formik>
        </Modal>
    );
};

export default InviteClinicianModal;
