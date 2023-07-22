import React, { useEffect } from 'react';
import NavMenu from 'components/navigation/NavMenu';
import { Box } from '@mui/system';
import { Paper, Typography } from '@mui/material';
import { log } from 'modules/logging';
import { useUser } from 'hooks/useUser';
import { useAuth } from 'hooks/useAuth';

export default function NotAuthorized() {
    const { user, isManager } = useUser();
    const { authLoading, cognitoUser } = useAuth();
    useEffect(() => {
        // log this event to Sentry once
        log(`Incorrect user authorization`, {
            cognitoUser,
            user,
            isManager,
            authLoading,
        });
    });
    return (
        <>
            <NavMenu attached={'top'} displayNoteName={false} />
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    padding: '10rem',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: '30rem',
                        padding: '2.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        Not Authorized
                    </Typography>
                    <Typography
                        style={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                        }}
                    >
                        You are not authorized for this action
                    </Typography>
                    <Typography>
                        Login as a manager or speak to your administrator about
                        becoming one
                    </Typography>
                    <Typography>{`id: ${user?.id}`}</Typography>
                </Paper>
            </Box>
        </>
    );
}
