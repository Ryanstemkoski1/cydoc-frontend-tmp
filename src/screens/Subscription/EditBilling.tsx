import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@mui/material';
import { ErrorText } from '@components/Atoms/ErrorText';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import { getStripeSetupUrl } from 'modules/subscription-api';
import { breadcrumb, log } from 'modules/logging';
import { stringFromError } from 'modules/error-utils';
import { GetStripeSetupUrlResponse } from '@cydoc-ai/types';

export function EditBilling() {
    const { user } = useUser();
    const { cognitoUser } = useAuth();
    const [error, setError] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUrl = async () => {
            if (cognitoUser && user?.institutionId) {
                try {
                    const stripeIntentResponse = await getStripeSetupUrl(
                        user?.institutionId,
                        cognitoUser
                    );
                    if (stripeIntentResponse.errorMessage) {
                        setError(
                            'Error setting up billing, try refreshing the page'
                        );
                    } else if (stripeIntentResponse.setupUrl) {
                        const setupUrl = (
                            stripeIntentResponse as GetStripeSetupUrlResponse
                        ).setupUrl;
                        setPaymentLink(setupUrl);
                        window.location.href = setupUrl;
                    } else {
                        breadcrumb('unexpected API response shape', 'Stripe', {
                            stripeIntentResponse,
                        });
                        throw new Error(`unexpected error`);
                    }
                } catch (e) {
                    setError(
                        'Error setting up billing, try refreshing the page'
                    );
                    log(
                        `[getStripeSetupUrl] React error: ${stringFromError(
                            e
                        )}`,
                        {
                            user,
                            cognitoUser,
                            error,
                            loading,
                        }
                    );
                }
                setLoading(false);
            }
        };
        fetchUrl();
    }, [cognitoUser, error, loading, user, user?.institutionId]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <Typography mt={'1rem'} id='signup-modal-text'>
                    Error connecting with payment provider, try logging out and
                    back in
                </Typography>
                <ErrorText message={error} />
            </>
        );
    }

    return (
        <>
            <Typography mt={'1rem'} id='signup-modal-text'>
                Redirecting you to our payment provider to setup payment.
            </Typography>
            <Typography
                style={{
                    display: 'flex',
                }}
                id='signup-modal-text'
            >
                {`If you don't get redirected, click: `}
                <a href={paymentLink}>here</a>
            </Typography>
        </>
    );
}
