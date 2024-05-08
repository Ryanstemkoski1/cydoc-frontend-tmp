'use client';

import React, { memo, useMemo, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useSubscription } from 'hooks/useSubscription';
import UpgradeSubscriptionButton from './UpgradeSubscriptionButton';
import { useLocation } from 'react-router-dom';

export const SubscriptionModal = memo(() => {
    const { isTrialExpired, isSubscribed, loading, isPaymentSetup } =
        useSubscription();
    const backgroundColor = useMemo(
        () => (isTrialExpired ? '#FA5B2E' : '#FFBE25'),
        [isTrialExpired]
    );
    const location = useLocation();
    const viewingSubscription = location.pathname.includes('subscription');
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const style = useMemo(() => makeStyles(backgroundColor), [backgroundColor]);

    // Only show the banner to institutions whose trial is over who haven't added payment
    if (
        isBannerDismissed ||
        viewingSubscription ||
        loading ||
        isSubscribed ||
        (isTrialExpired && !isPaymentSetup)
    )
        return null;

    return (
        <Modal
            open={!isBannerDismissed}
            onClose={() => setIsBannerDismissed(true)}
        >
            <Box sx={style}>
                <Typography
                    variant='h6'
                    component='h1'
                    textAlign='center'
                    color={'white'}
                >
                    Upgrade now to continue using Cydoc
                </Typography>
                <Box sx={{ my: 3 }}>
                    <Typography
                        component='h3'
                        color={'white'}
                        textAlign='center'
                    >
                        Your 14 day trial has expired, add a payment method to
                        continue using Cydoc.
                    </Typography>
                    <Typography
                        sx={{ mt: 1 }}
                        component='h3'
                        color={'white'}
                        textAlign='center'
                    >
                        The subscription is $99/clinician/month. You may cancel
                        anytime.
                    </Typography>
                </Box>
                <Box display='flex' justifyContent={'center'}>
                    <HideButton onClick={() => setIsBannerDismissed(true)} />
                    <UpgradeSubscriptionButton
                        backgroundColor={backgroundColor}
                        style={{ px: 2, ml: 2, py: 1 }}
                    />
                </Box>
            </Box>
        </Modal>
    );
});
SubscriptionModal.displayName = 'SubscriptionModal';

const makeStyles = (backgroundColor: string) => ({
    position: 'absolute' as const,
    top: '15%',
    width: '100%',
    bgcolor: backgroundColor,
    py: 8,
    display: 'flex',
    flexDirection: 'column',
});

function HideButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            variant='text'
            sx={{
                borderColor: 'white',
                color: 'white',
                px: 2,
                mr: 2,
                py: 1,
            }}
            onClick={onClick}
        >
            <Typography lineHeight='1.5em' variant='caption' color='white'>
                HIDE
            </Typography>
        </Button>
    );
}
