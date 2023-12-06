import React, { useState } from 'react';
import './Account.css';
import { Modal } from 'semantic-ui-react';
import { Form, FormikProvider } from 'formik';

import SignUpSteps from './SignUpSteps';
import { useSignUpFormController } from './useSignUpFormController';
import { NextBackButtonGroup } from './NextBackButtonGroup';
import { ClinicianSignUpData } from 'types/signUp';
import { UserRole } from '@cydoc-ai/types';

export interface SignUpFormData extends ClinicianSignUpData {
    isPrivacyChecked: boolean;
    isTermsChecked: boolean;
}
const initialValues: SignUpFormData = {
    isTermsChecked: false,
    isPrivacyChecked: false,
    role: UserRole.MANAGER,
    email: '',
    confirmEmail: '',
    institutionName: '',
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmNewPassword: '',
    confirmPhoneNumber: '+1',
    phoneNumber: '+1',
};

interface Props {
    closeModal: () => void;
    modalOpen: boolean;
}
export default function SignUpForm({ modalOpen, closeModal }: Props) {
    const [wizardPage, setWizardPage] = useState(0);
    const onNextClick = () => setWizardPage(wizardPage + 1);

    const { form } = useSignUpFormController(initialValues);

    // onPrevClick decrements the page by 1 unless we are already at page 0
    const onPrevClick = () => {
        const prevPage = wizardPage < 1 ? 0 : wizardPage - 1;
        if (prevPage === 1) {
            setWizardPage(prevPage - 1);
        }
        setWizardPage(prevPage);
    };

    // const handleFormatPhoneForSubmit = (phoneNumber: string) => {
    //     phoneNumber = phoneNumber.replace('(', '');
    //     phoneNumber = phoneNumber.replace(/-|\(|\)/gi, '');
    //     phoneNumber = phoneNumber.replace(' ', '');
    //     return phoneNumber;
    // };

    // TODO: make sure phone is formatted before submission
    //     userInfo.phoneNumber = handleFormatPhoneForSubmit(phoneNumber);

    //     onInviteSubmit(newPassword, {
    //         ...userInfo,
    //     });

    // TODO: move to yup
    // if (phoneNumberRegex.test(phoneNumber.toString()) === false) {
    //     alert('Error: check phone number');
    //     return false;
    // }

    // TODO: handle users who need to skip payment setup
    // const nextPage = wizardPage > 2 ? 3 : wizardPage + 1;
    // if (isInvited && nextPage === 1) {
    //     setWizardPage(nextPage + 1);
    // } else {
    //     setWizardPage(nextPage);
    // }

    return (
        <FormikProvider value={form}>
            <Form>
                <Modal
                    dimmer='inverted'
                    size='small'
                    onClose={closeModal}
                    open={modalOpen}
                >
                    <SignUpSteps
                        step={wizardPage}
                        goToNextStep={onNextClick}
                        closeModal={closeModal}
                        goToPrevStep={onPrevClick}
                    />
                    <NextBackButtonGroup
                        step={wizardPage}
                        onClose={closeModal}
                        onPrevClick={onPrevClick}
                        onNextClick={onNextClick}
                    />
                </Modal>
            </Form>
        </FormikProvider>
    );
}
