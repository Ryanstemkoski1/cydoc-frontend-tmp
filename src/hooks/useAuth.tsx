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
import { CognitoUser } from 'amazon-cognito-identity-js';
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

// TODO: return or manage an error message state?
export interface AuthContextValues {
    user: CognitoUser | null;
    loading: boolean;
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
    const [user, setUser] = useState<CognitoUser | null>(null);
    const [loginCorrect, setLoginCorrect] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const restoreUserSession = async () => {
            try {
                if (!user) {
                    // On component mount
                    // If a session cookie exists
                    // Then use it to reset/restore auth state
                    const user = (await Auth.currentAuthenticatedUser().catch(
                        (err) => {
                            log(`Error restoring session`, err);
                        }
                    )) as CognitoUser;

                    setUser(user);
                    setLoginCorrect(true);
                    setIsSignedIn(true);
                }
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('uncaught Error restoring session:', error);
            }
        };

        restoreUserSession();
    }, [user]);

    const signUp: AuthContextValues['signUp'] = useCallback(
        async (email: string, password: string, phoneNumber: string) => {
            try {
                setLoading(true);
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
                setUser(user);
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
                setLoading(false);
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
                setLoading(true);
                setIsSignedIn(false);
                const cognitoUser = await Auth.signIn(email, password);

                console.log(`User signed in`, {
                    cognitoUser,
                });

                setLoginCorrect(true);
                setUser(cognitoUser);

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
                setLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        []
    );

    const signOut = useMemo(
        () => () =>
            Promise.all([
                Auth.signOut(),
                setLoginCorrect(false),
                setIsSignedIn(false),
                setUser(null),
            ]),
        []
    );

    const verifyMfaCode = useCallback(
        async (code: string) => {
            try {
                setLoading(true);
                const confirmedUser = await Auth.confirmSignIn(
                    user,
                    code,
                    'SMS_MFA'
                );

                console.log(`confirmed user`, confirmedUser);

                setIsSignedIn(!!confirmedUser); // MFA has been completed
                setUser(confirmedUser);
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
                setLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        [history, signOut, user]
    );

    const contextValue: AuthContextValues = useMemo(() => {
        return {
            user,
            loading,
            loginCorrect,
            isSignedIn,
            signIn,
            signUp,
            signOut,
            verifyMfaCode,
        };
    }, [
        user,
        loading,
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
