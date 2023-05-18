import doctorSignUp from 'auth/doctorSignUp';
import { minDoctorPassword } from 'constants/accountRequirements';
import React, { useState } from 'react';
import { passwordErrors } from 'constants/passwordErrors';
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
import Policy from '../../constants/Documents/policy';
import Terms_and_conditions from '../../constants/Documents/terms_and_conditions';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const ClinicianSignUp = ({
    continueIsActive,
    reloadModal,
    userUsername = '',
    userRole = '',
    userEmail = '',
    isInvited = false,
    userFirstName = '',
    userLastName = '',
    onInviteSubmit = {},
}) => {
    const initializeFormFields = (
        role,
        username,
        email,
        firstName,
        lastName
    ) => {
        if (role === 'doctor') {
            return {
                username,
                role,
                firstName,
                middleName: '',
                lastName,
                email,
                countryCode: '+1',
                phoneNumber: '',
                phoneNumberIsMobile: true,
                managerResponsibleForPayment: false,
            };
        } else if (role === 'manager') {
            return {
                username,
                role,
                firstName,
                middleName: '',
                lastName,
                email,
                countryCode: '+1',
                phoneNumber: '',
                phoneNumberIsMobile: true,
                managerResponsibleForPayment: false,
            };
        }
    };

    const stripe = useStripe();
    const elements = useElements();
    const phoneNumberRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[" "][-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );
    const [isInviteDoctorOpen, setIsInviteDoctorOpen] =
        useState(continueIsActive);
    const [username, setUsername] = useState(userUsername);
    const [email, setEmail] = useState(userEmail);
    const [confirmEmail, setConfirmEmail] = useState(userEmail);

    const [firstName, setFirstName] = useState(userFirstName);
    const [lastName, setLastName] = useState(userLastName);
    const [duplicateUsername, setDuplicateUsername] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [phoneNumberMatch, setPhoneNumberMatch] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [emailsMatch, setEmailsMatch] = useState(true);
    const [showPasswordErrors, setShowPasswordErrors] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [userInfo, setUserInfo] = useState(
        initializeFormFields(
            userRole,
            userUsername,
            userEmail,
            userFirstName,
            userLastName
        )
    );
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

    const createStripePaymentMethod = async () => {
        const card = elements.getElement(CardElement);
        if (card == null) {
            return false;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: {
                name: `${firstName} ${lastName}`,
            },
        });

        if (error) {
            alert('Card Error', error);
            return false;
        }
        setPaymentMethod(paymentMethod);
        return true;
    };

    // Navigation for the wizard: stops at page 3, starts at page 0
    // onNextClick increments the page by 1 unless we are already at page 3
    const onNextClick = async (e) => {
        e.preventDefault();

        // handle stripe payment method creation
        if (wizardPage === 1) {
            const success = await createStripePaymentMethod();
            if (!success) {
                return;
            }
        }

        const nextPage = wizardPage > 2 ? 3 : wizardPage + 1;
        if (isInvited && nextPage === 1) {
            setWizardPage(nextPage + 1);
        } else {
            setWizardPage(nextPage);
        }
    };
    // onPrevClick decrements the page by 1 unless we are already at page 0
    const onPrevClick = (e) => {
        e.preventDefault();
        const prevPage = wizardPage < 1 ? 0 : wizardPage - 1;
        if (isInvited && prevPage === 1) {
            setWizardPage(prevPage - 1);
        }
        setWizardPage(prevPage);
    };
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

    const handleFormatPhoneForSubmit = (phoneNumber) => {
        phoneNumber = phoneNumber.replace('(', '');
        phoneNumber = phoneNumber.replace(/-|\(|\)/gi, '');
        phoneNumber = phoneNumber.replace(' ', '');
        return phoneNumber;
    };

    const handleSubmit = () => {
        setUserInfo(userInfo);
        userInfo.username = username;
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
        userInfo.phoneNumber = handleFormatPhoneForSubmit(phoneNumber);

        onInviteSubmit(newPassword, {
            ...userInfo,
        });
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
            setEmailsMatch(email === confirmEmail);
            setPasswordsMatch(newPassword === confirmNewPassword);

            // TODO: to discuss: do we need this logic at all?
            // per instruction doc we we are removing the email check, this isInvited logic is likely legacy code
            if (!isInvited) {
                const errorText = 'Error: Unauthorized Email Address';
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
            const cardElementContainer =
                document.querySelector('#card-element');

            const cardElementComplete = cardElementContainer.classList.contains(
                'StripeElement--complete'
            );

            if (!cardElementComplete) {
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
        let createUserResponse;
        try {
            createUserResponse = await doctorSignUp(
                username,
                newPassword,
                email,
                firstName,
                lastName,
                phoneNumber,
                paymentMethod.id
            );
        } catch (e) {
            setWizardLoading(false);
            return;
        }

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
        if (isInvited && userRole === 'doctor') {
            alert(
                'You cannot change the username of an invited healthcare professional.'
            );
            return;
        }
        setUsername(value);
        setDuplicateUsername(false);
    };

    const handleEmailChange = (e, { value }) => {
        if (isInvited && userRole === 'doctor') {
            alert(
                'You cannot change the email of an invited healthcare professional.'
            );
            return;
        }
        setEmail(value);
        setEmailsMatch(true);
    };

    const handleConfirmEmailChange = (e, { value }) => {
        setConfirmEmail(value);
        setEmailsMatch(true);
    };

    const handleFirstNameChange = (e, { value }) => {
        if (isInvited && userRole === 'doctor') {
            alert(
                'You cannot change the name of an invited healthcare professional.'
            );
            return;
        }
        setFirstName(value);
    };

    const handleLastNameChange = (e, { value }) => {
        if (isInvited && userRole === 'doctor') {
            alert(
                'You cannot change the name of an invited healthcare professional.'
            );
            return;
        }
        setLastName(value);
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
            return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
        }
        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return (
            '(' +
            phoneNumber.slice(0, 3) +
            ') ' +
            phoneNumber.slice(3, 6) +
            '-' +
            phoneNumber.slice(6, 10)
        );
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
                                            label='Email (.edu or healthcare domain)'
                                            name='email'
                                            placeholder='name@example.com'
                                            type='email'
                                            width={6}
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                        <Form.Input
                                            required
                                            error={!emailsMatch}
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
                                    {!emailsMatch && (
                                        <Container className='pass-match-error'>
                                            <Icon name='exclamation circle' />
                                            Emails do not match
                                        </Container>
                                    )}
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
                                    <div
                                        style={{
                                            maxWidth: '350px',
                                            marginTop: '15px',
                                            marginBottom: '15px',
                                            border: '1px solid grey',
                                            borderRadius: '4px',
                                            height: '40px',
                                            padding: '10px 10px 0 10px',
                                        }}
                                    >
                                        <CardElement id='card-element' />
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
                                    <Divider section />
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
                                    {isPrivacyChecked && !isInvited && (
                                        <Button
                                            color='teal'
                                            content='Submit'
                                            onClick={createDoctor}
                                        />
                                    )}
                                    {isPrivacyChecked && isInvited && (
                                        <Button
                                            color='teal'
                                            content='Submit'
                                            onClick={handleSubmit}
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

export default ClinicianSignUp;
