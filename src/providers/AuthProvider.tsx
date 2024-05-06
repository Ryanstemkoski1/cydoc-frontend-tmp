import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import invariant from 'tiny-invariant';

import {
    AmplifyError,
    CODE_MISMATCH,
    CognitoAuth,
    CognitoUser,
    NEW_PASSWORD_REQUIRED,
    NOT_AUTHORIZED,
    NOT_FOUND,
    USER_EXISTS,
} from 'auth/cognito';
import { Auth as AmplifyAuth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { stringFromError } from '../modules/error-utils';
import { breadcrumb, log, updateLoggedUser } from '../modules/logging';
import { formatPhoneNumber } from '../modules/user-api';
import { UserInfoProvider } from './UserInfoProvider';

export interface AuthContextValues {
    cognitoUser: CognitoUser | null;
    authLoading: boolean;
    loginCorrect: boolean; // username/password correct, still need MFA confirmation
    passwordResetRequired: boolean;
    isSignedIn: boolean; // MFA confirmed
    signIn: (
        email: string,
        password: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    signUp: (
        email: string,
        password: string,
        phoneNumber: string
    ) => Promise<{ errorMessage?: string; user?: CognitoUser }>;
    completeFirstLoginUpdate: (
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
export const AuthProvider: React.FC<
    Record<string, unknown> & PropsWithChildren<object>
> = ({ children }) => {
    const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
    const [loginCorrect, setLoginCorrect] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const passwordResetRequired =
        cognitoUser?.challengeName === NEW_PASSWORD_REQUIRED;
    const history = useHistory();

    const [isSignedIn, setIsSignedIn] = useState(false);
    // TODO: parse ^^status^^ from cognitoUser when it changes (see below)
    // Here's an async method: https://github.com/aws-amplify/amplify-js/issues/3640#issuecomment-1198905668
    // const isSignedIn = useMemo(() => !!user?.challengeName?.length, [user]); // This key is not the correct way to determine this

    const signOut = useCallback(
        () => {
            return CognitoAuth.signOut()
                .then(() => {
                    setLoginCorrect(false);
                    setIsSignedIn(false);
                    setCognitoUser(null);
                })
                .catch((reason) =>
                    log(`Sign out error: ${stringFromError(reason)}`, {
                        isSignedIn,
                        cognitoUser,
                        loginCorrect,
                        reason,
                    })
                );
        },
        /* don't need to include dependencies that are just for logging */
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Persist user login status on refresh
    useEffect(() => {
        const restoreUserSession = async () => {
            try {
                if (!cognitoUser) {
                    // On component mount
                    // If a session cookie exists
                    // Then use it to reset/restore auth state
                    setAuthLoading(true);
                    return CognitoAuth.currentAuthenticatedUser()
                        .then((cognitoUser: CognitoUser) => {
                            updateLoggedUser({
                                email: cognitoUser?.attributes?.email,
                            });
                            setCognitoUser(cognitoUser);
                            setLoginCorrect(true);
                            setIsSignedIn(true);
                        })
                        .catch(() => {
                            signOut();
                            breadcrumb(
                                `unable to restore session, user logged out`,
                                'auth'
                            );
                            setAuthLoading(false);
                        })
                        .finally(() => {
                            setAuthLoading(false);
                        });
                }
            } catch (e) {
                setAuthLoading(false);
                const error = e as unknown as AmplifyError;
                log('uncaught Error restoring session:', error);
            }
        };
        restoreUserSession();
    }, [cognitoUser, signOut]);

    const signIn: AuthContextValues['signIn'] = useCallback(
        async (email: string, password: string) => {
            try {
                setAuthLoading(true);
                setIsSignedIn(false);
                const cognitoUser = await CognitoAuth.signIn(email, password);

                // console.log(`User signed in`, {
                //     passwordResetRequired: (cognitoUser.challengeName =
                //         NEW_PASSWORD_REQUIRED),
                //     cognitoUser,
                // });

                setLoginCorrect(true);
                updateLoggedUser({
                    email,
                });
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

    const signUp: AuthContextValues['signUp'] = useCallback(
        async (email: string, password: string, phoneNumber: string) => {
            try {
                setAuthLoading(true);
                const result = await AmplifyAuth.signUp({
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
                const user = result.user as CognitoUser;

                // console.log(`amplify user signed up:`, user);

                // all user into app when first signing up
                updateLoggedUser({
                    email,
                });
                setCognitoUser(user);
                setLoginCorrect(true);

                // user has been created but local cognito session is not valid until we MFA
                // cognito will send an un-usable SMS code on signup, we should ignore
                // request a valid one below with sign-in
                await waitForCode();

                const { user: userWithSession, errorMessage } = await signIn(
                    email,
                    password
                );

                if (errorMessage) {
                    log(`signUp->signIn error: ${errorMessage}`, user);
                }

                return { user: userWithSession };
            } catch (e) {
                const error = e as unknown as AmplifyError;
                log('error signing up:', error);
                if (error?.code === USER_EXISTS) {
                    alert(`Account already exists, please login`);
                    history?.push('/login');
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
        [history, signIn]
    );

    const verifyMfaCode = useCallback(
        async (code: string) => {
            try {
                setAuthLoading(true);
                const confirmedUser = await CognitoAuth.confirmSignIn(
                    cognitoUser,
                    code,
                    'SMS_MFA'
                );

                // console.log(`confirmed user`, confirmedUser);

                setIsSignedIn(!!confirmedUser); // MFA has been completed
                setCognitoUser(confirmedUser);
                history?.push('/');

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

    const completeFirstLoginUpdate: AuthContextValues['completeFirstLoginUpdate'] =
        useCallback(
            async (password: string, phoneNumber: string) => {
                invariant(cognitoUser, 'missing signed in user');

                // completeNewPasswordChallenge
                const updatePasswordResult =
                    (await AmplifyAuth.completeNewPassword(
                        cognitoUser,
                        password,
                        {
                            phone_number: formatPhoneNumber(phoneNumber),
                        }
                    )) as CognitoUser;

                setCognitoUser(updatePasswordResult);
                setLoginCorrect(true);

                // console.log(`password challenge completed`, {
                //     updatePasswordResult,
                // });

                return {
                    user: updatePasswordResult,
                    errorMessage: undefined,
                };
            },
            [cognitoUser]
        );

    const contextValue: AuthContextValues = useMemo(() => {
        return {
            authLoading,
            cognitoUser,
            completeFirstLoginUpdate,
            isSignedIn,
            loginCorrect,
            passwordResetRequired,
            signIn,
            signOut,
            signUp,
            verifyMfaCode,
        };
    }, [
        authLoading,
        cognitoUser,
        completeFirstLoginUpdate,
        isSignedIn,
        loginCorrect,
        passwordResetRequired,
        signIn,
        signOut,
        signUp,
        verifyMfaCode,
    ]);

    return (
        <AuthProviderContext.Provider value={contextValue}>
            <UserInfoProvider>{children}</UserInfoProvider>
        </AuthProviderContext.Provider>
    );
};

export const useAuthInfoContext = () => {
    const ctx = useContext(AuthProviderContext);

    invariant(ctx, 'authInfoContext called outside of UserInfo Context');

    return ctx;
};

const waitForCode = () => new Promise((resolve) => setTimeout(resolve, 2500));
