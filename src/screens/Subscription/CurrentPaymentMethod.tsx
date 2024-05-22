import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useSubscription } from '@hooks/useSubscription';
import React from 'react';
import { Button } from 'semantic-ui-react';

const PAYMENT_SETUP = 'You already have payment set up. Thank you!';
const NO_PAYMENT_SETUP = 'You need to add payment';
interface Props {
    onEditPayment: () => void;
}

export function CurrentPaymentMethod({ onEditPayment }: Props) {
    const { isPaymentSetup } = useSubscription();

    return (
        <Box sx={{ marginTop: '2rem' }}>
            <Typography variant='h5' textAlign='center'>
                {isPaymentSetup ? PAYMENT_SETUP : NO_PAYMENT_SETUP}
            </Typography>
            <Box
                height={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Button
                    icon={isPaymentSetup ? 'edit' : 'add'}
                    content={`${isPaymentSetup ? 'Edit' : 'Add'} Payment`}
                    size='small'
                    style={{ marginTop: '2rem' }}
                    onClick={onEditPayment}
                />
            </Box>
        </Box>
    );
}
