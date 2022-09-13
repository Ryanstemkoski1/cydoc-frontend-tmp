import { minDoctorPassword } from './accountRequirements';
export const passwordErrors = (role) => {
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
