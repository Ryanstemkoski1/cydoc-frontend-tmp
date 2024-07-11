import React from 'react';

import './Account.css';
import { Stack } from '@mui/system';
import ModalHeader from '@components/Atoms/ModalHeader';
import SignUpTextInput from './SignUpTextInput';

export default function InstitutionPickerStep() {
    return (
        <>
            <ModalHeader title='Which Institution do you work at?' />
            <Stack
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '2rem',
                }}
            >
                <SignUpTextInput
                    label='Institution Name'
                    fieldName='institutionName'
                    placeholder='institution name'
                    // height: min-content;
                />
            </Stack>
        </>
    );
}
