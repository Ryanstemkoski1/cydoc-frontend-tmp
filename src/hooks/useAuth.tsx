import React, {
    useState,
    useEffect,
    useContext,
    createContext,
    useMemo,
    useCallback,
    PropsWithChildren,
} from 'react';
import { Auth, Amplify } from 'aws-amplify';
import invariant from 'tiny-invariant';
import {
    COGNITO_CLIENT_ID,
    COGNITO_POOL_ID,
    REGION,
} from 'modules/environment';
import { log } from 'modules/logging';
import { CognitoUser as PartialCognitoUser } from 'amazon-cognito-identity-js';
import { useHistory } from 'react-router-dom';

// Enable these lines to get more amplify debug info:
// window.LOG_LEVEL = 'DEBUG';
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

Amplify.configure({
    Auth: {
        userPoolRegion: REGION,
        userPoolWebClientId: COGNITO_CLIENT_ID,
        userPoolId: COGNITO_POOL_ID,
    },
});

const USER_EXISTS = 'UsernameExistsException';
const NOT_FOUND = 'UserNotFoundException';
const NOT_AUTHORIZED = 'NotAuthorizedException';
const CODE_MISMATCH = 'CodeMismatchException';

type AmplifyErrorCode =
    | typeof USER_EXISTS
    | typeof NOT_FOUND
    | typeof NOT_AUTHORIZED
    | typeof CODE_MISMATCH
    | 'some other code';

interface AmplifyError {
    name: AmplifyErrorCode;
    code: AmplifyErrorCode;
}

// Cognito's types don't include "attributes" for some reason...
interface CognitoUser extends PartialCognitoUser {
    attributes: {
        email: string;
        email_verified: boolean;
        phone_number: string;
        phone_number_verified: boolean;
        sub: string; // cognito user guid
    };
}
export interface AuthContextValues {
    cognitoUser: CognitoUser | null;
    authLoading: boolean;
    loginCorrect: boolean;
    isSignedIn: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    signUp: (
        email: string,
        password: string,
        phoneNumber: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    verifyMfaCode: (
        code: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    signOut: () => void;
}

export const AuthProviderContext = createContext<AuthContextValues | null>(
    null
);

// Access auth context values and functions
export const useAuth = () => {
    const ctx = useContext(AuthProviderContext);

    invariant(
        ctx,
        'useBrandInfoContext called outside of BrandInfoProvider Context'
    );
    return ctx;
};

export const AuthProvider: React.FC<
    Record<string, unknown> & PropsWithChildren<object>
> = ({ children }) => {
    const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
    const [loginCorrect, setLoginCorrect] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const history = useHistory();

    const [isSignedIn, setIsSignedIn] = useState(false);

    const signOut = useMemo(
        () => () =>
            Promise.all([
                Auth.signOut(),
                setLoginCorrect(false),
                setIsSignedIn(false),
                setCognitoUser(null),
            ]),
        []
    );

    useEffect(() => {
        const restoreUserSession = async () => {
            try {
                if (!cognitoUser) {
                    // On component mount
                    // If a session cookie exists
                    // Then use it to reset/restore auth state
                    return Auth.currentAuthenticatedUser()
                        .then((cognitoUser) => {
                            setCognitoUser(cognitoUser);
                            setLoginCorrect(true);
                            setIsSignedIn(true);
                        })
                        .catch((err) => {
                            signOut();
                            log(`Error restoring session`, err);
                        });
                }
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('uncaught Error restoring session:', error);
            } finally {
                setAuthLoading(false);
            }
        };

        restoreUserSession();
    }, [cognitoUser, signOut]);

    const signUp: AuthContextValues['signUp'] = useCallback(
        async (email: string, password: string, phoneNumber: string) => {
            try {
                setAuthLoading(true);
                const { user } = await Auth.signUp({
                    username: email,
                    password,
                    attributes: {
                        email, // optional
                        phone_number: phoneNumber, // optional - E.164 number convention
                        // other custom attributes
                    },
                    autoSignIn: {
                        // optional - enables auto sign in after user is confirmed
                        enabled: true,
                    },
                });

                console.log(`amplify user signed up:`, user);

                // all user into app when first signing up
                setCognitoUser(user as CognitoUser);
                setLoginCorrect(true);
                setIsSignedIn(true);

                return { user };
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('error signing up:', error);
                if (error?.code === USER_EXISTS) {
                    alert(`Account already exists, please login`);
                    history.push('/login');
                    return {
                        errorMessage: `Account already exists, please login`,
                    };
                }
            } finally {
                setAuthLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        [history]
    );
    const signIn: AuthContextValues['signIn'] = useCallback(
        async (email: string, password: string) => {
            try {
                setAuthLoading(true);
                setIsSignedIn(false);
                const cognitoUser = await Auth.signIn(email, password);

                console.log(`User signed in`, {
                    cognitoUser,
                });

                setLoginCorrect(true);
                setCognitoUser(cognitoUser);

                // TODO: parse first login from response
                // setIsFirstLogin(loginResponse.isFirstLoginFlag);

                return { user: cognitoUser };
            } catch (e) {
                const error = e as unknown as AmplifyError;

                if (error.code === NOT_FOUND) {
                    return {
                        errorMessage:
                            'User not found. Have you signed up or been invited yet?',
                    };
                } else if (error.code === NOT_AUTHORIZED) {
                    return {
                        errorMessage: 'Incorrect username or password',
                    };
                } else {
                    log(`SignIn: ${error?.code || 'unknown err'}`, error);
                }
            } finally {
                setAuthLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        []
    );

    const verifyMfaCode = useCallback(
        async (code: string) => {
            try {
                setAuthLoading(true);
                const confirmedUser = await Auth.confirmSignIn(
                    cognitoUser,
                    code,
                    'SMS_MFA'
                );

                console.log(`confirmed user`, confirmedUser);

                setIsSignedIn(!!confirmedUser); // MFA has been completed
                setCognitoUser(confirmedUser);
                history.push('/');

                return { user: confirmedUser, errorMessage: undefined };
            } catch (e) {
                const error = e as unknown as AmplifyError;

                if (error.code === CODE_MISMATCH) {
                    return { errorMessage: 'Incorrect code.' };
                } else if (error.code === NOT_AUTHORIZED) {
                    alert(
                        'Login session expired, check your network and try logging in again.'
                    );

                    signOut();
                    return {
                        errorMessage: 'Session expired, try logging in again',
                    };
                }
                log('[verifyMfaCode] error', error);
            } finally {
                setAuthLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        [history, signOut, cognitoUser]
    );

    const contextValue: AuthContextValues = useMemo(() => {
        return {
            cognitoUser,
            authLoading,
            loginCorrect,
            isSignedIn,
            signIn,
            signUp,
            signOut,
            verifyMfaCode,
        };
    }, [
        cognitoUser,
        authLoading,
        loginCorrect,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        verifyMfaCode,
    ]);

    return (
        <AuthProviderContext.Provider value={contextValue}>
            {children}
        </AuthProviderContext.Provider>
    );
};
