import {
    CreateUserBody,
    DbUser,
    InviteUserBody,
    UpdateUserBody,
    UpdateUserResponse,
} from '@cydoc-ai/types';
import { getFromApi, postToApi } from './api';
import invariant from 'tiny-invariant';
import { log } from './logging';
import { ClinicianSignUpData } from 'types/signUp';
import { CognitoUser } from 'auth/cognito';
import { toast } from 'react-toastify';
import { stringFromError } from './error-utils';

export const formatPhoneNumber = (phoneNumber: string): string =>
    phoneNumber
        .replace('(', '+1')
        .replace(/-|\(|\)/gi, '')
        .replace(' ', '');

export async function createManagerAndInstitution(
    {
        email,
        firstName,
        institutionName,
        lastName,
        phoneNumber,
        role,
    }: ClinicianSignUpData,
    cognitoUser: CognitoUser | null
) {
    const body: CreateUserBody = {
        email,
        firstName,
        institutionName,
        lastName,
        phoneNumber: formatPhoneNumber(phoneNumber),
        role,
        isInvite: false,
    };

    return postToApi<UpdateUserResponse>(
        '/user/create',
        'createManagerAndInstitution',
        body,
        cognitoUser
    );
}

export async function updateDbUser(
    body: UpdateUserBody,
    cognitoUser: CognitoUser | null
) {
    body.phoneNumber = formatPhoneNumber(body.phoneNumber);

    return postToApi<UpdateUserResponse>(
        `/user/${body.email}`,
        'updateDbUser',
        body,
        cognitoUser
    );
}

export async function inviteClinician(
    body: InviteUserBody,
    cognitoUser: CognitoUser | null
): Promise<UpdateUserResponse> {
    const institutionId = body.institutionId || 'invalid-institution';
    return new Promise((resolve) =>
        toast
            .promise(
                async () => {
                    const result = await postToApi<UpdateUserResponse>(
                        `/institution/${institutionId}/user/invite`,
                        'inviteClinician',
                        body,
                        cognitoUser
                    );
                    if (result?.errorMessage) {
                        throw new Error(result.errorMessage);
                    } else {
                        return resolve(result);
                    }
                },
                {
                    error: 'Error inviting user',
                    pending: `Inviting new user...`,
                    success: 'User invited!',
                }
            )
            // format response so UI knows what error to display
            .catch((e) => resolve({ errorMessage: stringFromError(e) }))
    );
}

export const getDbUser = async (cognitoUser: CognitoUser): Promise<DbUser> => {
    const email =
        cognitoUser?.attributes?.email ||
        cognitoUser?.challengeParam?.userAttributes?.email ||
        cognitoUser?.username ||
        '';
    invariant(email, 'missing email');

    const response = await getFromApi<UpdateUserResponse>(
        `/user/${email}`,
        'getDbUser',
        cognitoUser
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

export const removeUser = async (
    user: DbUser,
    cognitoUser: CognitoUser | null
) => {
    invariant(user, '[removeUser] missing id');

    log(`User deletion requested`, user);

    if (user.role === 'manager') {
        alert(
            `Deleting this manager account will result in cancellation of your clinic's subscription to Cydoc. To cancel your subscription please email rachel.draelos@cydoc.ai`
        );
    } else
        alert(
            `Deleting this account is not yet implemented. We're working on this feature and it should be added in the coming weeks. To proceed with removal, please email rachel.draelos@cydoc.ai`
        );
};
