import { ClinicianSignUpData, DbUser } from './users';

export interface UpdateUserResponse {
    success: true;
    error?: string;
}

export interface CreateUserResponse extends ApiResponseBase {
    user?: DbUser;
}
export interface GetMembersResponse extends ApiResponseBase {
    members?: DbUser[];
}
export type InviteUserBody = Pick<
    DbUser,
    'email' | 'lastName' | 'role' | 'firstName' | 'institutionId'
>;

export type CreateUserBody = Pick<
    ClinicianSignUpData,
    | 'email'
    | 'institutionName'
    | 'firstName'
    | 'lastName'
    | 'phoneNumber'
    | 'role'
>;

export type UpdateUserBody = Pick<
    ClinicianSignUpData,
    'email' | 'firstName' | 'lastName' | 'phoneNumber'
>;

// Generic errored ApiResponseBase includes errorMessage
export interface ApiResponseBase {
    errorMessage?: string | undefined;
}

export type ApiPostBody = UpdateUserBody | InviteUserBody;
export type ApiResponse =
    | CreateUserResponse
    | GetMembersResponse
    | ApiResponseBase;
