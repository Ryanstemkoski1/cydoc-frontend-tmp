import { CreateUserResponse, InviteUserBody } from 'types/api';
import { postToApi } from './api';
import { toast } from 'react-toastify';

export async function inviteUser(body: InviteUserBody) {
    return toast.promise(
        async () => {
            return postToApi<CreateUserResponse>(
                '/user',
                'createUser',
                body,
                true
            );
        },
        {
            error: 'Error inviting user',
            pending: `Inviting new user...`,
            success: 'User invited!',
        }
    );
}
