'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function useQuery() {
    const searchParams = useSearchParams();

    return React.useMemo(() => searchParams, [searchParams]);
}
