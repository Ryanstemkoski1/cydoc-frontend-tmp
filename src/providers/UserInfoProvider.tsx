import useAuth from 'hooks/useAuth';
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
import { DbUser } from 'types/users';

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
        if (cognitoUser) {
            const email = cognitoUser?.attributes?.email;

            if (email) {
                const user = await getDbUser(email);
                setUser(user || undefined);
            } else {
                console.log(`cognito user missing attributes`);
            }
        } else {
            // reset user state on signOut
            setUser(undefined);
        }
    }, [cognitoUser?.attributes?.email]);

    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

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
