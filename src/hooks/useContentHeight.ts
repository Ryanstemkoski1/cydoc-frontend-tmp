'use client';

import useAuth from './useAuth';
import { useSubscription } from './useSubscription';

export const useContentHeight = () => {
    const { isSignedIn } = useAuth();
    const { isSubscribed, isPaymentSetup, loading } = useSubscription();

    const hideBanner =
        !isSignedIn || loading || (isSubscribed && isPaymentSetup);

    return hideBanner ? '100vh' : 'calc(100vh - 42px)';
};
