import { TextField } from '@mui/material';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import { FirstLoginFormSpec } from './FirstLoginForm';
import { Stack } from '@mui/system';
import { confirmCode } from 'auth/cognito';
import { stringFromError } from 'modules/error-utils';
import { log } from 'modules/logging';
import { ErrorText } from 'components/Atoms/ErrorText';

const { newPassword, confirmNewPassword } = FirstLoginFormSpec;

const validationSchema = Yup.object({
    code: Yup.string()
        .label('code')
        .required('Code is required')
        .min(1, 'Code is required'),
    newPassword,
    confirmNewPassword,
});

interface CodeSchema {
    code: string;
    newPassword: string;
    confirmNewPassword: string;
    submitError?: string;
}

interface Props {
    obfuscatedEmail: string;
    email: string;
    onSuccess: () => void;
    onReset: () => void;
}

export default function ForgotPasswordCodeForm({
    email,
    obfuscatedEmail,
    onSuccess,
}: Props) {
    // const [passwordReqs, setPasswordReqs] = useState({
    //     containsNumber: false,
    //     containsUpper: false,
    //     containsLower: false,
    //     containsSpecial: false,
    //     passesMinLength: false,
    // });
    //  const checkPasswordsMatch = () => {
    //      const errMsgs = [];
    //      if (newPassword !== confirmPassword) {
    //          errMsgs.push(
    //              <Card.Content
    //                  key={'passwords-do-not-match'}
    //                  className={'passwords-do-match'}
    //              >
    //                  <Icon name='exclamation' size='small' />
    //                  {'Passwords do not match'}
    //              </Card.Content>
    //          );
    //      }
    //      return errMsgs;
    //  };

    // const passwordErrorMessages = () => {
    //     const errMsgs = [];
    //     const passwordErrs = passwordErrors(role);
    //     for (const err in passwordErrs) {
    //         if (passwordReqs[err]) {
    //             errMsgs.push(
    //                 <Card.Content
    //                     key={err}
    //                     className={passwordMeetsReqs ? 'req-met' : ''}
    //                 >
    //                     <Icon name='check' size='small' />
    //                     {passwordErrs[err]}
    //                 </Card.Content>
    //             );
    //         } else {
    //             errMsgs.push(
    //                 <Card.Content
    //                     key={err}
    //                     className={!passwordMeetsReqs ? 'req-not-met' : ''}
    //                 >
    //                     <Icon name='times' size='small' />
    //                     {passwordErrs[err]}
    //                 </Card.Content>
    //             );
    //         }
    //     }
    //     return errMsgs;
    // };

    const onSubmit = useCallback(
        async (
            { code, newPassword }: CodeSchema,
            { setErrors, setSubmitting }: FormikHelpers<CodeSchema>
        ) => {
            setSubmitting(true);
            // for (const req in passwordReqs) {
            //     if (!passwordReqs[req]) {
            //         setShowPasswordReqs(true);
            //         setPasswordMeetsReqs(false);
            //         setIsConfirming(false);
            //         return;
            //     }
            // }
            // TODO: verify that password requirements are being appropriately verified with yup
            // setPasswordMeetsReqs(true);
            // setShowPasswordReqs(false);
            // setPasswordsMatch(newPassword === confirmPassword);
            // if (newPassword !== confirmPassword) {
            //     setShowPasswordsMatch(true);
            //     setIsConfirming(false);
            //     return;
            // }

            try {
                const { success, errorMessage } = await confirmCode(
                    email,
                    code,
                    newPassword
                );
                if (errorMessage) {
                    setErrors({
                        submitError: errorMessage,
                    });
                } else if (success) {
                    onSuccess();
                } else {
                    // Should never happen:
                    log(
                        `[ForgotPasswordCodeForm] confirmCode unrecognized response`
                    );
                    setErrors({
                        submitError:
                            'Error occurred, we are monitoring the situation. Refresh and try again.',
                    });
                }
            } catch (e) {
                // This should never happen:
                log(
                    `[ForgotPasswordCodeForm] unhandled error: ${stringFromError(
                        e
                    )}`,
                    {
                        e,
                        email,
                        obfuscatedEmail,
                        code,
                        newPassword,
                    }
                );
                setErrors({
                    submitError:
                        'Error occurred, we are monitoring the situation. Refresh and try again.',
                });
            } finally {
                setSubmitting(false);
            }
            return;
        },
        [email, obfuscatedEmail, onSuccess]
    );

    return (
        <Formik<CodeSchema>
            initialValues={{
                code: '',
                newPassword: '',
                confirmNewPassword: '',
            }}
            onSubmit={onSubmit}
            validateOnChange={true}
            validationSchema={validationSchema}
        >
            {({ errors, submitForm, isSubmitting }) => (
                <Stack>
                    <Field
                        aria-label='enter-confirmation-code'
                        name='code'
                        margin='normal'
                        required
                        fullWidth
                        label={`Enter Code sent to: ${obfuscatedEmail}`}
                        id='email'
                        type='input'
                        as={TextField}
                        variant='outlined'
                    />
                    <Field
                        aria-label='new-password'
                        name='newPassword'
                        margin='normal'
                        required
                        fullWidth
                        label='new password'
                        id='newPassword'
                        type='password'
                        as={TextField}
                        variant='outlined'
                    />
                    <Field
                        aria-label='confirm-new-password'
                        name='confirmNewPassword'
                        margin='normal'
                        required
                        fullWidth
                        label='confirm password'
                        id='confirmNewPassword'
                        type='password'
                        as={TextField}
                        variant='outlined'
                    />
                    <Button
                        onClick={submitForm}
                        color='teal'
                        size='small'
                        disabled={!!Object.keys(errors).length || isSubmitting}
                        aria-label='submit'
                        content='Update Password'
                        type='submit'
                        style={{ marginTop: '1.5rem' }}
                    />
                    <ErrorText
                        key={'loginError'}
                        message={errors?.submitError || errors || null}
                    />
                </Stack>
            )}
        </Formik>
    );
}
