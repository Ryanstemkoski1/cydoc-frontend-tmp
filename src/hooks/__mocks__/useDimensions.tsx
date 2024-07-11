'use client';
import React, { useMemo } from 'react';

const DIMENSIONS = { windowWidth: 100, windowHeight: 100 };

function useDimensions() {
    return useMemo(() => DIMENSIONS, []);
}

function withDimensionsHook(Component: React.ComponentType<any>) {
    console.log('withDimensionsHook MOCKED');
    return function WrappedComponent(props: any) {
        return <Component {...props} dimensions={DIMENSIONS} />;
    };
}

// HOC for class based components
export { withDimensionsHook };

// use this hook for functional components
export default useDimensions;
