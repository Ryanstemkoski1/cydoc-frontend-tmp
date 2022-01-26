import React, { useState, useContext } from 'react';
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
import AuthContext from 'contexts/AuthContext';
import NavMenu from 'components/navigation/NavMenu';
import { passwordErrors } from 'constants/passwordErrors';
import changePassword from 'auth/changePassword';
import './Account.css';
import { passwordRequirments } from 'auth/passwordReqs';

const ProfileSecurity = () => {
    const context = useContext(AuthContext);
    const role = context.role;

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

    const handleCurPasswordChange = (e, { value }) => {
        setCurPassword(value);
    };

    const handleNewPasswordChange = (e, { value }) => {
        setPasswordReqs(passwordRequirments(passwordReqs, value, role));
        setNewPassword(value);
    };

    const handleRetypeNewPasswordChange = (e, { value }) => {
        setRetypeNewPassword(value);
    };

    const handleFocusNewPassword = (value) => {
        setShowPasswordReqs(value);
    };

    const handleChangePasswordSubmit = async () => {
        for (const req in passwordReqs) {
            if (!passwordReqs[req]) {
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

        const changePasswordResponse = await changePassword(
            curPassword,
            newPassword,
            role
        );

        if (changePasswordResponse?.includes('SUCCESS')) {
            alert('Password successfully updated.');
        }
        return;
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        const passwordErrs = passwordErrors(role);
        for (const err in passwordErrs) {
            if (passwordReqs[err]) {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={passwordMeetsReqs ? 'req-met' : ''}
                    >
                        <Icon name='check' size='small' />
                        {passwordErrs[err]}
                    </Card.Content>
                );
            } else {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={!passwordMeetsReqs ? 'req-not-met' : ''}
                    >
                        <Icon name='times' size='small' />
                        {passwordErrs[err]}
                    </Card.Content>
                );
            }
        }

        return errMsgs;
    };

    return (
        <>
            <div className='nav-menu-container'>
                <NavMenu />
            </div>
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
