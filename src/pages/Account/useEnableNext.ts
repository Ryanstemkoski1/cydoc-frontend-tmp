import { useFormikContext } from 'formik';
import { log } from 'modules/logging';
import { useMemo } from 'react';
import { ClinicianSignUpData } from 'types/users';

export default function useEnableNext(step: number) {
    const { isValid, dirty, errors, touched } =
        useFormikContext<ClinicianSignUpData>();

    const step0Fields: (keyof ClinicianSignUpData)[] = [
        'username',
        'firstName',
        'middleName',
        'lastName',
        'email',
        'phoneNumber',
        'newPassword',
        'confirmNewPassword',
        'confirmEmail',
        'confirmPhoneNumber',
    ];
    const noErrorsForStep = (fields: (keyof ClinicianSignUpData)[]) =>
        !fields.some((f) => Object.keys(errors).includes(f));

    const someFieldTouched = (fields: (keyof ClinicianSignUpData)[]) =>
        fields.some((f) => touched[f]);

    // console.log(
    //     `enabling next 0, touched: ${someFieldTouched(
    //         step0Fields
    //     )} no errors: ${noErrorsForStep(step0Fields)}`,
    //     { touched, errors }
    // );

    return useMemo(() => {
        switch (step) {
            case 0:
                return (
                    someFieldTouched(step0Fields) &&
                    noErrorsForStep(step0Fields)
                );

            case 1:
                return isValid && dirty;
            case 2:
                return isValid && dirty;

            case 3:
                return isValid && dirty;

            case 4:
                return isValid && dirty;
            default:
                log(`useEnableNext unrecognized step: ${step}`);
                return true;
        }
    }, [dirty, isValid, step]);
}
