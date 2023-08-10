import { useState, useEffect } from 'react';

export default function UpdateDimensions() {
    function getDimensions() {
        const width = typeof window !== 'undefined' ? window.innerWidth : 0;
        return { width };
    }

    const [windowDimensions, setWindowDimensions] = useState(getDimensions());

    function handleResize() {
        setWindowDimensions(getDimensions());
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [typeof window !== 'undefined', handleResize]);

    return windowDimensions;
}
