import React, { useState } from 'react';

import './Account.css';
import { Button } from 'semantic-ui-react';
import useEnableNext from './useEnableNext';
import { Box } from '@mui/system';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useValidatePaymentMethod } from 'hooks/useValidatePaymentMethod';
import { useFormikContext } from 'formik';
import { PAYMENT_STEP } from './SignUpSteps';

const steps = ['User info', 'Institution', 'Payment', 'Terms', 'Privacy'];

interface Props {
    step: number;
    onClose: () => void;
    onPrevClick: () => void;
    onNextClick: () => void;
}
export function NextBackButtonGroup({
    step,
    onClose,
    onNextClick,
    onPrevClick,
}: Props) {
    const enableNext = useEnableNext(step);
    const { createStripePaymentMethod } = useValidatePaymentMethod();
    const { isSubmitting } = useFormikContext();

    const onPaymentStep = step === PAYMENT_STEP;

    const submitPaymentThenNext = async () => {
        // Submit payment & verify success
        if (await createStripePaymentMethod()) {
            // if success, go to next step
            onNextClick();
        }
        // if failed, error will show in formik errors
    };

    return (
        <Box>
            <Divider />
            <Box
                sx={{
                    margin: '1.5rem',
                }}
            >
                <Stepper
                    color='teal'
                    activeStep={step}
                    sx={{
                        marginBottom: '1.5rem',
                        '& .MuiStepLabel-root .Mui-completed': {
                            color: 'teal', // circle color (COMPLETED)
                        },
                        '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                            {
                                color: 'common.white', // Just text label (COMPLETED)
                            },
                        '& .MuiStepLabel-root .Mui-active': {
                            color: 'teal', // circle color (ACTIVE)
                        },
                        '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                            {
                                color: 'common.white', // Just text label (ACTIVE)
                            },
                        '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                            fill: 'common.white', // circle's number (ACTIVE)
                        },
                    }}
                >
                    {steps.map((label, index) => (
                        <Step color='teal' key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Button
                        basic
                        color='teal'
                        content='Cancel'
                        type='button'
                        onClick={onClose}
                    />
                    <Box sx={{ flex: '1 1 auto' }} />
                    {step > 0 ? (
                        <Button
                            basic
                            color='teal'
                            content='Prev'
                            type='button'
                            onClick={onPrevClick}
                        />
                    ) : null}

                    <Button
                        disabled={!enableNext}
                        color='teal'
                        loading={isSubmitting}
                        content={onPaymentStep ? 'Submit' : 'Next'}
                        onClick={
                            onPaymentStep ? submitPaymentThenNext : onNextClick
                        }
                    />
                </Box>
            </Box>
            {/* <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    margin: '1.5rem',
                }}
            >
                <Button
                    basic
                    color='teal'
                    content='Cancel'
                    type='button'
                    onClick={onClose}
                />
                {step > 0 ? (
                    <Button
                        color='teal'
                        content='Prev'
                        type='button'
                        onClick={onPrevClick}
                    />
                ) : null}
                <Button
                    disabled={!enableNext}
                    color='teal'
                    content='Next'
                    onClick={onNextClick}
                />
            </Box> */}
        </Box>
    );
}
