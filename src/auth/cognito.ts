import { CognitoUser as PartialCognitoUser } from 'amazon-cognito-identity-js';
import { Auth, Amplify } from 'aws-amplify';
import {
    COGNITO_CLIENT_ID,
    COGNITO_POOL_ID,
    REGION,
} from 'modules/environment';

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
}

export const CognitoAuth = Auth;
