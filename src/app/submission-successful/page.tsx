'use client';

import AfterSubmissionPage from '@screens/AfterSubmissionPage';
import { Suspense } from 'react';

export default function AfterSubmission() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <AfterSubmissionPage />
        </Suspense>
    );
}
