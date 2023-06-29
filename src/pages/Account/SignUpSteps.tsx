import React from 'react';
import { UserInfoStep } from './UserInfoStep';
import { PrivacyPolicyStep } from './PrivacyPolicyStep';
import { AddPaymentStep } from './AddPaymentStep';
import { TermsStep } from './TermsStep';
import { InstitutionPickerStep } from './InstitutionPickerStep';
import { log } from 'modules/logging';

export const USER_INFO_STEP = 0;
export const INSTITUTION_STEP = 1;
export const PAYMENT_STEP = 2;
export const TERMS_STEP = 3;
export const PRIVACY_STEP = 4;

export interface StepProps {
    step: number;
    closeModal: () => void;
    goToPrevStep: () => void;
    goToNextStep: () => void;
}
export default function SignUpSteps(props: StepProps) {
    let stepContent = null as unknown as JSX.Element;
    const { step } = props;

    switch (step) {
        case USER_INFO_STEP:
            stepContent = <UserInfoStep />;
            break;
        case INSTITUTION_STEP:
            stepContent = <InstitutionPickerStep />;
            break;
        case PAYMENT_STEP:
            stepContent = <AddPaymentStep />;
            break;
        case TERMS_STEP:
            stepContent = <TermsStep />;
            break;
        case PRIVACY_STEP:
            stepContent = <PrivacyPolicyStep />;
            break;
        default:
            log(`Invalid SignUp step reached: ${step}`);
            break;
    }

    return stepContent;
}
