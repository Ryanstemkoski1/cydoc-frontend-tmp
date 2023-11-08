import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@mui/material';
import { ErrorText } from 'components/Atoms/ErrorText';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
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
        if (cognitoUser && user?.institutionId) {
            getStripeSetupUrl(user?.institutionId, cognitoUser)
                .then((stripeIntentResponse) => {
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
                })
                .catch((e) => {
                    setError(
                        'Error setting up billing, try refreshing the page'
                    );
                    log(
                        `[getStripeSetupUrl] React error: ${stringFromError(
                            e
                        )}`,
                        { user, cognitoUser, error, loading }
                    );
                })
                .finally(() => setLoading(false));
        }
    }, [cognitoUser, error, loading, user, user?.institutionId]);

    return loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <CircularProgress />
        </div>
    ) : (
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
            <ErrorText message={error} />
        </>
    );
}
