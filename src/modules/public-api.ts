import { CreateUserResponse, InviteUserBody } from 'types/api';
import { postToApi } from './api';

export async function inviteUser(body: InviteUserBody) {
    return postToApi<CreateUserResponse>('/user', 'createUser', body, true);
}
