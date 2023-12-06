// export default function UpgradeSubscriptionButton () {

import { Button, SxProps, Typography } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router';

export default function UpgradeSubscriptionButton({
    backgroundColor,
    style,
}: {
    backgroundColor: string;
    style?: SxProps;
}) {
    const history = useHistory();
    return (
        <Button
            variant='outlined'
            sx={{
                backgroundColor,
                borderColor: 'white',
                color: 'white',
                px: 1,
                ml: 1,
                py: 0.25,
                ...style,
            }}
            onClick={() => history.push('/subscription')}
        >
            <Typography lineHeight='1.5em' variant='caption' color='white'>
                ADD PAYMENT
            </Typography>
        </Button>
    );
}
UpgradeSubscriptionButton.displayName = 'UpgradeSubscriptionButton';
