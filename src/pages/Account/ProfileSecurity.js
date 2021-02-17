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
import NavMenu from '../../components/navigation/NavMenu';
import { passwordErrors } from 'constants/passwordErrors';
import changePassword from 'auth/changePassword';
import './Account.css';

const ProfileSecurity = () => {
    const [curPassword, setCurPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordReqs, setShowPasswordReqs] = useState(false);
    const [retypeNewPassword, setRetypeNewPassword] = useState('');
    const [passwordMeetsReqs, setPasswordMeetsReqs] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [role, setRole] = useState('healthcare professional');
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
        setPasswordReqs({
            ...passwordReqs,
            containsNumber: value.match(/\d+/g) ? true : false,
            containsUpper: value.toLowerCase() !== value,
            containsLower: value.toUpperCase() !== value,
            containsSpecial: value.match(
                /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|"+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
            )
                ? true
                : false,
            passesMinLength: value.length >= 25,
        });

        setNewPassword(value);
    };

    const handleRetypeNewPasswordChange = (e, { value }) => {
        setRetypeNewPassword(value);
    };

    const handleRoleChange = (e, { value }) => {
        setRole(value);
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
        for (const err in passwordErrors) {
            if (passwordReqs[err]) {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={passwordMeetsReqs ? 'req-met' : ''}
                    >
                        <Icon name='check' size='small' />
                        {passwordErrors[err]}
                    </Card.Content>
                );
            } else {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={!passwordMeetsReqs ? 'req-not-met' : ''}
                    >
                        <Icon name='times' size='small' />
                        {passwordErrors[err]}
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
                    <Container
                        className='pass-coming-soon'
                        textAlign='center'
                        content='coming soon'
                    />
                    <Form onSubmit={handleChangePasswordSubmit}>
                        <Form.Input
                            disabled
                            fluid
                            aria-label='current-password'
                            type='password'
                            label='Current password'
                            name='curPassword'
                            value={curPassword}
                            onChange={handleCurPasswordChange}
                        />
                        <Form.Input
                            disabled
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
                            disabled
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
                        {/* TODO: get role from username in database */}
                        <label className='role-label role-label-change-pass'>
                            I am a:
                        </label>
                        <Form.Group className='roles'>
                            <Form.Radio
                                disabled
                                label='healthcare professional'
                                value='healthcare professional'
                                className='role'
                                checked={role === 'healthcare professional'}
                                onChange={handleRoleChange}
                            />
                            <Form.Radio
                                disabled
                                label='healthcare manager'
                                value='healthcare manager'
                                className='role'
                                checked={role === 'healthcare manager'}
                                onChange={handleRoleChange}
                            />
                        </Form.Group>
                        <Container
                            textAlign='right'
                            className='change-pass-button'
                        >
                            <Button
                                disabled
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
