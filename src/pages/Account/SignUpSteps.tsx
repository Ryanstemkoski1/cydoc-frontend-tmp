import React, { useContext } from 'react';
import { UserInfoStep } from './UserInfoStep';
import { PrivacyPolicyStep } from './PrivacyPolicyStep';
import { AddPaymentStep } from './AddPaymentStep';
import { TermsStep } from './TermsStep';

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
        case 0:
            stepContent = <UserInfoStep {...props} />;
            break;
        case 1:
            stepContent = <AddPaymentStep />;
            break;
        case 2:
            stepContent = <TermsStep />;
            break;
        case 3:
            stepContent = <PrivacyPolicyStep />;
            break;
        default:
            break;
    }

    return stepContent;
}
