'use client';

import { useMemo } from 'react';

// Access auth context values and functions
const useAuth = () => {
    return useMemo(
        () => ({
            cognitoUser: {},
            authLoading: false,
            loginCorrect: true, // username/password correct, still need MFA confirmation
            passwordResetRequired: false,
            isSignedIn: false, // MFA confirmed
            signIn: (email: string, password: string) =>
                Promise.resolve({ errorMessage: '', user: {} }),
            signUp: (email: string, password: string, phoneNumber: string) =>
                Promise.resolve({ errorMessage: '', user: {} }),
            completeFirstLoginUpdate: (password: string, phoneNumber: string) =>
                Promise.resolve({ errorMessage: '', user: {} }),
            verifyMfaCode: (code: string) =>
                Promise.resolve({ errorMessage: '', user: {} }),
            signOut: () => {},
        }),
        []
    );
};

export default useAuth;
