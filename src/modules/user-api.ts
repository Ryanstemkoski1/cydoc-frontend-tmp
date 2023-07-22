import { ClinicianSignUpData, DbUser } from 'types/users';
import { ApiResponse, CreateUserResponse, UpdateUserBody } from 'types/api';
import { getFromApi, postToApi } from './api';
import invariant from 'tiny-invariant';

export async function createDbUser({
    email,
    firstName,
    institutionName,
    lastName,
    newPassword,
    phoneNumber,
    role,
}: ClinicianSignUpData) {
    const body: UpdateUserBody = {
        email,
        firstName,
        institutionName,
        lastName,
        password: newPassword,
        phoneNumber,
        role,
    };

    return postToApi<CreateUserResponse>('/user', 'createUser', body);
}

export const getDbUser = (email: string): Promise<DbUser | ApiResponse> => {
    invariant(email, 'missing email');

    return getFromApi<DbUser>(`/user/${email}`, 'getDbUser');
};
