import doctorSignUp from 'auth/doctorSignUp';
import { minDoctorPassword } from 'constants/accountRequirements';
import React, { createContext, useState } from 'react';
import { passwordErrors } from 'constants/passwordErrors';
import './Account.css';
import { Message, Modal, Header, Divider, Loader } from 'semantic-ui-react';
import { Form, FormikProvider } from 'formik';

import SignUpSteps from './SignUpSteps';
import { useClinicianSignUpFormController } from './useClinicianSignUpFormController';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { NextBackButtonGroup } from './NextBackButtonGroup';
import { ClinicianSignUpData, UserAttributes } from 'types/users';
import invariant from 'tiny-invariant';

export interface SignUpFormData extends ClinicianSignUpData {
    isPrivacyChecked: boolean;
}
// TODO: pull from session
const initialValues: SignUpFormData = {
    isPrivacyChecked: false,
    username: '',
    role: 'manager',
    email: '',
    // isInvited: false,  we don't need this, right?
    firstName: '',
    middleName: '',
    lastName: '',
    countryCode: '',
    newPassword: '',
    confirmNewPassword: '',
    phoneNumber: '',
};

interface Props {
    sessionUserAttributes: UserAttributes | null;
    cognitoUser: CognitoUser | null;
}
export default function SignUpForm({
    // userUsername = '',
    // userRole = '',
    // userEmail = '',
    // isInvited = false,
    // userFirstName = '',
    // userLastName = '',
    // onInviteSubmit = {},
    sessionUserAttributes,
    cognitoUser,
}: Props) {
    // const [formData, setFormData] = useState({});
    const [wizardPage, setWizardPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const { form } = useClinicianSignUpFormController(
        initialValues,
        sessionUserAttributes,
        cognitoUser
    );

    // const stripe = useStripe();
    // const elements = useElements();
    const phoneNumberRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[" "][-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );

    const [username, setUsername] = useState('userUsername');
    const [email, setEmail] = useState('userEmail');
    const [confirmEmail, setConfirmEmail] = useState('userEmail');

    const [firstName, setFirstName] = useState('userFirstName');
    const [lastName, setLastName] = useState('userLastName');
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
    const [userInfo, setUserInfo] = useState({
        username,
        userRole: 'role',
        firstName: 'userFirstName',
        middleName: '',
        lastName: 'userLastName',
        email: 'userEmail',
        countryCode: '+1',
        phoneNumber: '',
        phoneNumberIsMobile: true,
        managerResponsibleForPayment: false,
    });
    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });

    // handles Terms of Use - Privacy policy
    const [isTermsChecked, setIsTermsChecked] = useState(false);

    // onPrevClick decrements the page by 1 unless we are already at page 0
    const onPrevClick = () => {
        const prevPage = wizardPage < 1 ? 0 : wizardPage - 1;
        if (prevPage === 1) {
            setWizardPage(prevPage - 1);
        }
        setWizardPage(prevPage);
    };
    // const handleNewPasswordChange = (e, { value }) => {
    //     setShowPasswordErrors(true);
    //     setPasswordReqs({
    //         ...passwordReqs,
    //         containsNumber: value.match(/\d+/g) ? true : false,
    //         containsUpper: value.toLowerCase() !== value,
    //         containsLower: value.toUpperCase() !== value,
    //         containsSpecial: value.match(
    //             /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|'+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
    //         )
    //             ? true
    //             : false,
    //         passesMinLength: value.length >= minDoctorPassword,
    //     });
    //     setNewPassword(value);
    // };

    // const handleConfirmNewPasswordChange = (e, { value }) => {
    //     setConfirmNewPassword(value);
    //     // set this to remove error styling on confirmNewPassword input
    //     setPasswordsMatch(true);
    // };

    const handleFormatPhoneForSubmit = (phoneNumber: string) => {
        phoneNumber = phoneNumber.replace('(', '');
        phoneNumber = phoneNumber.replace(/-|\(|\)/gi, '');
        phoneNumber = phoneNumber.replace(' ', '');
        return phoneNumber;
    };

    // TODO: make sure phone is formatted before submission
    // const handleSubmit = () => {
    //     setUserInfo(userInfo);
    //     userInfo.username = username;
    //     userInfo.firstName = firstName;
    //     userInfo.lastName = lastName;
    //     userInfo.phoneNumber = handleFormatPhoneForSubmit(phoneNumber);

    //     onInviteSubmit(newPassword, {
    //         ...userInfo,
    //     });
    // };

    // TODO: move to yup
    const isSubmitValid = () => {
        const page = wizardPage;
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

            invariant(cardElementContainer, 'card setup failed');

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
            // if (isPrivacyChecked != true) {
            //     alert('Check Required Fields');
            //     return false;
            // }
        } else {
            return true;
        }
    };

    // TODO: implement clinician sign up
    // const createDoctor = async () => {
    //     setWizardLoading(true);

    //     // If the terms of use & privacy policy have been accepted, sign up the new doctor
    //     let createUserResponse;
    //     try {
    //         createUserResponse = await doctorSignUp(
    //             username,
    //             newPassword,
    //             email,
    //             firstName,
    //             lastName,
    //             phoneNumber,
    //             paymentMethod.id
    //         );
    //     } catch (e) {
    //         setWizardLoading(false);
    //         return;
    //     }

    //     if (
    //         createUserResponse?.status === 'ERROR' &&
    //         createUserResponse?.message.includes('User account already exists')
    //     ) {
    //         setDuplicateUsername(true);
    //         if (createUserResponse?.status === 'ERROR') {
    //             alert('Something Went Wrong!');
    //         }
    //     } else {
    //         alert(
    //             'Please check your email to complete the account verification process.'
    //         );
    //         setWizardLoading(false);
    //         setModalOpen(false);
    //     }
    // };

    // const handleUsernameChange = (e, { value: any }) => {
    //     // TODO: preserve logic
    //     // if (isInvited && userRole === 'doctor') {
    //     //     alert(
    //     //         'You cannot change the username of an invited healthcare professional.'
    //     //     );
    //     //     return;
    //     // }
    //     // setUsername(value);
    //     setDuplicateUsername(false);
    // };

    // const handleEmailChange = (e, { value }) => {
    //     // TODO: preserve logic
    //     // if (isInvited && userRole === 'doctor') {
    //     //     alert(
    //     //         'You cannot change the email of an invited healthcare professional.'
    //     //     );
    //     //     return;
    //     // }
    //     setEmail(value);
    //     setEmailsMatch(true);
    // };

    //     // TODO: preserve logic
    // const handleConfirmEmailChange = (e, { value }) => {
    //     setConfirmEmail(value);
    //     setEmailsMatch(true);
    // };

    //     // TODO: preserve logic
    // const handleFirstNameChange = (e, { value }) => {
    //     if (isInvited && userRole === 'doctor') {
    //         alert(
    //             'You cannot change the name of an invited healthcare professional.'
    //         );
    //         return;
    //     }
    //     setFirstName(value);
    // };

    //     // TODO: preserve logic
    // const handleLastNameChange = (e, { value }) => {
    //     if (isInvited && userRole === 'doctor') {
    //         alert(
    //             'You cannot change the name of an invited healthcare professional.'
    //         );
    //         return;
    //     }
    //     setLastName(value);
    // };

    // TODO: preserve logic
    // const handlePhoneNumber = (e, { value }) => {
    //     const formattedPhoneNumber = formatPhoneNumber(value);
    //     setPhoneNumber(formattedPhoneNumber);
    // };
    // //     // TODO: preserve logic
    // const handleConfirmPhoneNumber = (e, { value }) => {
    //     const formattedPhoneNumber = formatPhoneNumber(value);
    //     setConfirmPhoneNumber(formattedPhoneNumber);
    //     setPhoneNumberMatch(true);
    // };

    // function formatPhoneNumber(value) {
    //     // if input value is falsy eg if the user deletes the input, then just return
    //     if (!value) return value;
    //     // clean the input for any non-digit values.
    //     const phoneNumber = value.replace(/[^\d]/g, '');
    //     // phoneNumberLength is used to know when to apply our formatting for the phone number
    //     const phoneNumberLength = phoneNumber.length;
    //     // we need to return the value with no formatting if its less then four digits
    //     // this is to avoid weird behavior that occurs if you  format the area code to early
    //     if (phoneNumberLength < 4) return phoneNumber;
    //     // if phoneNumberLength is greater than 4 and less the 7 we start to return
    //     // the formatted number
    //     if (phoneNumberLength < 7) {
    //         return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
    //     }
    //     // finally, if the phoneNumberLength is greater then seven, we add the last
    //     // bit of formatting and return it.
    //     return (
    //         '(' +
    //         phoneNumber.slice(0, 3) +
    //         ') ' +
    //         phoneNumber.slice(3, 6) +
    //         '-' +
    //         phoneNumber.slice(6, 10)
    //     );
    // }

    const passwordErrorMessages = () => {
        const errMsgs: any[] = [];
        const passwordErrs = passwordErrors('doctor');
        for (const err in passwordErrs) {
            // if (!passwordReqs[err]) {
            //     errMsgs.push(
            //         <Message.Item key={err} content={passwordErrs[err]} />
            //     );
            // }
        }

        return errMsgs;
    };

    // Navigation for the wizard: stops at page 3, starts at page 0
    // onNextClick increments the page by 1 unless we are already at page 3
    const onNextClick = async () => {
        // // handle stripe payment method creation
        // if (wizardPage === 1) {
        //     const success = await createStripePaymentMethod();
        //     if (!success) {
        //         return;
        //     }
        // }

        // TODO: handle users who need to skip payment setup
        // const nextPage = wizardPage > 2 ? 3 : wizardPage + 1;
        // if (isInvited && nextPage === 1) {
        //     setWizardPage(nextPage + 1);
        // } else {
        //     setWizardPage(nextPage);
        // }

        setWizardPage(wizardPage + 1);
    };

    return (
        <FormikProvider value={form}>
            <Form style={{ height: '100%' }}>
                <Modal
                    dimmer='inverted'
                    size='small'
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    onOpen={() => setModalOpen(true)}
                    open={modalOpen}
                >
                    {loading ? (
                        <Loader active inline='centered' />
                    ) : (
                        <>
                            <SignUpSteps
                                step={wizardPage}
                                goToNextStep={onNextClick}
                                closeModal={() => {
                                    setModalOpen(false);
                                }}
                                goToPrevStep={onPrevClick}
                            />
                            <NextBackButtonGroup
                                onClose={() => {
                                    setModalOpen(false);
                                    // reloadModal();
                                }}
                                onPrevClick={onPrevClick}
                                onNextClick={() => {
                                    // TODO: use yup for validation
                                    // if (isSubmitValid(wizardPage)) {
                                    onNextClick();
                                    // }
                                }}
                            />
                        </>
                    )}
                </Modal>
            </Form>
        </FormikProvider>
    );
}
