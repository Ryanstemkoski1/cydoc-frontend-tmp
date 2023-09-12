import React from 'react';
import { useFormikContext } from 'formik';
import { ErrorText } from '../Atoms/ErrorText';
import { Grid, Stack } from '@mui/material';

export default function FormErrors() {
    const { errors } = useFormikContext();
    return Object.keys(errors)?.length ? (
        <Grid item xs={12}>
            <Stack>
                {Object.keys(errors)
                    ?.slice(0, 1)
                    .map((errorKey) => (
                        <ErrorText
                            key={errorKey}
                            message={`${errors?.[errorKey as keyof unknown]}`}
                        />
                    ))}
            </Stack>
        </Grid>
    ) : null;
}
