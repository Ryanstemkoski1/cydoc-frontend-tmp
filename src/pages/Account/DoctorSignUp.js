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
import emailsRegex from '../../auth/authorizedEmails';
import emailRegexCheckFunc from '../../auth/emailRegexCheckFunc';

const DoctorSignUp = () => {
    const phoneNumberRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );
    const [emailRegexCheck, setEmailRegexCheck] = useState(false);
    const [isInviteDoctorOpen, setIsInviteDoctorOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [duplicateUsername, setDuplicateUsername] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [phoneNumberMatch, setPhoneNumberMatch] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [expirationMonth, setExpirationMonth] = useState();
    const [expirationYear, setExpirationYear] = useState();
    const [cardNumber, setCardNumber] = useState();
    const [cvv, setCVV] = useState();
    const [zipCode, setZipCode] = useState('');
    const [continueButtonState, setContinueButtonState] = useState(false);
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

    const createDoctor = async () => {
        const check = await emailRegexCheckFunc(email);
        setEmailRegexCheck(check);
        if (continueButtonState == false) {
            setContinueButtonState(true);
            return;
        }
        if (
            username === '' ||
            newPassword === '' ||
            firstName === '' ||
            lastName === '' ||
            phoneNumber === undefined ||
            cardNumber === undefined ||
            expirationYear === undefined ||
            expirationMonth === undefined ||
            cvv === undefined ||
            zipCode === undefined
        ) {
            alert('Enter Required Feilds');
            setContinueButtonState(false);
            return {
                status: 'ERROR',
            };
        }
        if (phoneNumberRegex.test(phoneNumber.toString()) === false) {
            alert('Error Check Phone Number');
            setContinueButtonState(false);
            return {
                status: 'ERROR',
            };
        }
        if (phoneNumber != confirmPhoneNumber) {
            alert('Error Phone Number do not match');
            setPhoneNumberMatch(false);
            setContinueButtonState(false);
            return {
                status: 'ERROR',
            };
        }
        setPasswordsMatch(newPassword === confirmNewPassword);
        if (emailRegexCheck == false) {
            for (let val of emailsRegex) {
                const regex = new RegExp(val);
                if (!regex.test(email)) {
                    setEmailRegexCheck(true);
                } else if (regex.test(email)) {
                    setEmailRegexCheck(false);
                }
            }
            if (emailRegexCheck) {
                let errorText = 'Error Unauthorized Email\nAllowed Addresses:';
                for (let val of emailsRegex) {
                    errorText += '\n' + val.replace('$', '');
                }
                alert(errorText);
                setEmailRegexCheck(false);
                setContinueButtonState(false);
                return {
                    status: 'ERROR',
                };
            }
        }
        if (emailRegexCheck) {
            let errorText = 'Error Unauthorized Email\nAllowed Addresses:';
            for (let val of emailsRegex) {
                errorText += '\n' + val.replace('$', '');
            }
            alert(errorText);
            setEmailRegexCheck(false);
            setContinueButtonState(false);
            return {
                status: 'ERROR',
            };
        }
        if (
            newPassword !== confirmNewPassword ||
            passwordErrorMessages().length > 0
        ) {
            setContinueButtonState(false);
            return;
        }
        setContinueButtonState(false);
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
            createUserResponse?.message.includes('User account already exists')
        ) {
            setDuplicateUsername(true);
        } else {
            setIsInviteDoctorOpen(false);
        }
    };

    const handleUsernameChange = (e, { value }) => {
        setUsername(value);
        setDuplicateUsername(false);
    };

    const handleEmailChange = (e, { value }) => {
        setEmail(value);
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
    const cssRedAsterisk = '.redAsterisk::after { color:red; content:"*" }';
    return (
        <Modal
            dimmer='inverted'
            size='small'
            onClose={() => setIsInviteDoctorOpen(false)}
            onOpen={() => setIsInviteDoctorOpen(true)}
            open={isInviteDoctorOpen}
            trigger={<Button icon='plus' content='Sign Up' size='small' />}
        >
            <Modal.Header>Sign Up</Modal.Header>
            <Modal.Content>
                <Form
                    onSubmit={createDoctor}
                    error={passwordErrorMessages().length > 0}
                >
                    {continueButtonState && (
                        <Container>
                            <Header
                                as='h5'
                                textAlign='center'
                                content='Terms of Use'
                            />
                            <div className='scroll'>
                                <style> {cssScroll} </style>
                                <p>
                                    {/* eslint-disable */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla semper malesuada felis ut congue. Pellentesque volutpat dictum neque at eleifend. Ut blandit volutpat augue vitae aliquet. Fusce a elementum magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse velit est, viverra nec imperdiet et, consectetur blandit leo. Vestibulum dignissim ipsum eget mauris porta, sed vehicula augue hendrerit. Donec et mauris in mi aliquet dignissim. Curabitur molestie feugiat neque volutpat condimentum. Ut accumsan, enim ac hendrerit pulvinar, sapien sapien mollis sem, sit amet laoreet lectus nisl congue ante. Curabitur non varius tellus, vitae fringilla lacus. Phasellus vel consequat ex. Aliquam eleifend, leo quis semper cursus, risus enim viverra purus, vel pellentesque nisl felis id purus. Praesent in sodales arcu. Quisque consequat mauris ac dui varius blandit.
                                    Aliquam mi nunc, consequat nec aliquam nec, lacinia nec orci. Donec faucibus aliquam orci vitae bibendum. Cras eu ligula congue, imperdiet massa et, condimentum turpis. Donec eget iaculis elit. Proin rutrum, lectus sollicitudin gravida imperdiet, quam massa pretium est, sed commodo leo nunc vel nisl. Sed tristique vestibulum viverra. Sed commodo congue lorem, vitae finibus nibh rutrum quis. Donec nec vehicula odio. Aliquam commodo rutrum sapien ac molestie. Aenean at aliquet massa. Mauris dapibus erat nisi, id eleifend massa sodales quis. Donec vestibulum ipsum in arcu imperdiet, nec hendrerit quam iaculis. Praesent vehicula a augue a vehicula. Praesent maximus condimentum molestie. Vestibulum sem erat, finibus eu diam sit amet, fringilla commodo ipsum. Maecenas ac pretium nisl. Quisque quis quam urna. Proin et risus placerat, bibendum lacus a, maximus neque. Sed feugiat lobortis gravida. Vestibulum placerat commodo est, vel consequat est finibus quis. Vivamus quis velit metus. Pellentesque nec mattis quam. Suspendisse blandit sodales ipsum eget luctus. Duis varius ipsum eget odio bibendum, at porta mi luctus. Sed in dictum tortor.
                                    Nam volutpat consequat iaculis. Nulla quis lacus tincidunt, gravida velit eu, gravida nisi. Donec tempus, neque at consequat placerat, velit nunc dictum mauris, quis lacinia sem dolor ac tortor. Vivamus sit amet dolor sollicitudin, tincidunt velit a, pretium est. Aliquam vel purus id mi tristique cursus. Vivamus a odio nec ex varius condimentum. Integer a leo velit.
                                    Morbi quis viverra massa, ut molestie ante. Duis auctor augue fermentum vulputate malesuada. Suspendisse eget lorem lacus. Maecenas arcu ligula, vehicula a nunc eget, suscipit tempus dolor. Proin in hendrerit arcu. Suspendisse aliquet mollis laoreet. Sed tempus mauris bibendum sollicitudin volutpat. Nullam ullamcorper sem risus, in sagittis orci finibus et.
                                    {/* eslint-enable */}
                                </p>
                            </div>
                            <Divider section />
                            <Header
                                as='h5'
                                textAlign='center'
                                content='Privacy Policy'
                            />
                            <div className='scroll'>
                                <style>{cssScroll}</style>
                                {/* eslint-disable */}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla semper malesuada felis ut congue. Pellentesque volutpat dictum neque at eleifend. Ut blandit volutpat augue vitae aliquet. Fusce a elementum magna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse velit est, viverra nec imperdiet et, consectetur blandit leo. Vestibulum dignissim ipsum eget mauris porta, sed vehicula augue hendrerit. Donec et mauris in mi aliquet dignissim. Curabitur molestie feugiat neque volutpat condimentum. Ut accumsan, enim ac hendrerit pulvinar, sapien sapien mollis sem, sit amet laoreet lectus nisl congue ante. Curabitur non varius tellus, vitae fringilla lacus. Phasellus vel consequat ex. Aliquam eleifend, leo quis semper cursus, risus enim viverra purus, vel pellentesque nisl felis id purus. Praesent in sodales arcu. Quisque consequat mauris ac dui varius blandit.
                                Aliquam mi nunc, consequat nec aliquam nec, lacinia nec orci. Donec faucibus aliquam orci vitae bibendum. Cras eu ligula congue, imperdiet massa et, condimentum turpis. Donec eget iaculis elit. Proin rutrum, lectus sollicitudin gravida imperdiet, quam massa pretium est, sed commodo leo nunc vel nisl. Sed tristique vestibulum viverra. Sed commodo congue lorem, vitae finibus nibh rutrum quis. Donec nec vehicula odio. Aliquam commodo rutrum sapien ac molestie. Aenean at aliquet massa. Mauris dapibus erat nisi, id eleifend massa sodales quis. Donec vestibulum ipsum in arcu imperdiet, nec hendrerit quam iaculis. Praesent vehicula a augue a vehicula. Praesent maximus condimentum molestie. Vestibulum sem erat, finibus eu diam sit amet, fringilla commodo ipsum. Maecenas ac pretium nisl. Quisque quis quam urna. Proin et risus placerat, bibendum lacus a, maximus neque. Sed feugiat lobortis gravida. Vestibulum placerat commodo est, vel consequat est finibus quis. Vivamus quis velit metus. Pellentesque nec mattis quam. Suspendisse blandit sodales ipsum eget luctus. Duis varius ipsum eget odio bibendum, at porta mi luctus. Sed in dictum tortor.
                                Nam volutpat consequat iaculis. Nulla quis lacus tincidunt, gravida velit eu, gravida nisi. Donec tempus, neque at consequat placerat, velit nunc dictum mauris, quis lacinia sem dolor ac tortor. Vivamus sit amet dolor sollicitudin, tincidunt velit a, pretium est. Aliquam vel purus id mi tristique cursus. Vivamus a odio nec ex varius condimentum. Integer a leo velit.
                                Morbi quis viverra massa, ut molestie ante. Duis auctor augue fermentum vulputate malesuada. Suspendisse eget lorem lacus. Maecenas arcu ligula, vehicula a nunc eget, suscipit tempus dolor. Proin in hendrerit arcu. Suspendisse aliquet mollis laoreet. Sed tempus mauris bibendum sollicitudin volutpat. Nullam ullamcorper sem risus, in sagittis orci finibus et.
                                {/* eslint-enable */}
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
                    {!continueButtonState && (
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
                                label='U.S. Phone Number'
                                name='phoneNumber'
                                placeholder=''
                                type='tel'
                                value={phoneNumber}
                                onChange={handlePhoneNumber}
                            />
                            <Form.Input
                                required
                                label='Confirm U.S. Phone Number'
                                name='phoneNumber'
                                placeholder=''
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
                            <label className='redAsterisk'>
                                <style> {cssRedAsterisk}</style>
                                Card Number
                            </label>
                            <Form.Input
                                required
                                aria-label='Card Number'
                                placeholder='card number'
                                name='cardNumber'
                                width={16}
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                            />
                            <label className='redAsterisk'>
                                Expiration Date
                            </label>
                            <Form.Group widths='equal' required>
                                <Form.Select
                                    fluid
                                    required
                                    width={2}
                                    options={expirationMonthOptions}
                                    placeholder='MM'
                                    name='expirationMonth'
                                    value={expirationMonth}
                                    onChange={handleExpirationMonthChange}
                                />
                                <Form.Select
                                    fluid
                                    required
                                    width={2}
                                    options={expirationYearOptions}
                                    placeholder='YY'
                                    name='expirationYear'
                                    value={expirationYear}
                                    onChange={handleExpirationYearChange}
                                />
                                <div className='redAsterisk'>CVV</div>
                                <Form.Input
                                    fluid
                                    required
                                    width={3}
                                    aria-label='CVV'
                                    name='cvv'
                                    placeholder='111'
                                    value={cvv}
                                    onChange={handleCVVChange}
                                />
                                <div className='redAsterisk'>Zip Code</div>
                                <Form.Input
                                    fluid
                                    required
                                    width={5}
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
                                setContinueButtonState(false);
                            }}
                        />
                        {!continueButtonState && (
                            <Button color='teal' content='Next' type='submit' />
                        )}
                        {continueButtonState && (
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
