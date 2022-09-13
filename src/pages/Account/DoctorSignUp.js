import doctorSignUp from 'auth/doctorSignUp';
import { minDoctorPassword } from 'constants/accountRequirements';
import React, { useState } from 'react';
import { passwordErrors } from 'constants/passwordErrors';
import constants from 'constants/registration-constants.json';
import './Account.css';
import {
    Button,
    Container,
    Form,
    Icon,
    Message,
    Modal,
    Header,
    Divider,
    Loader,
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
    const [showPasswordErrors, setShowPasswordErrors] = useState(false);

    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });
    const [wizardPage, setWizardPage] = useState(0);

    // handles loader at the end of submission
    const [isWizardLoading, setWizardLoading] = useState(false);

    // handles Terms of Use - Privacy policy
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

    // Navigation for the wizard: stops at page 3, starts at page 0
    // onNextClick increments the page by 1 unless we are already at page 3
    const onNextClick = (e) => {
        e.preventDefault();
        const nextPage = wizardPage > 2 ? 3 : wizardPage + 1;
        setWizardPage(nextPage);
    };
    // onPrevClick decrements the page by 1 unless we are already at page 0
    const onPrevClick = (e) => {
        e.preventDefault();
        const prevPage = wizardPage < 1 ? 0 : wizardPage - 1;
        setWizardPage(prevPage);
    };
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
            passesMinLength: value.length >= minDoctorPassword,
        });
        setNewPassword(value);
    };

    const handleConfirmNewPasswordChange = (e, { value }) => {
        setConfirmNewPassword(value);
        // set this to remove error styling on confirmNewPassword input
        setPasswordsMatch(true);
    };

    const isSubmitValid = (page) => {
        if (page === 0) {
            if (
                username === '' ||
                newPassword === '' ||
                firstName === '' ||
                lastName === '' ||
                phoneNumber === '' ||
                confirmEmail === ''
            ) {
                alert('Enter Required Fields');
                return false;
            }
            if (email != confirmEmail) {
                alert('Error: emails do not match');
                return false;
            }
            if (phoneNumberRegex.test(phoneNumber.toString()) === false) {
                alert('Error: check phone number');
                return false;
            }
            if (phoneNumber != confirmPhoneNumber) {
                alert('Error: phone numbers do not match');
                setPhoneNumberMatch(false);
                return false;
            }
            setPasswordsMatch(newPassword === confirmNewPassword);
            if (!isEmailValid(email)) {
                let errorText = 'Error: Unauthorized Email Address';
                alert(errorText);
                return false;
            }
            if (
                newPassword !== confirmNewPassword ||
                passwordErrorMessages().length > 0
            ) {
                return false;
            }
            return true;
        }
        if (page === 1) {
            if (
                cardNumber === '' ||
                expirationYear === '' ||
                expirationMonth === '' ||
                cvv === '' ||
                zipCode === ''
            ) {
                alert('Enter Required Fields');
                return false;
            } else {
                return true;
            }
        }
        if (page === 2) {
            if (isTermsChecked != true) {
                alert('Check Required Fields');
                return false;
            }
        }
        if (page === 3) {
            if (isPrivacyChecked != true) {
                alert('Check Required Fields');
                return false;
            }
        } else {
            return true;
        }
    };

    const createDoctor = async () => {
        setWizardLoading(true);
        // If the terms of use & privacy policy have been accepted, sign up the new doctor
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
            if (createUserResponse?.status === 'ERROR') {
                alert('Something Went Wrong!');
            }
        } else {
            alert(
                'Please check your email to complete the account verification process.'
            );
            setWizardLoading(false);
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

    const cssScroll = '.scroll { max-height: 240px; overflow-y: scroll; }';
    const cssCheckBoxes =
        '.checkBox { vertical-align: middle; line-height: 5px; min-width: 5px; display:flex; align-content:middle; flex:1; justify-content: center; }';
    const cssRightCheckBox = '.rCheckBox { float:right }';

    /* 
    Organized as having pages from 0 - 3
    First Page is a */
    return (
        <>
            {wizardPage === 0 && (
                <>
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
                            <Form error={passwordErrorMessages().length > 0}>
                                <Container>
                                    <Form.Group widths='equal'>
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
                                    </Form.Group>
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
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            required
                                            label='Email'
                                            name='email'
                                            placeholder='name@example.com'
                                            type='email'
                                            width={6}
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                        <Form.Input
                                            required
                                            label='Confirm Email'
                                            name='confirmEmail'
                                            placeholder='name@example.com'
                                            type='email'
                                            fluid
                                            width={6}
                                            value={confirmEmail}
                                            onChange={handleConfirmEmailChange}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            required
                                            label='U.S. Phone Number'
                                            name='phoneNumber'
                                            fluid
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
                                    </Form.Group>
                                    {!phoneNumberMatch && (
                                        <Container className='pass-match-error'>
                                            <Icon name='exclamation circle' />
                                            Phone Number do not match.
                                        </Container>
                                    )}
                                    <Form.Group widths='equal'>
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
                                            onChange={
                                                handleConfirmNewPasswordChange
                                            }
                                        />
                                    </Form.Group>
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
                                </Container>
                                <Container className='modal-button-container'>
                                    <Button
                                        basic
                                        color='teal'
                                        content='Cancel'
                                        type='button'
                                        onClick={() => {
                                            setIsInviteDoctorOpen(false);
                                            reloadModal();
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Prev'
                                        type='button'
                                        onClick={(e) => {
                                            onPrevClick(e);
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Next'
                                        onClick={(e) => {
                                            if (isSubmitValid(wizardPage)) {
                                                onNextClick(e);
                                            }
                                        }}
                                    />
                                </Container>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </>
            )}
            {wizardPage === 1 && (
                <>
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
                        <Modal.Header>Free Trial</Modal.Header>
                        <Modal.Content>
                            <Form error={passwordErrorMessages().length > 0}>
                                <Container>
                                    <Header
                                        as='h5'
                                        textAlign='center'
                                        content=''
                                    />
                                    <div id='signup-modal-div'>
                                        <p
                                            style={{ textAlign: 'left' }}
                                            id='signup-modal-text'
                                        >
                                            You have been given a one-month free
                                            trial. Your card will not be billed
                                            until the second month. The
                                            subscription is $14.99/month. You
                                            may cancel anytime.
                                        </p>
                                    </div>
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
                                            onChange={
                                                handleExpirationMonthChange
                                            }
                                        />
                                        <Form.Input
                                            label='Expiration Year'
                                            required
                                            width={6}
                                            options={expirationYearOptions}
                                            placeholder='YY'
                                            name='expirationYear'
                                            value={expirationYear}
                                            onChange={
                                                handleExpirationYearChange
                                            }
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
                                <Container className='modal-button-container'>
                                    <Button
                                        basic
                                        color='teal'
                                        content='Cancel'
                                        type='button'
                                        onClick={() => {
                                            setIsInviteDoctorOpen(false);
                                            reloadModal();
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Prev'
                                        type='button'
                                        onClick={(e) => {
                                            onPrevClick(e);
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Next'
                                        onClick={(e) => {
                                            if (isSubmitValid(wizardPage)) {
                                                onNextClick(e);
                                            }
                                        }}
                                    />
                                </Container>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </>
            )}
            {wizardPage === 2 && (
                <>
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
                        <Modal.Header>Terms of Use</Modal.Header>
                        <Modal.Content>
                            <Form error={passwordErrorMessages().length > 0}>
                                <Container>
                                    <Header
                                        as='h5'
                                        textAlign='center'
                                        content=''
                                    />
                                    <div className='scroll'>
                                        <style> {cssScroll} </style>
                                        <Terms_and_conditions title={true} />
                                    </div>
                                    <Divider section />
                                    <div
                                        className='checkBox'
                                        style={{ textAlign: 'right' }}
                                    >
                                        <style> {cssCheckBoxes} </style>
                                        <div className='rCheckBox'>
                                            <style>{cssRightCheckBox}</style>
                                            <Form.Input
                                                required
                                                label='Agree To Terms of Use'
                                                name='term'
                                                type='checkbox'
                                                checked={isTermsChecked}
                                                onClick={() => {
                                                    setIsTermsChecked(
                                                        !isTermsChecked
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Container>
                                <Container className='modal-button-container'>
                                    <Button
                                        basic
                                        color='teal'
                                        content='Cancel'
                                        type='button'
                                        onClick={() => {
                                            setIsInviteDoctorOpen(false);
                                            reloadModal();
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Prev'
                                        type='button'
                                        onClick={(e) => {
                                            onPrevClick(e);
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Next'
                                        onClick={(e) => {
                                            if (isSubmitValid(wizardPage)) {
                                                onNextClick(e);
                                            }
                                        }}
                                    />
                                </Container>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </>
            )}
            {wizardPage === 3 && (
                <>
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
                        <Modal.Header>Privacy Policy</Modal.Header>
                        <Modal.Content>
                            <Form error={passwordErrorMessages().length > 0}>
                                <Container>
                                    <Header
                                        as='h5'
                                        textAlign='center'
                                        content=''
                                    />
                                    <div className='scroll'>
                                        <style>{cssScroll}</style>
                                        <Policy title={true} />
                                    </div>
                                    <div className='checkBox'>
                                        <style> {cssCheckBoxes} </style>
                                        <div className='rCheckBox'>
                                            <style>{cssRightCheckBox}</style>
                                            <Form.Input
                                                required
                                                label='Agree To Privacy Policy'
                                                name='privacy'
                                                type='checkbox'
                                                checked={isPrivacyChecked}
                                                onClick={() => {
                                                    setIsPrivacyChecked(
                                                        !isPrivacyChecked
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Container>
                                <Container className='modal-button-container'>
                                    <Button
                                        basic
                                        color='teal'
                                        content='Cancel'
                                        type='button'
                                        onClick={() => {
                                            setIsInviteDoctorOpen(false);
                                            reloadModal();
                                        }}
                                    />
                                    <Button
                                        color='teal'
                                        content='Prev'
                                        type='button'
                                        onClick={(e) => {
                                            onPrevClick(e);
                                        }}
                                    />
                                    {isPrivacyChecked && (
                                        <Button
                                            color='teal'
                                            content='Submit'
                                            onClick={createDoctor}
                                        />
                                    )}
                                    {isWizardLoading && (
                                        <Loader active inline='centered' />
                                    )}
                                </Container>
                            </Form>
                        </Modal.Content>
                    </Modal>
                </>
            )}
        </>
    );
};

export default DoctorSignUp;
