import React from 'react';
import * as Yup from 'yup';

import './Account.css';
import { CardElement } from '@stripe/react-stripe-js';
import { Formik } from 'formik';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import ModalHeader from '../../components/Atoms/ModalHeader';
import { ErrorText } from 'components/Atoms/ErrorText';
const initialValues = { paymentMethod: {} };

const validationSchema = Yup.object({
    paymentMethod: Yup.object()
        .label('Payment Method')
        .required('Payment Method is required'),
});

export function EditPayment() {
    // TODO: re-use or delete useValidatePaymentMethod
    const onSubmit =
        async (/* formUserData, { setErrors, setSubmitting } */) => {
            // TODO: edit user payment method
        };
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnChange={true}
            validationSchema={validationSchema}
        >
            {({ errors, setTouched }) => (
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
                                You have been given a 90 day free trial. Your
                                card will not be billed until the 4th month. The
                                subscription is $100/clinician/month. You may
                                cancel anytime.
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
                                    onChange={() =>
                                        setTouched({ paymentMethod: true })
                                    }
                                />
                                {errors?.paymentMethod ? (
                                    <ErrorText
                                        message={
                                            (errors?.paymentMethod as string) ||
                                            ''
                                        }
                                    />
                                ) : null}
                            </Box>
                        </>
                    </Box>
                </>
            )}
        </Formik>
    );
}
