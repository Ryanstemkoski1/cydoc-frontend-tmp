import { useFormikContext } from 'formik';
import { log } from 'modules/logging';
import { useCallback, useMemo } from 'react';
import { SignUpFormData } from './SignUpForm';

export default function useEnableNext(step: number) {
    const { isValid, dirty, errors, touched } =
        useFormikContext<SignUpFormData>();

    const userInfoFields: (keyof SignUpFormData)[] = useMemo(
        () => [
            'username',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'newPassword',
            'confirmNewPassword',
            'confirmEmail',
            'confirmPhoneNumber',
        ],
        []
    );
    const termsFields: (keyof SignUpFormData)[] = useMemo(
        () => ['isTermsChecked'],
        []
    );

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
            case 0: // UserInfoStep
                return (
                    someFieldTouched(userInfoFields) &&
                    noErrorsForStep(userInfoFields)
                );
            case 1: // InstitutionPickerStep
                return (
                    someFieldTouched(termsFields) &&
                    noErrorsForStep(termsFields)
                );
            case 2: // AddPaymentStep
                return (
                    someFieldTouched(termsFields) &&
                    noErrorsForStep(termsFields)
                );
            case 3: // TermsStep
                return (
                    someFieldTouched(termsFields) &&
                    noErrorsForStep(termsFields)
                );
            case 4: // PrivacyPolicyStep
                return isValid && dirty;
            default:
                log(`useEnableNext unrecognized step: ${step}`);
                return true;
        }
    }, [
        dirty,
        isValid,
        noErrorsForStep,
        someFieldTouched,
        step,
        userInfoFields,
    ]);
}
