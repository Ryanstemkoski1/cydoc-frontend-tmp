import { DbUser } from '@cydoc-ai/types';

export interface ClinicianSignUpData
    extends Pick<
        DbUser,
        'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'role'
    > {
    newPassword: string;
    confirmNewPassword: string;
    confirmEmail: string;
    confirmPhoneNumber: string;
    institutionName: string;
    signUpError?: string;
}
