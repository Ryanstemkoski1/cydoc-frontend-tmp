import { useCallback, useEffect, useMemo, useState } from 'react';
import { DbUser } from 'types/users';
import { useAuth } from './useAuth';
import { getDbUser } from 'modules/user-api';
import { log } from 'modules/logging';
import { ApiResponse } from 'types/api';

export function useUser() {
    const { cognitoUser } = useAuth();
    const [user, setUser] = useState<DbUser | null>(null);
    const isManager = useMemo(() => user?.role === 'manager', [user]);

    const updateUserInfo = useCallback(async () => {
        if (cognitoUser) {
            const email = cognitoUser.attributes.email;
            const userOrError = await getDbUser(email);

            if ((userOrError as ApiResponse)?.errorMessage) {
                log(`User not found: ${email}`, { email, cognitoUser });
            } else {
                const dbUser = userOrError as DbUser;
                setUser(dbUser);
            }
        }
    }, [cognitoUser]);

    useEffect(() => {
        updateUserInfo();
    }, [updateUserInfo]);

    return { user, updateUserInfo, isManager };
}
