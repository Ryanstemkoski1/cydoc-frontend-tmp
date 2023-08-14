import {
    CreateUserBody,
    DbUser,
    UpdateUserBody,
    UpdateUserResponse,
} from '@cydoc-ai/types';
import { getFromApi, postToApi } from './api';
import invariant from 'tiny-invariant';
import { log } from './logging';
import { ClinicianSignUpData } from 'types/signUp';

export const formatPhoneNumber = (phoneNumber: string): string =>
    phoneNumber
        .replace('(', '+1')
        .replace(/-|\(|\)/gi, '')
        .replace(' ', '');

export async function createDbUser({
    email,
    firstName,
    institutionName,
    lastName,
    phoneNumber,
    role,
}: ClinicianSignUpData) {
    const body: CreateUserBody = {
        email,
        firstName,
        institutionName,
        lastName,
        phoneNumber: formatPhoneNumber(phoneNumber),
        role,
        isInvite: false,
    };

    return postToApi<UpdateUserResponse>('/user', 'createUser', body);
}
export async function updateDbUser(body: UpdateUserBody) {
    body.phoneNumber = formatPhoneNumber(body.phoneNumber);

    return postToApi<UpdateUserResponse>(
        `/user/${body.email}`,
        'createUser',
        body
    );
}

export const getDbUser = async (email: string): Promise<DbUser> => {
    invariant(email, 'missing email');

    const response = await getFromApi<UpdateUserResponse>(
        `/user/${email}`,
        'getDbUser'
    );

    if (response?.errorMessage) {
        const { errorMessage } = response;
        log(`User not found: ${email}`, { email, errorMessage });
        throw new Error(errorMessage);
    } else if ((response as UpdateUserResponse)?.user) {
        return (response as UpdateUserResponse)?.user as DbUser;
    } else {
        throw new Error(`unrecognized API response`);
    }
};

export const removeUser = async (id: number) => {
    invariant(id, '[removeUser] missing id');
    alert(`removing: user ${id} [NOT IMPLEMENTED]`);
};
