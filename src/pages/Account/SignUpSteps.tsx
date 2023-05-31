import React from 'react';
import { UserInfoStep } from './UserInfoStep';
import { PrivacyPolicyStep } from './PrivacyPolicyStep';
import { AddPaymentStep } from './AddPaymentStep';
import { TermsStep } from './TermsStep';
import { InstitutionPickerStep } from './InstitutionPickerStep';

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
            stepContent = <UserInfoStep />;
            break;
        case 1:
            stepContent = <InstitutionPickerStep />;
            break;
        case 2:
            stepContent = <AddPaymentStep />;
            break;
        case 3:
            stepContent = <TermsStep />;
            break;
        case 4:
            stepContent = <PrivacyPolicyStep />;
            break;
        default:
            break;
    }

    return stepContent;
}
