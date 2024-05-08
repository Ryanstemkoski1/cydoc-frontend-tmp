import { useSearchParams } from 'next/navigation';
import React from 'react';

function useQuery() {
    const searchParams = useSearchParams();

    return React.useMemo(() => searchParams, [searchParams]);
}

export default useQuery;
