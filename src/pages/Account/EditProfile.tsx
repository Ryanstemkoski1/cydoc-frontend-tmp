import React, { useCallback, useState } from 'react';
import { Segment, Container, Modal, Button } from 'semantic-ui-react';
import './Account.css';
import useUser from 'hooks/useUser';
import useAuth from 'hooks/useAuth';
import { Loader } from 'semantic-ui-react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import ModalHeader from 'components/Atoms/ModalHeader';
import SignUpTextInput from './SignUpTextInput';
import { PasswordErrorMessages } from './PasswordErrorMessage';
import { Grid } from '@mui/material';
import FormErrors from '../../components/Molecules/FormErrors';
import invariant from 'tiny-invariant';
import { DbUser } from '@cydoc-ai/types';
import { updateDbUser } from 'modules/user-api';
import { stringFromError } from 'modules/error-utils';
import { log } from 'modules/logging';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const INITIAL_VALUES: EditUserInfo = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    confirmPhoneNumber: '',
};

export interface EditUserInfo
    extends Pick<DbUser, 'firstName' | 'lastName' | 'phoneNumber'> {
    confirmPhoneNumber: string;
    submitError?: string;
}
// Same validation object used in sign up & first login
export const UserInfoFormSpec = {
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
                const existingValue = context.parent as EditUserInfo;
                invariant(
                    existingValue,
                    'invalid yup phone number object shape'
                );

                return existingValue?.phoneNumber === value;
            },
            message: 'Phone numbers must match',
            exclusive: false,
        }),
};

const validationSchema = Yup.object<EditUserInfo>(UserInfoFormSpec);

const EditProfile = () => {
    const { user, loading } = useUser();
    const initialValues = {
        ...INITIAL_VALUES,
        ...user,
        confirmPhoneNumber: user?.phoneNumber || '',
    };
    const history = useHistory();
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

    const onSubmit = async (
        { firstName, lastName, phoneNumber }: EditUserInfo,
        { setErrors, setSubmitting }: FormikHelpers<EditUserInfo>
    ) => {
        toast
            .promise(
                async () => {
                    try {
                        const email = user?.email;
                        invariant(
                            email,
                            'Sign-In error, try refreshing and logging in again.'
                        );

                        setErrors({});
                        setSubmitting(true);

                        // TODO: update phone number in cognito pool
                        const { errorMessage } = await updateDbUser({
                            email,
                            firstName,
                            lastName,
                            phoneNumber,
                        });

                        if (errorMessage?.length) {
                            throw new Error(errorMessage);
                        }
                    } finally {
                        setSubmitting(false);
                    }
                },
                {
                    error: 'Error updating user',
                    pending: `Updating user...`,
                    success: 'User updated!',
                }
            )
            .catch((e) => {
                setErrors({
                    submitError: stringFromError(e),
                });
                log(`[EditProfileSubmit] ${stringFromError(e)}`, {
                    firstName,
                    lastName,
                    phoneNumber,
                    e,
                });
            });
    };

    // show loader while retrieving info from Cognito/database
    if (loading) {
        return <Loader active inline='centered' />;
    }

    return (
        <Container className='sign-up'>
            <DeleteModal
                open={confirmDeleteModalOpen}
                setOpen={setConfirmDeleteModalOpen}
            />
            <Segment clearing raised>
                <Formik<EditUserInfo>
                    enableReinitialize
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >
                    {({ errors, submitForm, isSubmitting, touched }) => (
                        <div>
                            <ModalHeader title='Enter User Info' />
                            <Grid container spacing={4} paddingTop='2rem'>
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
                                <FormErrors />
                                {/* <Box
                                    marginTop='2rem'
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                    }}
                                > */}
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        basic
                                        color='red'
                                        content='Delete Account'
                                        type='button'
                                        onClick={() => {
                                            setConfirmDeleteModalOpen(true);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        flexDirection: 'column-reverse',
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
                                    {/* </Box> */}
                                </Grid>

                                <PasswordErrorMessages />
                            </Grid>
                        </div>
                    )}
                </Formik>
            </Segment>
        </Container>
    );
};

export default EditProfile;

const DeleteModal = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const { isManager, user, loading } = useUser();
    const { signOut } = useAuth();

    const deleteSelf = useCallback(async () => {
        // TODO: implement user & institution deletion logic
        log(`User requested deletion`, { user });
        signOut();
    }, [signOut, user]);

    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={() => {
                setOpen(false);
            }}
            open={open}
            closeIcon={
                <div
                    style={{
                        float: 'right',
                        fontSize: '18px',
                        margin: '18px',
                        cursor: 'pointer',
                    }}
                >
                    X
                </div>
            }
        >
            <Modal.Header>Confirm Deletion</Modal.Header>
            <Modal.Content>
                <p>
                    Click below to permanently delete your account and cancel
                    any active subscriptions.
                </p>
                <div style={{ width: '50%' }}>
                    <Button
                        basic
                        color='red'
                        content='Confirm Deletion'
                        type='button'
                        onClick={deleteSelf}
                        size={'small'}
                        loading={loading}
                        disabled={loading}
                    />
                    {isManager && (
                        <Button
                            basic
                            color='red'
                            content='Delete self and managed doctors'
                            type='button'
                            onClick={deleteSelf}
                            size={'small'}
                            loading={loading}
                            disabled={loading}
                            style={{ marginTop: '10px' }}
                        />
                    )}
                </div>
            </Modal.Content>
        </Modal>
    );
};
