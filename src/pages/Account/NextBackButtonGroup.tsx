import React, { useMemo } from 'react';

import './Account.css';
import { Button } from 'semantic-ui-react';
import useEnableNext from './useEnableNext';
import { Box } from '@mui/system';
import { Divider, Step, StepLabel, Stepper } from '@mui/material';
import { useFormikContext } from 'formik';
import { PRIVACY_STEP } from './SignUpSteps';
import { ErrorText } from 'components/Atoms/ErrorText';
import { SignUpFormData } from './SignUpForm';
import { useHistory } from 'react-router-dom';

const steps = ['User info', 'Institution', 'Terms', 'Privacy'];

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
    const { isSubmitting, submitForm, errors } =
        useFormikContext<SignUpFormData>();
    const history = useHistory();

    const onLastStep = step === PRIVACY_STEP;
    const accountAlreadyExists = useMemo(
        () => errors?.signUpError?.includes('already exists'),
        [errors?.signUpError]
    );

    // Some props for NextButton change depending on which step you're on
    const nextButtonProps: {
        onClick: () => Promise<unknown> | void;
        content: string;
    } = useMemo(() => {
        if (onLastStep) {
            if (accountAlreadyExists) {
                return {
                    content: 'Login',
                    onClick: () => history.push('/Login'),
                };
            } else {
                return {
                    content: 'Create Account',
                    onClick: submitForm,
                    type: 'submit',
                };
            }
        } else {
            return {
                content: 'Next',
                onClick: onNextClick,
            };
        }
    }, [accountAlreadyExists, onLastStep, onNextClick, submitForm]);

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
                    <>
                        {Object.keys(errors).map((errorKey) => (
                            <ErrorText
                                key={errorKey}
                                message={`${errorKey}: ${
                                    errors?.[errorKey as keyof SignUpFormData]
                                }`}
                            />
                        ))}
                    </>
                ) : null}
            </Box>
        </Box>
    );
}
