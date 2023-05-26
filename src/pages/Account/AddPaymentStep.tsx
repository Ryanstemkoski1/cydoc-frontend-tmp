import React, { useEffect, useState } from 'react';

import './Account.css';
import { Container, Modal, Header, Loader } from 'semantic-ui-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SignUpFormData } from './SignUpForm';
import { useField } from 'formik';
import { log } from 'modules/logging';
import { stringFromError } from 'modules/error-utils';

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
                    console.log(`got payment method`, paymentMethod);

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
            <Modal.Header>Free Trial</Modal.Header>
            <Modal.Content>
                {loading ? (
                    <Loader active inline='centered' />
                ) : (
                    <Container>
                        <Header as='h5' textAlign='center' content='' />
                        <div id='signup-modal-div'>
                            <p
                                style={{ textAlign: 'left' }}
                                id='signup-modal-text'
                            >
                                You have been given a 90 day free trial. Your
                                card will not be billed until the 4th month. The
                                subscription is $100/clinician/month. You may
                                cancel anytime.
                            </p>
                        </div>
                        <div
                            style={{
                                maxWidth: '350px',
                                marginTop: '15px',
                                marginBottom: '15px',
                                border: '1px solid grey',
                                borderRadius: '4px',
                                height: '400px',
                                padding: '10px 10px 0 10px',
                            }}
                        >
                            <CardElement
                                id='card-element'
                                options={{
                                    style: {
                                        base: {
                                            backgroundColor: 'white',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Container>
                )}
            </Modal.Content>
        </>
    );
}
