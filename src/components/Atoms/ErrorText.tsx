import React from 'react';
import { Typography } from '@mui/material';

interface Props {
    message: string;
}

export function ErrorText({ message }: Props) {
    if (!message) {
        return null;
    }

    return (
        <Typography sx={{ color: 'red', marginTop: '1rem' }}>
            {message}
        </Typography>
    );
}
