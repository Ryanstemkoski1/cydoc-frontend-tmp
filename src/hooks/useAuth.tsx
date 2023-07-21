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
import { COGNITO_CLIENT_ID, COGNITO_POOL_ID } from 'modules/environment';
import { log } from 'modules/logging';
import { CognitoUser } from 'amazon-cognito-identity-js';

export const InitAmplify = () =>
    Amplify.configure({
        Auth: {
            userPoolWebClientId: COGNITO_CLIENT_ID,
            userPoolId: COGNITO_POOL_ID,
        },
    });

const USER_EXISTS = 'UsernameExistsException';
type AmplifyErrorCode = typeof USER_EXISTS | 'some other code';
interface AmplifyError {
    name: 'UsernameExistsException';
    code: AmplifyErrorCode;
}

// TODO: return or manage an error message state?
export interface AuthContextValues {
    user: CognitoUser | null;
    loading: boolean;
    isSignedIn: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    signUp: (
        email: string,
        password: string,
        navtoLogin: () => void
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
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    // TODO: parse use info to determine if we need to gather more info

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
                }
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('uncaught Error restoring session:', error);
            }
        };

        restoreUserSession();
    }, [user]);

    const signUp: AuthContextValues['signUp'] = useCallback(
        async (email: string, password: string, navtoLogin: () => void) => {
            try {
                setLoading(true);
                const { user } = await Auth.signUp({
                    username: email,
                    password,
                    attributes: {
                        email, // optional
                        // phoneNumber, // optional - E.164 number convention
                        // other custom attributes
                    },
                    autoSignIn: {
                        // optional - enables auto sign in after user is confirmed
                        enabled: true,
                    },
                });

                console.log(`amplify user signed up:`, user);

                return { user };
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('error signing up:', error);
                if (error?.code === USER_EXISTS) {
                    alert(`Account already exists, please login`);
                    navtoLogin();
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
        []
    );
    const signIn: AuthContextValues['signIn'] = useCallback(
        async (email: string, password: string) => {
            try {
                setLoading(true);

                return Auth.signIn(email, password).then(
                    (cognitoUser: CognitoUser) => {
                        // Set user data and access token to memory
                        // const {
                        //     attributes,
                        //     signInUserSession: { accessToken },
                        // } = cognitoUser;

                        console.log(`cognito user type check`, {
                            // attributes,
                            // accessToken,
                            cognitoUser,
                        });

                        // const user = {
                        //     email: attributes.email,
                        //     username: attributes.preferred_username,
                        //     userId: attributes.sub,
                        //     accessToken: accessToken.jwtToken,
                        // };

                        setIsSignedIn(true);
                        setUser(user);

                        // TODO: parse first login from response
                        // setIsFirstLogin(loginResponse.isFirstLoginFlag);

                        return { user: cognitoUser };
                    }
                );
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('error signing up:', error);
            } finally {
                setLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        [user]
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

                setIsSignedIn(!!confirmedUser);

                return { user: confirmedUser, errorMessage: undefined };
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('error signing up:', error);
            } finally {
                setLoading(false);
            }
            return {
                errorMessage:
                    'Unknown error occurred, refresh, check your network & login',
            };
        },
        [user]
    );

    const signOut = useCallback(
        () => () =>
            Auth.signOut().then(() => {
                setIsSignedIn(false);
                setUser(null);
            }),
        []
    );

    const contextValue: AuthContextValues = useMemo(() => {
        return {
            user,
            loading,
            isSignedIn,
            signIn,
            signUp,
            signOut,
            verifyMfaCode,
        };
    }, [user, loading, isSignedIn, signIn, signUp, signOut, verifyMfaCode]);

    return (
        <AuthProviderContext.Provider value={contextValue}>
            {children}
        </AuthProviderContext.Provider>
    );
};
