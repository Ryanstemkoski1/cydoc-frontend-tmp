/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { CognitoAuth, CognitoUser, NEW_PASSWORD_REQUIRED } from 'auth/cognito';
import { stringFromError } from '@modules/error-utils';
import { log } from '@modules/logging';
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
        setAuthLoading(false);
    }, []);

    const signIn: AuthContextValues['signIn'] = useCallback(
        async (email: string, password: string) => {
            console.log('signIn', {
                email,
                password,
            });
            return { user: undefined, errorMessage: 'mock provider' };
        },
        []
    );

    const signUp: AuthContextValues['signUp'] = useCallback(
        async (email: string, password: string, phoneNumber: string) => {
            return { user: undefined, errorMessage: 'mock provider' };
        },
        []
    );

    const verifyMfaCode = useCallback(async (code: string) => {
        return { user: undefined, errorMessage: 'mock provider' };
    }, []);

    const completeFirstLoginUpdate: AuthContextValues['completeFirstLoginUpdate'] =
        useCallback(
            async (password: string, phoneNumber: string) => {
                return {
                    user: undefined,
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

const waitForCode = () => new Promise((resolve) => setTimeout(resolve, 2500));
