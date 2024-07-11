'use client';

import { useEffect, useMemo, useState } from 'react';

/**
 * Hook that returns a boolean indicating if the user is on a mobile device.
 */
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        );
    }, []);

    return useMemo(() => isMobile, [isMobile]);
};

export default useIsMobile;
