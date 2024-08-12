'use client';
import HPIAdvance from '@screens/HPIAdvance/HpiAdvance';
import { Suspense } from 'react';

export default function HPIAdvancePage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <HPIAdvance />
        </Suspense>
    );
}
