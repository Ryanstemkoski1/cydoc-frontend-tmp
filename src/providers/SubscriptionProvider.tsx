import useAuth from 'hooks/useAuth';
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import useUser from 'hooks/useUser';
import { getSubscriptionInfo } from 'modules/subscription-api';
import { SubscriptionInfo } from '@cydoc-ai/types';

const ONE_DAY = 1000 * 60 * 60 * 24;
export interface SubscriptionProviderContextValues {
    isPaymentSetup: boolean;
    isSubscribed: boolean;
    isTrialExpired: boolean;
    trialDaysRemaining: null | number;
    monthlyCost: number;
    loading: boolean;
    updateSubscriptionInfo: () => void;
}

const initialState: SubscriptionInfo = {
    isSubscribed: false,
    monthlyCost: 0,
    stripeCustomer: null,
    trialEndsAt: 0,
};

export const SubscriptionProviderContext =
    React.createContext<SubscriptionProviderContextValues | null>(null);

export const SubscriptionProvider: React.FC<
    Record<string, unknown> & PropsWithChildren<object>
> = ({ children }) => {
    const { cognitoUser, isSignedIn } = useAuth();
    const { user } = useUser();
    const [subscriptionInfo, setSubscriptionInfo] =
        useState<SubscriptionInfo>(initialState);
    const { isSubscribed, trialEndsAt, monthlyCost, stripeCustomer } =
        subscriptionInfo;

    const isTrialExpired = useMemo(
        () => Date.now() > subscriptionInfo.trialEndsAt * 1000,
        [subscriptionInfo.trialEndsAt]
    );
    const trialDaysRemaining = useMemo(
        () => Math.round((trialEndsAt * 1000 - Date.now()) / ONE_DAY),
        [trialEndsAt]
    );
    const isPaymentSetup = useMemo(
        () => !!stripeCustomer?.invoice_settings?.default_payment_method,
        [stripeCustomer?.invoice_settings?.default_payment_method]
    );

    const [loading, setLoading] = useState(true);

    const updateSubscriptionInfo = useCallback(async () => {
        if (isSignedIn && user) {
            try {
                const newSubscriptionInfo = await getSubscriptionInfo(
                    user?.institutionId,
                    cognitoUser
                );

                setSubscriptionInfo(newSubscriptionInfo);
            } finally {
                setLoading(false);
            }
        } else {
            // reset user state on signOut
            setSubscriptionInfo(initialState);
        }
    }, [cognitoUser, isSignedIn, user]);

    useEffect(() => {
        updateSubscriptionInfo();
    }, [updateSubscriptionInfo]);

    const contextValue: SubscriptionProviderContextValues = useMemo(() => {
        return {
            isPaymentSetup,
            isSubscribed,
            updateSubscriptionInfo,
            loading,
            isTrialExpired,
            trialDaysRemaining: trialDaysRemaining || 0,
            monthlyCost,
        };
    }, [
        isPaymentSetup,
        isSubscribed,
        updateSubscriptionInfo,
        loading,
        isTrialExpired,
        monthlyCost,
        trialDaysRemaining,
    ]);

    return (
        <SubscriptionProviderContext.Provider value={contextValue}>
            {children}
        </SubscriptionProviderContext.Provider>
    );
};
