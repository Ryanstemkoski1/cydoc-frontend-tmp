import React, { useMemo, useState } from 'react';
import { Box } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ModalHeader from '@components/Atoms/ModalHeader';
import { EditBilling } from './EditBilling';
import { CurrentPaymentMethod } from './CurrentPaymentMethod';
import { CenteredPaper } from 'components/Atoms/CenteredPaper';
import { useSubscription } from 'hooks/useSubscription';
import { Grid, Typography } from '@mui/material';

const ACTIVE_TRIAL_MESSAGE =
    'You have been given a 14 day free trial. Your card will not be billed until the 15th day. The subscription is $99/clinician/month. You may cancel anytime.';

export function SubscriptionPage() {
    const [showEditPayment, setShowEditPayment] = useState(false);
    const {
        loading,
        isSubscribed,
        isPaymentSetup,
        isTrialExpired,
        trialDaysRemaining,
        monthlyCost,
    } = useSubscription();

    return (
        <CenteredPaper loading={loading}>
            <ModalHeader title='Subscription Management' />
            <Grid container spacing={1}>
                {isPaymentSetup ? null : (
                    <>
                        <Typography textAlign='center' pt={4} style={{}}>
                            {ACTIVE_TRIAL_MESSAGE}
                        </Typography>
                        <StatusInfo
                            isValid={!isTrialExpired}
                            description='Your trial has:'
                            validLabel={`${trialDaysRemaining} days`}
                            inValidLabel={'Expired'}
                        />
                    </>
                )}
                <StatusInfo
                    isValid={isSubscribed}
                    description='Your subscription is:'
                    validLabel={'Active'}
                    inValidLabel={'Inactive'}
                />
                <StatusInfo
                    isValid={true}
                    description='Monthly price ($99/seat):'
                    validLabel={`$${monthlyCost}`}
                    inValidLabel={'Inactive'}
                />
                <StatusInfo
                    isValid={isPaymentSetup}
                    description='Your billing cycle:'
                    validLabel={'Monthly'}
                    inValidLabel={'Invalid'}
                />
                <StatusInfo
                    isValid={isPaymentSetup}
                    description='Your payment method is:'
                    validLabel={'Valid'}
                    inValidLabel={'Invalid'}
                />
            </Grid>
            <Box mt={2}>
                {showEditPayment ? (
                    <EditBilling />
                ) : (
                    <CurrentPaymentMethod
                        onEditPayment={() => setShowEditPayment(true)}
                    />
                )}
            </Box>
        </CenteredPaper>
    );
}
interface StatusInfoProps {
    isValid: boolean;
    description: string;
    validLabel: string;
    inValidLabel: string;
}
function StatusInfo({
    description,
    isValid,
    validLabel,
    inValidLabel,
}: StatusInfoProps) {
    const styles = useMemo(() => makeStyles(isValid), [isValid]);

    return (
        <>
            <Grid item xs={12} sm={7} mt={2}>
                <Typography style={styles.label}>{description}</Typography>
            </Grid>
            <Grid item xs={12} sm={5} mt={2}>
                <span style={styles.labelStatus}>
                    {isValid ? validLabel : inValidLabel}
                    {isValid ? (
                        <CheckCircleIcon {...iconProps} />
                    ) : (
                        <CancelIcon {...iconProps} color='error' />
                    )}
                </span>
            </Grid>
        </>
    );
}

const makeStyles = (isValid: boolean) => ({
    label: { display: 'flex', alignItems: 'center' },
    labelStatus: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontWeight: 800,
        color: isValid ? 'green' : 'rgb(211, 47, 47)',
        marginLeft: '1rem',
    } as React.CSSProperties,
});

const iconProps = { style: { marginLeft: '.5rem' } };
