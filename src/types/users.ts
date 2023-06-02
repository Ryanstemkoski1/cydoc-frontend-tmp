export type ApiEditUserBase = Pick<
    DynamoDbUser,
    'username' | 'phoneNumber' | 'email' | 'firstName' | 'lastName'
>;

export interface ApiEditManager extends ApiEditUserBase {
    associatedDoctors: Manager['associatedDoctors'];
    joinedDoctors: Manager['joinedDoctors'];
}

export interface DynamoDbUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    institutionId?: string;
    role: 'manager' | 'clinician';
    'custom:UUID'?: string;
    'custom:associatedManager'?: string;
}

export interface Manager extends DynamoDbUser {
    associatedDoctors: string[];
    joinedDoctors: string[];
}
export interface Doctor extends DynamoDbUser {
    joinedManager: string;
}

export interface ClinicianSignUpData extends DynamoDbUser {
    newPassword: string;
    confirmNewPassword: string;
    confirmEmail: string;
    confirmPhoneNumber: string;
    institutionName: string;
}

export interface UserAttributes {
    'custom:UUID'?: string;
    'custom:associatedManager': string;
    email: string;
    given_name: string;
    // middle_name: string;
    family_name: string;
    phone_number: string;
}
