import { ClinicianSignUpData } from 'types/users';
import { breadcrumb } from './logging';
import { ApiPostBody, UpdateUserBody, UpdateUserResponse } from 'types/api';

export async function createUser({
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
    const res = await postToApi<UpdateUserResponse>(
        '/user',
        'createUser',
        body
    );

    return res;
}

const JSON_POST_HEADER: RequestInit = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    mode: 'cors',
};

/**
 * sends data to API
 * @param path url to POST to
 * @param description note for logging & debugging
 * @param body data to send to API
 * @param T generic type of return object
 * @returns instance of "T" generic object on success
 */
async function postToApi<T>(
    path: string,
    description: string,
    body: ApiPostBody
): Promise<T> {
    // TODO: if users is logged in, pull in authentication token

    const url = `${API_URL}${path}`;
    breadcrumb(`posting: ${JSON.stringify(path)}`, 'API', { url, path, body });

    const response = await fetch(url, {
        ...JSON_POST_HEADER,
        body: JSON.stringify({
            // idToken, // TODO: insert token so API can auth the user
            ...body,
        }),
    });

    breadcrumb(`PostToApi ${response.status} ${description} Response`, 'API', {
        responseStatus: response.status,
        responseOk: response.ok,
        responseStatusText: response.statusText,
    });

    return handleResponse<T>(response);
}

async function handleResponse<T>(response: Response): Promise<T> {
    const { url, bodyUsed, status, statusText } = response;
    if (response?.status === 401) {
        breadcrumb(`Unauthorized 401 ${response.url}`, 'api', {
            url,
            bodyUsed,
            status,
            statusText,
        });
        return Promise.reject('Invalid token');
    }

    if (!response?.ok) {
        breadcrumb('bad response!', 'general', { response });
        return Promise.reject('Bad response from api');
    }

    return response.json() as unknown as T;
}
