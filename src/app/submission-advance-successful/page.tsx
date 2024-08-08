'use client';

import AfterSubmissionAdvancePage from '@screens/AfterSubmissionAdvancePage';
import { Suspense } from 'react';

export default function AfterSubmission() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <AfterSubmissionAdvancePage />
        </Suspense>
    );
}
