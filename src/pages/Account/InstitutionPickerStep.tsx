import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import './Account.css';
import { Loader } from 'semantic-ui-react';
import { SignUpFormData } from './SignUpForm';
import { useField } from 'formik';
import { Box, Stack } from '@mui/system';
import ModalHeader from './ModalHeader';
import { Institution } from 'types/intitutions';
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    TextField,
} from '@mui/material';

export function InstitutionPickerStep() {
    const [loading, setLoading] = useState(false);
    const [{ value: institutionId }, , helpers] =
        useField<SignUpFormData['institutionId']>('institutionId');

    const institutions = INSTITUTIONS_DATA;

    const getOptionLabel = (option: Institution) => option.name;
    const getOptionSelected = (option: Institution, value: Institution) =>
        value.id === option.id;

    const selectedInstitution = useMemo(
        () => institutions.find((i) => institutionId === i.id),
        [institutions, institutionId]
    );

    const input = useCallback(
        (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                // className={classes.textField}
                label={institutionId ? 'Institution' : ''}
                // InputProps={{ ...params.InputProps, className: classes.input }}
                //   InputProps={{ style: { color: 'white' } }}
                sx={{
                    paddingBottom: '0 !important',
                    paddingTop: '0 !important',
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                margin='dense'
                variant='outlined'
                placeholder='Select a Institution...'
            />
        ),
        []
    );

    const onChange = useCallback(
        (event: ChangeEvent<any>, selected: Institution) => {
            if (selected?.id) {
                helpers.setTouched(true);
                helpers.setValue(selected.id);
            }
        },
        [helpers]
    );

    return (
        <>
            <ModalHeader title='Pick Institution' />
            <Box>
                {loading ? (
                    <Loader active inline='centered' />
                ) : (
                    <Stack
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '2rem',
                        }}
                    >
                        <p style={{ textAlign: 'left' }} id='signup-modal-text'>
                            Which Institution do you work at?
                        </p>
                        <Autocomplete
                            key={'institution-picker'}
                            id='institution-picker'
                            // sx={{ margin: '.5vh auto', width: '95%' }}
                            clearOnBlur
                            selectOnFocus
                            handleHomeEndKeys
                            getOptionLabel={getOptionLabel}
                            isOptionEqualToValue={getOptionSelected}
                            onChange={(event, newValue) => {
                                if (typeof newValue?.id === 'string') {
                                    helpers.setTouched(true);
                                    helpers.setValue(newValue.id);
                                } else if (newValue && newValue.id) {
                                    alert('creating new institution');
                                } else {
                                    // eslint-disable-next-line no-console
                                    console.log(`new val`);
                                    // setValue(newValue);
                                }
                            }}
                            options={institutions}
                            renderInput={input}
                            value={selectedInstitution}
                        />
                    </Stack>
                )}
            </Box>
        </>
    );
}

const INSTITUTIONS_DATA: Institution[] = [
    { name: 'Good Samaritan Hospital', id: '1' },
    { name: 'Main St. Family Practice', id: '2' },
    { name: 'Cydoc (Testing)', id: '3' },
];
