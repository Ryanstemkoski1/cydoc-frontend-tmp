import { useFormikContext } from 'formik';
import { log } from 'modules/logging';
import { useCallback, useMemo } from 'react';
import { SignUpFormData } from './SignUpForm';
import {
    INSTITUTION_STEP,
    PAYMENT_STEP,
    PRIVACY_STEP,
    TERMS_STEP,
    USER_INFO_STEP,
} from './SignUpSteps';

const userInfoFields: (keyof SignUpFormData)[] = [
    'email',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'newPassword',
    'confirmNewPassword',
    'confirmEmail',
    'confirmPhoneNumber',
];
const paymentFields: (keyof SignUpFormData)[] = ['paymentMethod'];
const termsFields: (keyof SignUpFormData)[] = ['isTermsChecked'];
const privacyPolicyFields: (keyof SignUpFormData)[] = ['isPrivacyChecked'];
const institutionFields: (keyof SignUpFormData)[] = ['institutionName'];

export default function useEnableNext(step: number) {
    const { errors, touched } = useFormikContext<SignUpFormData>();

    const noErrorsForStep = useCallback(
        (fields: (keyof SignUpFormData)[]) =>
            !fields.some((f) => Object.keys(errors).includes(f)),
        [errors]
    );
    const someFieldTouched = useCallback(
        (fields: (keyof SignUpFormData)[]) => fields.some((f) => touched[f]),
        [touched]
    );

    // console.log(
    //     `enabling next 0, touched: ${someFieldTouched(
    //         step0Fields
    //     )} no errors: ${noErrorsForStep(step0Fields)}`,
    //     { touched, errors }
    // );

    return useMemo(() => {
        switch (step) {
            case USER_INFO_STEP:
                return (
                    someFieldTouched(userInfoFields) &&
                    noErrorsForStep(userInfoFields)
                );
            case INSTITUTION_STEP:
                return (
                    someFieldTouched(institutionFields) &&
                    noErrorsForStep(institutionFields)
                );
            case PAYMENT_STEP:
                return (
                    someFieldTouched(paymentFields) &&
                    noErrorsForStep(paymentFields)
                );
            case TERMS_STEP:
                return (
                    someFieldTouched(termsFields) &&
                    noErrorsForStep(termsFields)
                );
            case PRIVACY_STEP:
                return (
                    someFieldTouched(privacyPolicyFields) &&
                    noErrorsForStep(privacyPolicyFields)
                );
            default:
                log(`useEnableNext unrecognized step: ${step}`);
                return true;
        }
    }, [noErrorsForStep, someFieldTouched, step]);
}
