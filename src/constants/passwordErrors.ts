import { SignUpFormData } from 'pages/Account/SignUpForm';
import { minDoctorPassword } from './accountRequirements';

export interface PasswordErrorInfos {
    containsNumber: boolean;
    containsUpper: boolean;
    containsLower: boolean;
    containsSpecial: boolean;
    passesMinLength: boolean;
}
export type PasswordErrorTypes = keyof PasswordErrorInfos;

export const passwordErrors = (
    role: SignUpFormData['role'] | 'healthcare manager'
) => {
    return {
        containsNumber: 'Must contain at least one number.',
        containsUpper: 'Must contain at least one uppercase character.',
        containsLower: 'Must contain at least one lowercase character.',
        containsSpecial:
            'Must contain at least one of the following special characters: = + - ^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ `',
        passesMinLength: `Must be at least ${
            role === 'manager' || role === 'healthcare manager'
                ? '25'
                : minDoctorPassword
        } characters.`,
    };
};

export const passwordIsValid = (password: string) =>
    !havePasswordError(getPasswordErrors(password));

export const havePasswordError = (info: PasswordErrorInfos) =>
    Object.keys(info)
        .map((key) => !!info[key as PasswordErrorTypes])
        .some((v) => !v);

export const getPasswordErrors = (toCheck: string) => ({
    containsNumber: toCheck.match(/\d+/g) ? true : false,
    containsUpper: toCheck.toLowerCase() !== toCheck,
    containsLower: toCheck.toUpperCase() !== toCheck,
    containsSpecial: toCheck.match(
        /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|'+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
    )
        ? true
        : false,
    passesMinLength: toCheck.length >= minDoctorPassword,
});
