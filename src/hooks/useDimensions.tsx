'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

function useDimensions() {
    const [{ windowHeight, windowWidth }, setDimensions] = useState({
        windowHeight: 0,
        windowWidth: 0,
    });

    const updateDimensions = useCallback(() => {
        setDimensions({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });
    }, []);

    useEffect(() => {
        // do nothing if we are not running in browser environment.
        if (window === undefined) return;

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [updateDimensions]);

    return useMemo(
        () => ({ windowWidth, windowHeight }),
        [windowHeight, windowWidth]
    );
}

function withDimensionsHook(Component: React.ComponentType<any>) {
    return function WrappedComponent(props: any) {
        const dimensions = useDimensions();
        return <Component {...props} dimensions={dimensions} />;
    };
}

// HOC for class based components
export { withDimensionsHook };

// use this hook for functional components
export default useDimensions;
