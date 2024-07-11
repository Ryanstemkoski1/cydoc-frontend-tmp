'use client';

import useUser from './useUser';
import useSignInRequired from './useSignInRequired';
import { useRouter } from 'next/navigation';

// Access auth context values and functions
const useManagerRequired = () => {
    useSignInRequired();

    const router = useRouter();
    const { isManager, loading } = useUser();

    // wait til loading is complete
    if (loading) {
        return null;
    }

    if (isManager) return true;

    router.push('/not-authorized');
};

export default useManagerRequired;
