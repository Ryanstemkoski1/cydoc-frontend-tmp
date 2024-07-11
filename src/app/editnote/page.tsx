'use client';

import HPIProvider from '@contexts/HPIProvider';
import useSignInRequired from '@hooks/useSignInRequired';
import EditNote from '@screens/EditNote/EditNote';

export default function EditNotePage() {
    useSignInRequired(); // this route is private, sign in required
    return (
        <HPIProvider>
            <EditNote />
        </HPIProvider>
    );
}
