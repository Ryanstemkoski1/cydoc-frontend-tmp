'use client';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CenteredPaper } from '@components/Atoms/CenteredPaper';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import { log } from 'modules/logging';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'semantic-ui-react';
import useManagerRequired from '@hooks/useManagerRequired';

export function SubscriptionCancel() {
    useManagerRequired(); // this route is private, manager required
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && cognitoUser)
            log(`User cancelled adding payment`, { user, cognitoUser });
    }, [user, cognitoUser]);

    return (
        <CenteredPaper>
            <Box sx={{ margin: '2rem' }}>
                <Typography
                    style={{
                        textAlign: 'left',
                        justifyContent: 'center',
                    }}
                    id='signup-modal-text'
                >
                    Payment setup cancelled!
                </Typography>{' '}
                <Typography
                    style={{
                        textAlign: 'left',
                        justifyContent: 'center',
                    }}
                    id='signup-modal-text'
                >
                    You can try again at any time...
                </Typography>
                <Box
                    margin={'1rem'}
                    height={'100%'}
                    display={'flex'}
                    alignItems={'center'}
                >
                    <Button
                        content='Okay!'
                        size='small'
                        style={{ marginLeft: '1rem' }}
                        onClick={() => router.push('/subscription')}
                    />
                </Box>
            </Box>
        </CenteredPaper>
    );
}
