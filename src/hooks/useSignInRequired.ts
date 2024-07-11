'use client';
import { useRouter } from 'next/navigation';
import useAuth from './useAuth';
import useUser from './useUser';

// Access auth context values and functions
const useSignInRequired = () => {
    const router = useRouter();
    const { authLoading, isSignedIn } = useAuth();
    const { user, loading } = useUser();

    // wait til loading is complete
    if (authLoading || loading) {
        return null;
    }

    if (isSignedIn && user) return true;

    // user required to view this page
    router.push('/login');
};

export default useSignInRequired;
