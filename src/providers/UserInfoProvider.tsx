import useAuth from 'hooks/useAuth';
import { updateLoggedUser } from 'modules/logging';
import { getDbUser } from 'modules/user-api';
import React, {
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import invariant from 'tiny-invariant';
import { DbUser } from '@cydoc-ai/types';

export interface UserInfoProviderContextValues {
    user: DbUser | undefined;
    updateUserInfo: () => void;
    isManager: boolean;
}

export const UserInfoProviderContext =
    React.createContext<UserInfoProviderContextValues | null>(null);

export const UserInfoProvider: React.FC<
    Record<string, unknown> & PropsWithChildren<object>
> = ({ children }) => {
    const { cognitoUser } = useAuth();
    const [user, setUser] = useState<DbUser | undefined>(undefined);
    const isManager = useMemo(() => user?.role === 'manager', [user]);

    const updateUserInfo = useCallback(async () => {
        if (
            cognitoUser?.attributes?.email ||
            cognitoUser?.challengeParam?.userAttributes?.email
        ) {
            const user = await getDbUser(
                cognitoUser?.attributes?.email ||
                    cognitoUser?.challengeParam?.userAttributes?.email ||
                    ''
            );
            setUser(user || undefined);
        } else {
            // reset user state on signOut
            setUser(undefined);
        }
    }, [
        cognitoUser?.attributes?.email,
        cognitoUser?.challengeParam?.userAttributes?.email,
    ]);

    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    // update user in sentry logging
    useEffect(() => {
        user && updateLoggedUser(user);
    }, [user]);

    const contextValue = useMemo(() => {
        return { user, updateUserInfo, isManager };
    }, [user, updateUserInfo, isManager]);

    return (
        <UserInfoProviderContext.Provider value={contextValue}>
            {children}
        </UserInfoProviderContext.Provider>
    );
};

export const useUserInfoContext = () => {
    const ctx = useContext(UserInfoProviderContext);

    invariant(ctx, 'useUserInfoContext called outside of UserInfo Context');

    return ctx;
};
