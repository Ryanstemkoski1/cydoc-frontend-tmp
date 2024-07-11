/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box } from '@mui/system';
import { CircularProgress, Paper } from '@mui/material';

interface Props {
    children: any;
    sx?: any;
    loading?: boolean;
}

export function CenteredPaper({ children, sx, loading = false }: Props) {
    return (
        <Box display='flex' flex={1}>
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
                    sx={{ width: '30rem', padding: '2.5rem', ...sx }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        children
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
