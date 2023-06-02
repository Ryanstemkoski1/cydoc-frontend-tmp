import React, { useState } from 'react';

import './Account.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SignUpFormData } from './SignUpForm';
import { useField } from 'formik';
import { log } from 'modules/logging';
import { stringFromError } from 'modules/error-utils';
import { Box } from '@mui/system';
import { CircularProgress, Typography } from '@mui/material';
import ModalHeader from './ModalHeader';

export function AddPaymentStep() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<any>();
    const [{ value: firstName }] =
        useField<SignUpFormData['firstName']>('firstName');
    const [{ value: lastName }] =
        useField<SignUpFormData['lastName']>('lastName');
    const [, , paymentMethodHelpers] =
        useField<SignUpFormData['paymentMethod']>('paymentMethod');

    // TODO: add onSubmit functionality
    const createStripePaymentMethod = async () => {
        if (elements && stripe && !loading && !paymentMethod) {
            setLoading(true);
            try {
                const card = elements.getElement(CardElement);
                if (card == null) {
                    return;
                }
                const { error, paymentMethod } =
                    await stripe.createPaymentMethod({
                        type: 'card',
                        card,
                        billing_details: {
                            name: `${firstName} ${lastName}`,
                        },
                    });
                // .then((res) => {
                //     console.log(`22got payment method`, res);
                // });

                if (error) {
                    log(`stripe setup error ${stringFromError(error)}`, error);
                    paymentMethodHelpers.setError(
                        `Try refreshing \nStripe error handled: ${stringFromError(
                            error
                        )}`
                    );
                }
                if (paymentMethod) {
                    // console.log(`got payment method`, paymentMethod);

                    setPaymentMethod(paymentMethod);
                }
            } catch (e) {
                log(`[createStripePaymentMethod] ${stringFromError(e)}`, {
                    e,
                });
                paymentMethodHelpers.setError(
                    `Try refreshing \nStripe error encountered: ${stringFromError(
                        e
                    )}`
                );
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <ModalHeader title='Free Trial' />
            <Box sx={{ margin: '2rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <CircularProgress sx={{}} />
                    </div>
                ) : (
                    <>
                        <Typography
                            style={{
                                textAlign: 'left',
                                marginBottom: '2rem',
                                justifyContent: 'center',
                            }}
                            id='signup-modal-text'
                        >
                            You have been given a 90 day free trial. Your card
                            will not be billed until the 4th month. The
                            subscription is $100/clinician/month. You may cancel
                            anytime.
                        </Typography>
                        <div
                            style={{
                                maxWidth: '90%',
                                border: '1px solid grey',
                                borderRadius: '4px',
                                height: '3rem',
                                padding: '1rem',
                            }}
                        >
                            <CardElement id='card-element' />
                        </div>
                    </>
                )}
            </Box>
        </>
    );
}
