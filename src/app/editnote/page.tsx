'use client';

import HPIProvider from '@contexts/HPIProvider';
import EditNote from '@screens/EditNote/EditNote';

export default function EditNotePage() {
    return (
        <HPIProvider>
            <EditNote />
        </HPIProvider>
    );
}
