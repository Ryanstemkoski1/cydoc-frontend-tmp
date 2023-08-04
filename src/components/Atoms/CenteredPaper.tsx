import React from 'react';
import { Box } from '@mui/system';
import { Paper } from '@mui/material';

interface Props {
    children: any;
}

export function CenteredPaper({ children }: Props) {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                padding: '10rem',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Paper elevation={6} sx={{ width: '30rem', padding: '2.5rem' }}>
                {children}
            </Paper>
        </Box>
    );
}
