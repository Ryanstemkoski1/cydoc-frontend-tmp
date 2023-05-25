import { useFormikContext } from 'formik';
import { log } from 'modules/logging';
import { useMemo } from 'react';
import { ClinicianSignUpData } from 'types/users';

export default function useEnableNext(step: number) {
    const { values, isValid, dirty } = useFormikContext<ClinicianSignUpData>();
    const { confirmNewPassword } = values;

    return useMemo(() => {
        switch (step) {
            case 0:
                return isValid && dirty;

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
