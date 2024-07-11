import { minDoctorPassword } from 'constants/accountRequirements';

export function passwordRequirements(passwordReqs, value, role) {
    return {
        ...passwordReqs,
        containsNumber: value.match(/\d+/g) ? true : false,
        containsUpper: value.toLowerCase() !== value,
        containsLower: value.toUpperCase() !== value,
        containsSpecial: value.match(
            /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|"+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
        )
            ? true
            : false,
        passesMinLength: value.length >= minDoctorPassword,
    };
}
