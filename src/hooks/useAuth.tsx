import { useAuthInfoContext } from 'providers/AuthProvider';

// Access auth context values and functions
export default () => {
    const {
        cognitoUser,
        authLoading,
        loginCorrect,
        isSignedIn,
        signIn,
        signUp,
        verifyMfaCode,
        signOut,
    } = useAuthInfoContext();

    return {
        cognitoUser,
        authLoading,
        loginCorrect,
        isSignedIn,
        signIn,
        signUp,
        verifyMfaCode,
        signOut,
    };
};
