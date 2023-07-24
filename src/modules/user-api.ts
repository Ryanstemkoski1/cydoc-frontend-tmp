import { ClinicianSignUpData, DbUser } from 'types/users';
import { CreateUserResponse, UpdateUserBody } from 'types/api';
import { getFromApi, postToApi } from './api';
import invariant from 'tiny-invariant';
import { log } from './logging';

export async function createDbUser({
    email,
    firstName,
    institutionName,
    lastName,
    phoneNumber,
    role,
}: ClinicianSignUpData) {
    const body: UpdateUserBody = {
        email,
        firstName,
        institutionName,
        lastName,
        phoneNumber,
        role,
    };

    return postToApi<CreateUserResponse>('/user', 'createUser', body);
}

export const getDbUser = async (email: string): Promise<DbUser> => {
    invariant(email, 'missing email');

    const response = await getFromApi<CreateUserResponse>(
        `/user/${email}`,
        'getDbUser'
    );

    if (response?.errorMessage) {
        const { errorMessage } = response;
        log(`User not found: ${email}`, { email, errorMessage });
        throw new Error(errorMessage);
    } else if ((response as CreateUserResponse)?.user) {
        return (response as CreateUserResponse)?.user as DbUser;
    } else {
        throw new Error(`unrecognized API response`);
    }
};

export const removeUser = async (id: number) => {
    invariant(id, '[removeUser] missing id');
    alert(`removing: user ${id} [NOT IMPLEMENTED]`);
};
