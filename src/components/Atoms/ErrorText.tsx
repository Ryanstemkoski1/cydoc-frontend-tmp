import React from 'react';
import { Typography } from '@mui/material';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message?: string | any | null;
}

export function ErrorText({ message }: Props) {
    if (!message) {
        return null;
    }

    const messageList = [];

    if (typeof message == 'string') {
        messageList.push(message);
    } else {
        Object.keys(message)?.map((k) =>
            message[k]
                ? messageList.push(message[k])
                : // eslint-disable-next-line no-console
                  console.warn(`unrecognized error: ${k}`, message)
        );
    }

    return (
        <>
            {messageList.map((m, i) => (
                <Typography
                    key={`error-text-${i}`}
                    sx={{ color: 'red', marginTop: '1rem' }}
                >
                    {m}
                </Typography>
            ))}
        </>
    );
}
