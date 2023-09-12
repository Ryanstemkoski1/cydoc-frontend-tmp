import { breadcrumb, log } from './logging';
import { ApiPostBody, ApiResponse, ApiResponseBase } from '@cydoc-ai/types';
import { API_URL, PUBLIC_API_URL } from './environment';
import { stringFromError } from './error-utils';
import { CognitoUser } from 'auth/cognito';

const JSON_POST_HEADER: RequestInit = {
    method: 'POST',
    headers: {
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
export async function postToApi<T>(
    path: string,
    description: string,
    body: ApiPostBody | null,
    cognitoUser: CognitoUser | null,
    publicEndpoint = false
): Promise<T | ApiResponse> {
    const idToken = cognitoUser?.signInUserSession?.getIdToken();
    console.log(`user`, cognitoUser);

    const url = `${publicEndpoint ? PUBLIC_API_URL : API_URL}${path}`;
    let response;
    breadcrumb(`posting: ${JSON.stringify(path)}`, 'API', { url, path, body });

    try {
        response = await fetch(url, {
            ...JSON_POST_HEADER,
            body: JSON.stringify({
                ...(body || {}),
                idToken,
            }),
        });

        const handledResponse = await handleResponse<T>(response);

        breadcrumb(
            `PostToApi${response.status} ${description} Response`,
            'API',
            {
                handledResponse,
                responseStatus: response.status,
                responseOk: response.ok,
                responseStatusText: response.statusText,
            }
        );

        return handledResponse;
    } catch (e) {
        log(`[postToApi] ${description}: ${stringFromError(e)}`, {
            path,
            description,
            body,
            response,
        });

        return {
            errorMessage:
                'Unexpected error occurred, check your internet connection',
        };
    }
}

async function handleResponse<T>(
    response: Response
): Promise<T | ApiResponseBase> {
    const { url, bodyUsed, status, statusText } = response;
    const path = url.slice(API_URL.length) || url;

    if (response?.status === 401) {
        breadcrumb(`Unauthorized 401 ${path}`, 'api', {
            url,
            bodyUsed,
            status,
            statusText,
        });
        return Promise.reject('Invalid token');
    }

    // Request failed due to failed precondition, return error message to UI
    if (response?.status === 412) {
        let body;
        try {
            body = (await response.json()) as unknown as {
                errorMessage: string;
            };
        } catch (e) {
            breadcrumb(`failed to parse json 412 body ${path}`, 'api');
        }

        breadcrumb(`Failed Precondition 412 ${path}`, 'api', {
            path,
            bodyUsed,
            status,
            statusText,
            url,
            body,
        });

        if (body?.errorMessage) {
            return body;
        } else {
            log(`Precondition info missing in response: ${path}`, {
                body,
            });
            // Returning or erroring is handled below
        }
    }

    if (!response?.ok) {
        breadcrumb('bad response!', 'general', { response });
        return Promise.reject('Bad response from api');
    }

    return response.json() as Promise<T>;
}
