import { UpdateUserResponse, InviteUserBody } from '@cydoc-ai/types';
import { postToApi } from './api';
import { toast } from 'react-toastify';
import { stringFromError } from './error-utils';
import { CognitoUser } from 'auth/cognito';

export async function inviteUser(
    body: InviteUserBody,
    cognitoUser: CognitoUser | null
): Promise<UpdateUserResponse> {
    return new Promise((resolve) =>
        toast
            .promise(
                async () => {
                    const result = await postToApi<UpdateUserResponse>(
                        '/user',
                        'createUser',
                        body,
                        cognitoUser,
                        true
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
