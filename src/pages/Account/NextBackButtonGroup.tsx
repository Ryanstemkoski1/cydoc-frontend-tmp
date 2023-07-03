import React, { useMemo, useState } from 'react';

import './Account.css';
import { Button } from 'semantic-ui-react';
import useEnableNext from './useEnableNext';
import { Box } from '@mui/system';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useValidatePaymentMethod } from 'hooks/useValidatePaymentMethod';
import { useFormikContext } from 'formik';
import { PAYMENT_STEP, PRIVACY_STEP } from './SignUpSteps';
import { ErrorText } from 'components/Atoms/ErrorText';

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
    const { isSubmitting, submitForm, errors } = useFormikContext();

    const onPaymentStep = step === PAYMENT_STEP;
    const onLastStep = step === PRIVACY_STEP;

    // Some props for NextButton change depending on which step you're on
    const nextButtonProps: {
        onClick: () => Promise<unknown> | void;
        content: string;
    } = useMemo(() => {
        if (onPaymentStep) {
            return {
                content: 'Submit',
                onClick: async () =>
                    (await createStripePaymentMethod()) && onNextClick(),
                // Submit payment & verify success
                // if success, go to next step
                // if failed, error will show in formik errors
            };
        } else if (onLastStep) {
            return {
                content: 'Create Account',
                onClick: submitForm,
                type: 'submit',
            };
        } else {
            return {
                content: 'Next',
                onClick: onNextClick,
            };
        }
    }, [
        createStripePaymentMethod,
        onLastStep,
        onNextClick,
        onPaymentStep,
        submitForm,
    ]);

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
                        {...nextButtonProps}
                    />
                </Box>
                {onLastStep && Object.keys(errors).length ? (
                    <ErrorText message={JSON.stringify(errors)} />
                ) : null}
            </Box>
        </Box>
    );
}
