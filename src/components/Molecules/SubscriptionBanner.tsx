import React, { memo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSubscription } from 'hooks/useSubscription';
import UpgradeSubscriptionButton from './UpgradeSubscriptionButton';
import useAuth from 'hooks/useAuth';

export const SubscriptionBanner = memo(() => {
    const { isSignedIn } = useAuth();
    const {
        trialDaysRemaining,
        isTrialExpired,
        isSubscribed,
        isPaymentSetup,
        loading,
    } = useSubscription();
    const backgroundColor = isTrialExpired ? '#FA5B2E' : '#FFBE25';

    // Only show the banner to institutions in a trial who haven't added payment
    if (!isSignedIn || loading || (isSubscribed && isPaymentSetup)) return null;

    return (
        <Stack
            flexDirection='row'
            justifyContent='center'
            p={1.2}
            sx={{ backgroundColor }}
        >
            <Typography color='white'>
                {isTrialExpired
                    ? 'Your trial has expired'
                    : `Your trial expires in ${trialDaysRemaining || 0} day${
                          trialDaysRemaining === 1 ? '' : 's'
                      }`}
            </Typography>

            <UpgradeSubscriptionButton backgroundColor={backgroundColor} />
        </Stack>
    );
});
SubscriptionBanner.displayName = 'SubscriptionBanner';
