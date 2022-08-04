import doctorSignUp from 'auth/doctorSignUp';
import React, { useState } from 'react';
import { passwordErrors } from 'constants/passwordErrors';
import constants from 'constants/registration-constants.json';
import {
    Button,
    Container,
    Form,
    Icon,
    Message,
    Modal,
    Header,
    Divider,
} from 'semantic-ui-react';
import isEmailValid from '../../auth/isEmailValid';
import Policy from '../../constants/Documents/policy';
import Terms_and_conditions from '../../constants/Documents/terms_and_conditions';

const DoctorSignUp = ({ continueIsActive, reloadModal }) => {
    const phoneNumberRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );
    const [isInviteDoctorOpen, setIsInviteDoctorOpen] = useState(
        continueIsActive
    );
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [duplicateUsername, setDuplicateUsername] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [phoneNumberMatch, setPhoneNumberMatch] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [expirationMonth, setExpirationMonth] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCVV] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [showTermsOfUseAndPrivacy, setShowTermsOfUseAndPrivacy] = useState(
        false
    );
    const [showPasswordErrors, setShowPasswordErrors] = useState(false);

    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });
    const expirationMonthOptions = constants.expirationMonths.map(
        (expMonth) => ({
            key: expMonth,
            value: expMonth,
            text: expMonth,
        })
    );
    const expirationYearOptions = constants.expirationYears.map((expYear) => ({
        key: expYear,
        value: expYear,
        text: expYear,
    }));
    const handleNewPasswordChange = (e, { value }) => {
        const minLength = 16;
        setShowPasswordErrors(true);
        setPasswordReqs({
            ...passwordReqs,
            containsNumber: value.match(/\d+/g) ? true : false,
            containsUpper: value.toLowerCase() !== value,
            containsLower: value.toUpperCase() !== value,
            containsSpecial: value.match(
                /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|'+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
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

    const createDoctor = async () => {
        if (!showTermsOfUseAndPrivacy) {
            if (
                username === '' ||
                newPassword === '' ||
                firstName === '' ||
                lastName === '' ||
                phoneNumber === '' ||
                cardNumber === '' ||
                expirationYear === '' ||
                expirationMonth === '' ||
                cvv === '' ||
                zipCode === '' ||
                confirmEmail === ''
            ) {
                alert('Enter Required Fields');
                setShowTermsOfUseAndPrivacy(false);
                return {
                    status: 'ERROR',
                };
            }
            if (email != confirmEmail) {
                alert('Error: emails do not match');
                setShowTermsOfUseAndPrivacy(false);
                return {
                    status: 'ERROR',
                };
            }
            if (phoneNumberRegex.test(phoneNumber.toString()) === false) {
                alert('Error: check phone number');
                setShowTermsOfUseAndPrivacy(false);
                return {
                    status: 'ERROR',
                };
            }
            if (phoneNumber != confirmPhoneNumber) {
                alert('Error: phone numbers do not match');
                setPhoneNumberMatch(false);
                setShowTermsOfUseAndPrivacy(false);
                return {
                    status: 'ERROR',
                };
            }
            setPasswordsMatch(newPassword === confirmNewPassword);
            if (!isEmailValid(email)) {
                let errorText = 'Error: Unauthorized Email Address';
                alert(errorText);
                setShowTermsOfUseAndPrivacy(false);
                return {
                    status: 'ERROR',
                };
            }
            if (
                newPassword !== confirmNewPassword ||
                passwordErrorMessages().length > 0
            ) {
                setShowTermsOfUseAndPrivacy(false);
                return;
            }

            setShowTermsOfUseAndPrivacy(true);
        }

        // If the terms of use & privacy policy have been accepted, sign up the new doctor
        else {
            const createUserResponse = await doctorSignUp(
                username,
                newPassword,
                email,
                firstName,
                lastName,
                phoneNumber,
                cardNumber,
                expirationYear,
                expirationMonth,
                cvv,
                zipCode
            );
            if (
                createUserResponse?.status === 'ERROR' &&
                createUserResponse?.message.includes(
                    'User account already exists'
                )
            ) {
                setDuplicateUsername(true);
            } else {
                setIsInviteDoctorOpen(false);
            }
        }
    };

    const handleUsernameChange = (e, { value }) => {
        setUsername(value);
        setDuplicateUsername(false);
    };

    const handleEmailChange = (e, { value }) => {
        setEmail(value);
    };

    const handleConfirmEmailChange = (e, { value }) => {
        setConfirmEmail(value);
    };

    const handleFirstNameChange = (e, { value }) => {
        setFirstName(value);
    };

    const handleLastNameChange = (e, { value }) => {
        setLastName(value);
    };

    const handleCardNumberChange = (e, { value }) => {
        setCardNumber(value);
    };

    const handleCVVChange = (e, { value }) => {
        setCVV(value);
    };

    const handleZipCodeChange = (e, { value }) => {
        setZipCode(value);
    };

    const handleExpirationMonthChange = (e, { value }) => {
        setExpirationMonth(value);
    };

    const handleExpirationYearChange = (e, { value }) => {
        setExpirationYear(value);
    };
    const handlePhoneNumber = (e, { value }) => {
        const formattedPhoneNumber = formatPhoneNumber(value);
        setPhoneNumber(formattedPhoneNumber);
    };
    const handleConfirmPhoneNumber = (e, { value }) => {
        const formattedPhoneNumber = formatPhoneNumber(value);
        setConfirmPhoneNumber(formattedPhoneNumber);
        setPhoneNumberMatch(true);
    };

    function formatPhoneNumber(value) {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;
        // clean the input for any non-digit values.
        const phoneNumber = value.replace(/[^\d]/g, '');
        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = phoneNumber.length;
        // we need to return the value with no formatting if its less then four digits
        // this is to avoid weird behavior that occurs if you  format the area code to early
        if (phoneNumberLength < 4) return phoneNumber;
        // if phoneNumberLength is greater than 4 and less the 7 we start to return
        // the formatted number
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    }

    const passwordErrorMessages = () => {
        const errMsgs = [];
        const passwordErrs = passwordErrors('doctor');
        for (const err in passwordErrs) {
            if (!passwordReqs[err]) {
                errMsgs.push(
                    <Message.Item key={err} content={passwordErrs[err]} />
                );
            }
        }

        return errMsgs;
    };

    const cssScroll = '.scroll { max-height: 120px; overflow-y: scroll; }';
    const cssCheckBoxes =
        '.checkBox { vertical-align: middle; line-height: 5px; min-width: 5px; display:inline-block; align-content:middle }';
    const cssLeftCheckBox =
        '.lCheckBox { float:left; padding-right:100px; padding-left:100px }';
    const cssRightCheckBox = ' .rCheckBox { float:right }';

    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={() => {
                setIsInviteDoctorOpen(false);
                reloadModal();
            }}
            onOpen={() => setIsInviteDoctorOpen(true)}
            open={isInviteDoctorOpen}
        >
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Content>
                <Form
                    onSubmit={createDoctor}
                    error={passwordErrorMessages().length > 0}
                >
                    {showTermsOfUseAndPrivacy && (
                        <Container>
                            <Header
                                as='h5'
                                textAlign='center'
                                content='Terms of Use'
                            />
                            <div className='scrol'>
                                <style> {cssScroll} </style>
                                <Terms_and_conditions title={true} />
                            </div>
                            <Divider section />
                            <Header
                                as='h5'
                                textAlign='center'
                                content='Privacy Policy'
                            />
                            <div className='scroll'>
                                <style>{cssScroll}</style>
                                <Policy title={true} />
                            </div>
                            <br />
                            <div className='checkBox'>
                                <style> {cssCheckBoxes} </style>
                                <div className='lCheckBox'>
                                    <style> {cssLeftCheckBox} </style>
                                    <Form.Input
                                        required
                                        label='Agree To Terms of Use'
                                        name='term'
                                        type='checkbox'
                                    />
                                </div>
                                <div className='rCheckBox'>
                                    <style>{cssRightCheckBox}</style>
                                    <Form.Input
                                        required
                                        label='Agree To Privacy Policy'
                                        name='privacy'
                                        type='checkbox'
                                    />
                                </div>
                            </div>
                        </Container>
                    )}
                    {!showTermsOfUseAndPrivacy && (
                        <Container>
                            <Form.Input
                                required
                                label='Username'
                                name='username'
                                placeholder='username'
                                value={username}
                                className='username-input-container'
                                error={
                                    duplicateUsername &&
                                    'Username already exists'
                                }
                                onChange={handleUsernameChange}
                            />
                            <Form.Input
                                required
                                label='First Name'
                                name='firstName'
                                placeholder='Jane'
                                type='firstName'
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                            <Form.Input
                                required
                                label='Last Name'
                                name='lastName'
                                placeholder='Doe'
                                type='lastName'
                                value={lastName}
                                onChange={handleLastNameChange}
                            />
                            <Form.Input
                                required
                                label='Email'
                                name='email'
                                placeholder='name@example.com'
                                type='email'
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <Form.Input
                                required
                                label='Confirm Email'
                                name='confirmEmail'
                                placeholder='name@example.com'
                                type='email'
                                value={confirmEmail}
                                onChange={handleConfirmEmailChange}
                            />
                            <Form.Input
                                required
                                label='U.S. Phone Number'
                                name='phoneNumber'
                                placeholder='XXXXXXXXXX'
                                type='tel'
                                value={phoneNumber}
                                onChange={handlePhoneNumber}
                            />
                            <Form.Input
                                required
                                label='Confirm U.S. Phone Number'
                                name='phoneNumber'
                                placeholder='XXXXXXXXXX'
                                type='tel'
                                value={confirmPhoneNumber}
                                onChange={handleConfirmPhoneNumber}
                            />
                            {!phoneNumberMatch && (
                                <Container className='pass-match-error'>
                                    <Icon name='exclamation circle' />
                                    Phone Number do not match.
                                </Container>
                            )}
                            <Form.Input
                                fluid
                                required
                                aria-label='New-Password'
                                type='password'
                                label='New password'
                                name='newPassword'
                                placeholder='new password'
                                autoComplete='new-password'
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
                                autoComplete='new-password'
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
                            {showPasswordErrors &&
                                passwordErrorMessages().length > 0 && (
                                    <Message
                                        error
                                        header='Password must satisfy the following requirements:'
                                        list={passwordErrorMessages()}
                                    />
                                )}
                            <Divider section />
                            <Header
                                as='h5'
                                textAlign='center'
                                content='Payment Information'
                            />
                            <p>
                                All users are given a one-month free trial.
                                Credit cards will not be billed until the start
                                of the second month.
                            </p>
                            <Form.Input
                                required
                                aria-label='Card Number'
                                fluid
                                label='Card Number'
                                placeholder='Card number'
                                name='cardNumber'
                                width={16}
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                            />

                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Expiration Month'
                                    required
                                    width={6}
                                    options={expirationMonthOptions}
                                    placeholder='MM'
                                    name='expirationMonth'
                                    value={expirationMonth}
                                    onChange={handleExpirationMonthChange}
                                />
                                <Form.Input
                                    label='Expiration Year'
                                    required
                                    width={6}
                                    options={expirationYearOptions}
                                    placeholder='YY'
                                    name='expirationYear'
                                    value={expirationYear}
                                    onChange={handleExpirationYearChange}
                                />
                                <Form.Input
                                    fluid
                                    label='CVV'
                                    required
                                    width={6}
                                    aria-label='CVV'
                                    name='cvv'
                                    placeholder='111'
                                    value={cvv}
                                    onChange={handleCVVChange}
                                />
                                <Form.Input
                                    fluid
                                    label='Zip Code'
                                    required
                                    width={10}
                                    name='zipCode'
                                    placeholder='00000'
                                    value={zipCode}
                                    onChange={handleZipCodeChange}
                                />
                            </Form.Group>
                        </Container>
                    )}
                    <Container className='modal-button-container'>
                        <Button
                            basic
                            color='teal'
                            content='Cancel'
                            type='button'
                            onClick={() => {
                                setIsInviteDoctorOpen(false);
                                setShowTermsOfUseAndPrivacy(false);
                                reloadModal();
                            }}
                        />
                        {!showTermsOfUseAndPrivacy && (
                            <Button color='teal' content='Next' type='submit' />
                        )}
                        {showTermsOfUseAndPrivacy && (
                            <Button
                                color='teal'
                                content='Submit'
                                type='submit'
                            />
                        )}
                    </Container>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export default DoctorSignUp;
