import { Divider, Typography } from '@mui/material';
import React from 'react';

interface Props {
    title: string;
}
export default function ModalHeader({ title }: Props) {
    return (
        <>
            <Typography
                variant='h5'
                style={{
                    margin: '1rem',
                }}
            >
                {title}
            </Typography>
            <Divider
                sx={{
                    marginBottom: '1rem',
                }}
            />
        </>
    );
}
