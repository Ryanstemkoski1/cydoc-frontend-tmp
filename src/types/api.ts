import { ClinicianSignUpData } from './users';

export interface UpdateUserResponse {
    success: true;
    error?: string;
}

export interface UpdateUserBody
    extends Pick<
        ClinicianSignUpData,
        | 'email'
        | 'institutionName'
        | 'firstName'
        | 'lastName'
        | 'phoneNumber'
        | 'role'
    > {
    password: string;
}

export type ApiPostBody = UpdateUserBody;
