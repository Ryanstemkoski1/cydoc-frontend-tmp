import React, { useEffect, useState } from 'react';

import './Account.css';
import { CardElement } from '@stripe/react-stripe-js';
import { useField, useFormikContext } from 'formik';
import { Box } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';
import ModalHeader from './ModalHeader';

export function AddPaymentStep() {
    const [, info, helpers] = useField<number | string>('paymentMethod');
    const { isSubmitting } = useFormikContext();

    return (
        <>
            <ModalHeader title='Free Trial' />
            <Box sx={{ margin: '2rem' }}>
                <>
                    <Typography
                        style={{
                            textAlign: 'left',
                            justifyContent: 'center',
                        }}
                        id='signup-modal-text'
                    >
                        You have been given a 90 day free trial. Your card will
                        not be billed until the 4th month. The subscription is
                        $100/clinician/month. You may cancel anytime.
                    </Typography>
                    <Box
                        sx={{
                            maxWidth: '90%',
                            border: '1px solid grey',
                            borderRadius: '4px',
                            height: '3rem',
                            padding: '1rem',
                            marginBottom: '2.5rem',
                            marginTop: '2rem',
                        }}
                    >
                        <CardElement
                            id='card-element'
                            onChange={() => helpers.setTouched(true)}
                        />
                        {info.error ? (
                            <Typography
                                sx={{ color: 'red', marginTop: '1rem' }}
                            >
                                {info.error}
                            </Typography>
                        ) : null}
                    </Box>
                </>
            </Box>
        </>
    );
}
