'use client';
import { AuthProviderContext } from 'providers/AuthProvider';
import { useContext } from 'react';
import invariant from 'tiny-invariant';

// Access auth context values and functions
const useAuth = () => {
    const ctx = useContext(AuthProviderContext);

    invariant(ctx, 'useAuth called outside of AuthProvider Context');

    return ctx;
};

export default useAuth;
