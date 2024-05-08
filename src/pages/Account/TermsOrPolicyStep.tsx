import React, { useEffect } from 'react';

import './Account.css';
import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { Field, useField } from 'formik';
import { SignUpFormData } from './SignUpForm';
import ModalHeader from '@components/Atoms/ModalHeader';
import { Box } from '@mui/system';

interface Props {
    title: string;
    infoElement: React.JSX.Element;
    label: string;
    fieldName: keyof SignUpFormData;
}
export function TermsOrPolicyStep({
    title,
    fieldName,
    infoElement,
    label,
}: Props) {
    const [{ value }, , helpers] = useField<boolean>(fieldName);

    // here we set touched when the value changes,
    // so users don't need to click out of the checkbox for the form to be valid
    useEffect(() => {
        if (value) {
            helpers.setTouched(true, true);
        }
        // Don't include helpers here, causes infinite renders!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <ModalHeader title={title} />
            <Box
                sx={{
                    paddingTop: '1rem',
                }}
            >
                {infoElement}
                <Divider
                    sx={{
                        paddingTop: '1rem',
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '.5rem',
                    }}
                >
                    <FormControlLabel
                        control={
                            <Field
                                name={fieldName}
                                margin='normal'
                                required
                                id={fieldName}
                                type='checkbox'
                                as={Checkbox}
                            />
                        }
                        label={label}
                    />
                </Box>
            </Box>
        </>
    );
}
