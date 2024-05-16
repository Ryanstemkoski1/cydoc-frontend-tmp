'use client';

// import { HPIStore } from '@contexts/HPIContext';
// import EditNote from '@screens/EditNote/EditNote';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HPIProvider = dynamic(() => import('@contexts/HPIProvider'), {
    ssr: false,
});

const EditNote = dynamic(() => import('@screens/EditNote/EditNote'), {
    ssr: false,
});

export default function EditNotePage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <HPIProvider>
                <EditNote />
            </HPIProvider>
        </Suspense>
    );
}
