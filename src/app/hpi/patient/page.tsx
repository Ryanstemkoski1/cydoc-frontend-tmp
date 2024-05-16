'use client';
import HPI from '@screens/HPI/Hpi';
import { Suspense } from 'react';

export default function HPIPage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <HPI />
        </Suspense>
    );
}
