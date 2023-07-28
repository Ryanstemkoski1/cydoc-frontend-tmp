import { CreateUserResponse, InviteUserBody } from 'types/api';
import { postToApi } from './api';
import { toast } from 'react-toastify';
import { stringFromError } from './error-utils';

export async function inviteUser(body: InviteUserBody) {
    return new Promise((resolve) =>
        toast
            .promise(
                async () => {
                    const result = await postToApi<CreateUserResponse>(
                        '/user',
                        'createUser',
                        body,
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
