import React, { useEffect, useState } from 'react';

import './Account.css';
import {
    Button,
    Container,
    Form,
    Modal,
    Header,
    Divider,
    Loader,
} from 'semantic-ui-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export function AddPaymentStep() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const createStripePaymentMethod = async () => {
            if (elements && stripe) {
                const card = elements.getElement(CardElement);
                if (card == null) {
                    return;
                }
                // TODO: put stripe lo
                const { error, paymentMethod } =
                    await stripe.createPaymentMethod({
                        type: 'card',
                        card,
                        billing_details: {
                            // TODO: use useField to get these values
                            // name: `${firstName} ${lastName}`,
                        },
                    });

                if (error) {
                    // alert('Card Error', error);
                }
                // TODO: use useField to get these values
                // setPaymentMethod(paymentMethod);
                setLoading(true);
            } else {
                // TODO: log to sentry
            }
        };

        createStripePaymentMethod();
    }, [elements, stripe]);

    // TODO: show loading state
    return (
        <>
            <Modal.Header>Free Trial</Modal.Header>
            <Modal.Content>
                {/* <Form error={passwordErrorMessages().length > 0}>
                    <Container>
                        <Header as='h5' textAlign='center' content='' />
                        <div id='signup-modal-div'>
                            <p
                                style={{ textAlign: 'left' }}
                                id='signup-modal-text'
                            >
                                You have been given a one-month free trial. Your
                                card will not be billed until the second month.
                                The subscription is $100/clinician/month. You
                                may cancel anytime.
                            </p>
                        </div>
                        <div
                            style={{
                                maxWidth: '350px',
                                marginTop: '15px',
                                marginBottom: '15px',
                                border: '1px solid grey',
                                borderRadius: '4px',
                                height: '40px',
                                padding: '10px 10px 0 10px',
                            }}
                        >
                            <CardElement id='card-element' />
                        </div>
                    </Container>
                    <Container className='modal-button-container'>
                        <Button
                            basic
                            color='teal'
                            content='Cancel'
                            type='button'
                            onClick={() => {
                                setIsInviteDoctorOpen(false);
                                reloadModal();
                            }}
                        />
                        <Button
                            color='teal'
                            content='Prev'
                            type='button'
                            onClick={(e) => {
                                onPrevClick(e);
                            }}
                        />
                        <Button
                            color='teal'
                            content='Next'
                            onClick={(e) => {
                                if (isSubmitValid(wizardPage)) {
                                    onNextClick(e);
                                }
                            }}
                        />
                    </Container>
                </Form> */}
            </Modal.Content>
        </>
    );
}
