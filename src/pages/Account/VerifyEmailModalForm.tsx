import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from 'semantic-ui-react';
import NotesContext from '../../contexts/NotesContext';
import isEmailVerified from 'auth/isEmailVerified';
import { triggerEmailVerification, verifyEmail } from 'auth/verifyEmail';
import { Field, Formik, useField } from 'formik';
import { SignUpFormData } from './SignUpForm';
import { Redirect } from 'react-router';
import { Button, TextField } from '@mui/material';
import { CognitoUser } from 'amazon-cognito-identity-js';

interface Props {
    cognitoUser: CognitoUser | null;
    context: any; // auth context doesn't have types yet
}
export function VerifyEmailModalForm({ cognitoUser, context }: Props) {
    const [emailVerified, setIsEmailVerified] = useState(false);
    const [emailVerificationChecked, setEmailVerificationChecked] =
        useState(false);

    const [{ value: role }, ,] = useField<SignUpFormData['role']>('role');

    // TODO: add & verify types for auth context
    const authenticated = !!context?.token;

    // TODO: add back email verification
    const checkEmailVerification = useCallback(async () => {
        const emailVerified = await isEmailVerified(role);
        setIsEmailVerified(emailVerified);
        setEmailVerificationChecked(true);
        if (!emailVerified) {
            const cognitoUser = await triggerEmailVerification(role);
            if (cognitoUser) {
                // TODO: update parent component? Or use a hook?
                // setCognitoUser(cognitoUser);
            }
        }
    }, [role]);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(`****** checkEmailVerification? ${authenticated} `);
        if (authenticated) {
            checkEmailVerification();
        }
    }, [authenticated, checkEmailVerification]);

    const showEmailVerificationModal = useMemo(
        () => !emailVerified && authenticated && emailVerificationChecked,
        [authenticated, emailVerificationChecked, emailVerified]
    );

    if (emailVerified && authenticated) {
        return (
            <NotesContext.Consumer>
                {(ctx) => {
                    // TODO: add & verify types for auth context
                    // @ts-expect-error the AuthContext module doesn't have typescript types yet...
                    ctx.loadNotes(context.user._id);
                    return <Redirect push to='/dashboard' />;
                }}
            </NotesContext.Consumer>
        );
    }
    return (
        <Modal open={showEmailVerificationModal}>
            <Modal.Header>Verify Email</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        Please check your email for a verification link. Once
                        you have verified your email, please click the button
                        below to continue.
                    </p>
                    <Formik
                        initialValues={{
                            code: '',
                        }}
                        onSubmit={async ({ code }) => {
                            try {
                                await verifyEmail(code, cognitoUser);
                                setIsEmailVerified(true);
                            } catch (e) {
                                alert(
                                    'Error verifying email. Please try again.'
                                );
                            }
                        }}
                        validateOnChange={true}
                    >
                        {({ errors, submitForm }) => (
                            <div>
                                <Field
                                    name='code'
                                    margin='normal'
                                    required
                                    fullWidth
                                    label='Verification Code'
                                    id='code'
                                    type='input'
                                    as={TextField}
                                    variant='outlined'
                                />
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Continue
                                </Button>
                            </div>
                        )}
                    </Formik>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}
