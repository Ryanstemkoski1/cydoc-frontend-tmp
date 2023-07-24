import { useCallback, useEffect, useMemo, useState } from 'react';
import { DbUser } from 'types/users';
import { useAuth } from './useAuth';
import { getDbUser } from 'modules/user-api';

export function useUser() {
    const { cognitoUser } = useAuth();
    const [user, setUser] = useState<DbUser | null>(null);
    const isManager = useMemo(() => user?.role === 'manager', [user]);

    const updateUserInfo = useCallback(async () => {
        if (cognitoUser) {
            const email = cognitoUser.attributes.email;
            const user = await getDbUser(email);

            setUser(user);
        }
    }, [cognitoUser]);

    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    return { user, updateUserInfo, isManager };
}
