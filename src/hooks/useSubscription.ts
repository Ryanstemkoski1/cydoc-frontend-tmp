import { SubscriptionProviderContext } from 'providers/SubscriptionProvider';
import { useContext } from 'react';
import invariant from 'tiny-invariant';

export const useSubscription = () => {
    const ctx = useContext(SubscriptionProviderContext);

    invariant(
        ctx,
        'SubscriptionProviderContext called outside of UserInfo Context'
    );

    return ctx;
};
