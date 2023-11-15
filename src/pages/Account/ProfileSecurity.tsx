import React, { useState } from 'react';
import {
    Form,
    Segment,
    Button,
    Container,
    Header,
    Card,
    Icon,
    Divider,
} from 'semantic-ui-react';
import { passwordErrors } from 'constants/passwordErrors';
import './Account.css';
import { passwordRequirements } from 'auth/passwordReqs';
import useUser from 'hooks/useUser';
import { updatePassword } from 'auth/cognito';
import { useHistory } from 'react-router-dom';
import { UserRole } from '@cydoc-ai/types';

// NOTE: this page needs to be updated to use the new auth password editing logic
const ProfileSecurity = () => {
    const { user, isManager } = useUser();
    const role = user?.role;
    const history = useHistory();

    const [curPassword, setCurPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordReqs, setShowPasswordReqs] = useState(false);
    const [retypeNewPassword, setRetypeNewPassword] = useState('');
    const [passwordMeetsReqs, setPasswordMeetsReqs] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });

    const handleCurPasswordChange = (
        e: unknown,
        { value }: { value: string }
    ) => {
        setCurPassword(value);
    };

    const handleNewPasswordChange = (
        e: unknown,
        { value }: { value: string }
    ) => {
        setPasswordReqs(passwordRequirements(passwordReqs, value, role));
        setNewPassword(value);
    };

    const handleRetypeNewPasswordChange = (
        e: unknown,
        { value }: { value: string }
    ) => {
        setRetypeNewPassword(value);
    };

    const handleFocusNewPassword = (value: boolean) => {
        setShowPasswordReqs(value);
    };

    const handleChangePasswordSubmit = async () => {
        for (const req in passwordReqs) {
            if (!passwordReqs?.[req as keyof typeof passwordReqs]) {
                setShowPasswordReqs(true);
                setPasswordMeetsReqs(false);
                return;
            }
        }
        setPasswordMeetsReqs(true);
        setShowPasswordReqs(false);
        setPasswordsMatch(newPassword === retypeNewPassword);
        if (newPassword !== retypeNewPassword) {
            return;
        }

        const changePasswordResponse = await updatePassword(
            curPassword,
            newPassword
        );

        if (changePasswordResponse?.success) {
            history.push('/');
        }
        return;
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        const passwordErrs = passwordErrors(
            isManager ? UserRole.MANAGER : UserRole.CLINICIAN
        );
        for (const untyped in passwordErrs) {
            const err = untyped as keyof typeof passwordErrs; // set types for key
            if (passwordReqs[err]) {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={passwordMeetsReqs ? 'req-met' : ''}
                    >
                        <Icon name='check' size='small' />
                        {passwordErrs?.[err]}
                    </Card.Content>
                );
            } else {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={!passwordMeetsReqs ? 'req-not-met' : ''}
                    >
                        <Icon name='times' size='small' />
                        {passwordErrs?.[err]}
                    </Card.Content>
                );
            }
        }

        return errMsgs;
    };

    return (
        <>
            <Container className='login'>
                <Segment clearing>
                    <Header
                        as='h2'
                        textAlign='center'
                        content='Profile Security'
                    />
                    <Divider />
                    <Header
                        textAlign='center'
                        as='h3'
                        content='Change Password'
                    />
                    <Form onSubmit={handleChangePasswordSubmit}>
                        <Form.Input
                            fluid
                            aria-label='current-password'
                            type='password'
                            label='Current password'
                            name='curPassword'
                            value={curPassword}
                            onChange={handleCurPasswordChange}
                        />
                        <Form.Input
                            fluid
                            error={!passwordMeetsReqs}
                            aria-label='new-password'
                            type='password'
                            label='New password'
                            name='newPassword'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            onFocus={() => handleFocusNewPassword(true)}
                            onBlur={() => handleFocusNewPassword(false)}
                        />
                        {showPasswordReqs && (
                            <Card
                                fluid
                                className={
                                    passwordMeetsReqs
                                        ? 'password-reqs'
                                        : 'password-reqs-not-met'
                                }
                                header='New password requirements:'
                                description={passwordErrorMessages()}
                            />
                        )}
                        <Form.Input
                            fluid
                            error={!passwordsMatch}
                            aria-label='retype-new-password'
                            type='password'
                            label='Re-type new password'
                            name='retypeNewPassword'
                            value={retypeNewPassword}
                            onChange={handleRetypeNewPasswordChange}
                        />
                        {!passwordsMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Passwords do not match.
                            </Container>
                        )}
                        <Container
                            textAlign='right'
                            className='change-pass-button'
                        >
                            <Button
                                color='teal'
                                size='small'
                                aria-label='login-button'
                                content='Change Password'
                            />
                        </Container>
                    </Form>
                    <Divider />
                </Segment>
            </Container>
        </>
    );
};

export default ProfileSecurity;
