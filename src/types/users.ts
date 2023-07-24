export type ApiEditUserBase = Pick<
    DbUser,
    'phoneNumber' | 'email' | 'firstName' | 'lastName'
>;

export interface ApiEditManager extends ApiEditUserBase {
    associatedDoctors: Manager['associatedDoctors'];
    joinedDoctors: Manager['joinedDoctors'];
}

export interface DbUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    institutionId?: number;
    role: 'manager' | 'clinician';
}

export interface Manager extends DbUser {
    associatedDoctors: string[];
    joinedDoctors: string[];
}
export interface Doctor extends DbUser {
    joinedManager: string;
}

export interface ClinicianSignUpData
    extends Pick<
        DbUser,
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'phoneNumber'
        | 'institutionId'
        | 'role'
    > {
    newPassword: string;
    confirmNewPassword: string;
    confirmEmail: string;
    confirmPhoneNumber: string;
    institutionName: string;
    signUpError?: string;
}

export interface UserAttributes {
    email: string;
    phone_number: string;
}
