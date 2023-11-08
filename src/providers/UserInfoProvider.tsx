import useAuth from 'hooks/useAuth';
import { updateLoggedUser } from '../modules/logging';
import { getDbUser } from '../modules/user-api';
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { DbUser } from '@cydoc-ai/types';

export interface UserInfoProviderContextValues {
    user: DbUser | undefined;
    updateUserInfo: () => void;
    isManager: boolean;
    loading: boolean;
}

export const UserInfoProviderContext =
    React.createContext<UserInfoProviderContextValues | null>(null);

export const UserInfoProvider: React.FC<
    Record<string, unknown> & PropsWithChildren<object>
> = ({ children }) => {
    const { cognitoUser } = useAuth();
    const [user, setUser] = useState<DbUser | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const isManager = useMemo(() => user?.role === 'manager', [user]);

    const updateUserInfo = useCallback(async () => {
        if (
            cognitoUser?.attributes?.email ||
            cognitoUser?.challengeParam?.userAttributes?.email
        ) {
            try {
                setLoading(true);
                const user = await getDbUser(cognitoUser);
                setUser(user || undefined);
            } finally {
                setLoading(false);
            }
        } else {
            // reset user state on signOut
            setUser(undefined);
        }
    }, [cognitoUser]);

    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    // update user in sentry logging
    useEffect(() => {
        user && updateLoggedUser(user);
    }, [user]);

    const contextValue = useMemo(() => {
        return { user, updateUserInfo, isManager, loading };
    }, [user, updateUserInfo, isManager, loading]);

    return (
        <UserInfoProviderContext.Provider value={contextValue}>
            {children}
        </UserInfoProviderContext.Provider>
    );
};
