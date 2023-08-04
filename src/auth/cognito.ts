import { CognitoUser as PartialCognitoUser } from 'amazon-cognito-identity-js';
import { Auth, Amplify } from 'aws-amplify';
import {
    COGNITO_CLIENT_ID,
    COGNITO_POOL_ID,
    REGION,
} from 'modules/environment';
import { stringFromError } from 'modules/error-utils';
import { toast } from 'react-toastify';

Amplify.configure({
    Auth: {
        userPoolRegion: REGION,
        userPoolWebClientId: COGNITO_CLIENT_ID,
        userPoolId: COGNITO_POOL_ID,
    },
});

export const USER_EXISTS = 'UsernameExistsException';
export const NOT_FOUND = 'UserNotFoundException';
export const NOT_AUTHORIZED = 'NotAuthorizedException';
export const CODE_MISMATCH = 'CodeMismatchException';
export const NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED';

// Enable these lines to get more amplify debug info:
// window.LOG_LEVEL = 'DEBUG';
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

export type AmplifyErrorCode =
    | typeof USER_EXISTS
    | typeof NOT_FOUND
    | typeof NOT_AUTHORIZED
    | typeof CODE_MISMATCH
    | 'some other code';

export interface AmplifyError {
    name: AmplifyErrorCode;
    code: AmplifyErrorCode;
}

// Cognito's types don't include "attributes" for some reason...
export interface CognitoUser extends PartialCognitoUser {
    attributes: {
        email: string;
        email_verified: boolean;
        phone_number: string;
        phone_number_verified: boolean;
        sub: string; // cognito user guid
    };
    challengeParam?: { userAttributes?: { email: string } };
}

export const CognitoAuth = Auth;

export const sendResetPasswordCode = async (
    email: string
): Promise<{ success: boolean; obfuscatedEmail?: string }> => {
    return new Promise((resolve) => {
        Auth.forgotPassword(email)
            .then(async (result) => {
                resolve({
                    obfuscatedEmail: result.CodeDeliveryDetails.Destination,
                    success: true,
                });
            })
            .catch((err) => {
                //forgot password not successfull
                alert(err.message || JSON.stringify(err));

                resolve({
                    success: false,
                });
            });
    });
};

export const confirmCode = async (
    email: string,
    code: string,
    password: string
): Promise<{
    success: boolean;
    obfuscatedEmail?: string;
    errorMessage?: string;
}> =>
    new Promise((resolve) =>
        toast
            .promise(
                async () =>
                    Auth.forgotPasswordSubmit(email, code, password)
                        .then(async (result) => {
                            resolve({
                                success: true,
                            });
                        })
                        .catch((err) => {
                            // user authentication was not successful
                            if (
                                err.message.includes(
                                    'Member must satisfy regular expression pattern'
                                )
                            ) {
                                throw new Error(
                                    'Error changing password: Password does not satisfy requirements.'
                                );
                            } else {
                                throw new Error(
                                    `Error changing password: ${
                                        err.message || JSON.stringify(err)
                                    }`
                                );
                            }
                        }),
                {
                    error: 'Error inviting user',
                    pending: `Inviting new user...`,
                    success: 'User invited!',
                }
            )
            // format response so UI knows what error to display
            .catch((e) =>
                resolve({ success: false, errorMessage: stringFromError(e) })
            )
    );
