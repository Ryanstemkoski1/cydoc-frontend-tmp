import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CenteredPaper } from 'components/Atoms/CenteredPaper';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import { log } from 'modules/logging';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export function SubscriptionCancel() {
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const history = useHistory();

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
                        onClick={() => history.push('/subscription')}
                    />
                </Box>
            </Box>
        </CenteredPaper>
    );
}
