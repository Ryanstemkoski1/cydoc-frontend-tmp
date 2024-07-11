import { useState, useEffect, useCallback, useMemo } from 'react';

function getDimensions() {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    return { width };
}

export default function useUpdateDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getDimensions());

    const handleResize = useCallback(
        () => setWindowDimensions(getDimensions()),
        []
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [handleResize]);

    return useMemo(() => windowDimensions, [windowDimensions]);
}
