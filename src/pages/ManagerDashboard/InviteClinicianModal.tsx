import React from 'react';
import './ManagerDashboard.css';
import { Grid } from '@mui/material';
import SignUpTextInput from 'pages/Account/SignUpTextInput';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ModalHeader from 'components/Atoms/ModalHeader';
import { Modal } from 'semantic-ui-react';
interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
    firstName: Yup.string()
        .label('firstName')
        .trim()
        .required('firstName is required')
        .min(6),
});

interface LoginSchema {
    email: string;
    password: string;
    role: DbUser['role'];
    loginError?: string;
}
const InviteClinicianModal = ({ isOpen, onClose }: Props) => {
    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={onClose}
            open={isOpen}
            style={{ padding: '1rem' }}
        >
            <Formik<LoginSchema>
                initialValues={{
                    email: '',
                    password: '',
                    role: 'manager',
                }}
                onSubmit={(values) => console.log(`creating user with`, values)}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm }) => (
                    <>
                        <ModalHeader title='Invite a doctor to Cydoc' />
                        {/* <Form error={passwordErrorMessages().length > 0}> */}
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
                    </>
                )}
            </Formik>
        </Modal>
    );
};

export default InviteClinicianModal;
