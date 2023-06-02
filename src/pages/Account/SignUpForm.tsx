import React, { useState } from 'react';
import './Account.css';
import { Modal } from 'semantic-ui-react';
import { Form, FormikProvider } from 'formik';

import SignUpSteps from './SignUpSteps';
import { useSignUpFormController } from './useSignUpFormController';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { NextBackButtonGroup } from './NextBackButtonGroup';
import { ClinicianSignUpData, UserAttributes } from 'types/users';
import invariant from 'tiny-invariant';

export interface SignUpFormData extends ClinicianSignUpData {
    isPrivacyChecked: boolean;
    isTermsChecked: boolean;
    paymentMethod?: string | any; // TODO: discuss moving this to manager's table?
}
// TODO: pull from session
const initialValues: SignUpFormData = {
    isTermsChecked: false,
    isPrivacyChecked: false,
    username: '',
    role: 'manager',
    email: '',
    confirmEmail: '',
    institutionName: '',
    // isInvited: false,  we don't need this, right?
    firstName: '',
    // middleName: '',
    lastName: '',
    newPassword: '',
    confirmNewPassword: '',
    confirmPhoneNumber: '+1',
    phoneNumber: '+1',
    paymentMethod: '',
};

interface Props {
    sessionUserAttributes: UserAttributes | null;
    cognitoUser: CognitoUser | null;
}
export default function SignUpForm({
    sessionUserAttributes,
    cognitoUser,
}: Props) {
    const [wizardPage, setWizardPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(true);

    const { form } = useSignUpFormController(
        initialValues,
        sessionUserAttributes,
        cognitoUser
    );

    const phoneNumberRegex = new RegExp(
        '^[+]?[(]?[0-9]{3}[)]?[" "][-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
    );

    const [username, setUsername] = useState('userUsername');
    const [email, setEmail] = useState('userEmail');
    const [confirmEmail, setConfirmEmail] = useState('userEmail');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [phoneNumberMatch, setPhoneNumberMatch] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
                // firstName === '' ||
                // lastName === '' ||
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
            // setEmailsMatch(email === confirmEmail);
            // setPasswordsMatch(newPassword === confirmNewPassword);

            // if (
            //     newPassword !== confirmNewPassword ||
            //     passwordErrorMessages().length > 0
            // ) {
            //     return false;
            // }
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
                    <SignUpSteps
                        step={wizardPage}
                        goToNextStep={onNextClick}
                        closeModal={() => {
                            setModalOpen(false);
                        }}
                        goToPrevStep={onPrevClick}
                    />
                    <NextBackButtonGroup
                        step={wizardPage}
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
                </Modal>
            </Form>
        </FormikProvider>
    );
}
