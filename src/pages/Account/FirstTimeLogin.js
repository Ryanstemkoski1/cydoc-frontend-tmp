import React, { useState } from 'react';
import {
    Form,
    Icon,
    Segment,
    Divider,
    Container,
    Message,
    Header,
} from 'semantic-ui-react';
import { passwordErrors } from 'constants/passwordErrors';
import UserForm from './UserForm';
import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';

const FirstTimeLogin = ({ onSubmit, role, username, email }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });
    const [userInfo, setUserInfo] = useState({
        username,
        role,
        firstName: '',
        middleName: '',
        lastName: '',
        email,
        countryCode: '+1',
        phoneNumber: '',
        isPhoneNumberMobile: true,
        dob: '',
        address: '',
        studentStatus: '',
        degreesCompleted: ['', '', ''],
        degreesInProgress: ['', '', ''],
        specialties: ['', '', ''],
        workplace: '',
        workplaceFeatures: [],
    });

    const handleNewPasswordChange = (e, { value }) => {
        const minLength =
            role === 'manager' || role === 'healthcare manager' ? 25 : 16;
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
            passesMinLength: value.length >= minLength,
        });
        setNewPassword(value);
    };

    const handleConfirmNewPasswordChange = (e, { value }) => {
        setConfirmNewPassword(value);
        // set this to remove error styling on confirmNewPassword input
        setPasswordsMatch(true);
    };

    const handleSubmit = (userInfo) => {
        setUserInfo(userInfo);
        const fullPhoneNumber = userInfo.countryCode + userInfo.phoneNumber;
        setPasswordsMatch(newPassword === confirmNewPassword);
        if (
            newPassword !== confirmNewPassword ||
            passwordErrorMessages().length > 0
        ) {
            return;
        }
        onSubmit(newPassword, {
            ...userInfo,
            fullPhoneNumber,
        });
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        const passwordErrs = passwordErrors(role);
        for (const err in passwordErrs) {
            if (!passwordReqs[err]) {
                errMsgs.push(
                    <Message.Item key={err} content={passwordErrs[err]} />
                );
            }
        }

        return errMsgs;
    };

    return (
        <>
            <NavMenu />
            <Container className='sign-up'>
                <Segment clearing raised>
                    <Header
                        as='h2'
                        textAlign='center'
                        content='Finish setting up your account'
                    />
                    <Form
                        size='small'
                        error={passwordErrorMessages().length > 0}
                    >
                        <Form.Input
                            fluid
                            required
                            aria-label='New-Password'
                            type='password'
                            label='New password'
                            name='newPassword'
                            placeholder='new password'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                        <Form.Input
                            fluid
                            required
                            error={!passwordsMatch}
                            aria-label='Confirm-New-Password'
                            type='password'
                            label='Confirm new password'
                            name='confirmNewPassword'
                            placeholder='confirm new password'
                            value={confirmNewPassword}
                            onChange={handleConfirmNewPasswordChange}
                        />
                        {!passwordsMatch && (
                            <Container className='pass-match-error'>
                                <Icon name='exclamation circle' />
                                Passwords do not match.
                            </Container>
                        )}
                        {passwordErrorMessages().length > 0 && (
                            <Message
                                error
                                header='Password must satisfy the following requirements:'
                                list={passwordErrorMessages()}
                            />
                        )}
                        <Divider section />
                    </Form>
                    <UserForm
                        userInfo={userInfo}
                        doneLoading={true}
                        handleSubmit={handleSubmit}
                        buttonAriaLabel='Finish-Setting-Up-Account'
                        buttonText='Finish'
                    />
                </Segment>
            </Container>
        </>
    );
};

export default FirstTimeLogin;
