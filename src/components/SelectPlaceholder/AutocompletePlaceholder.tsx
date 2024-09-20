import style from './SelectPlaceholder.module.scss';
import { SyntheticEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const customComponentProps = {
    popper: {
        sx: {
            '.MuiPaper-root': {
                margin: '4px 0',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',

                '& .MuiAutocomplete-option[aria-selected="true"]': {
                    backgroundColor: '#047A9B',
                    color: 'white',

                    '&.Mui-focused': {
                        backgroundColor: '#047A9B',
                    },
                },

                '& ul': {
                    padding: 0,
                    maxHeight: 192,

                    '& li': {
                        padding: '12px 16px',
                        fontFamily: 'Nunito',
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: '24px',
                        color: '#383838',

                        '&:hover': {
                            backgroundColor: '#EAF3F5',
                        },

                        '&.Mui-focused': {
                            backgroundColor: '#EAF3F5',
                        },

                        '&.Mui-selected': {
                            backgroundColor: '#047A9B',
                            color: 'white',

                            '&:first-of-type': {
                                backgroundColor: '#047A9B',
                            },

                            '&:hover': {
                                backgroundColor: '#047A9B',
                            },
                        },
                    },
                },
            },
        },
    },
};

const customInputStyle = {
    '& .MuiOutlinedInput-root': {
        padding: '14px 12px',
        borderRadius: '10px',

        '& .MuiAutocomplete-endAdornment': {
            right: '10px',
        },
        '& .MuiAutocomplete-input': {
            width: '100%',
            padding: 0,
            fontSize: '16px',
        },
        '& fieldset': {
            borderColor: '#0000003B',
        },
        '&:hover fieldset': {
            borderColor: '#047A9B',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#047A9B',
        },
    },
};

interface AutocompleteProps {
    idx: number;
    value: string;
    type: 'whoCompletes' | 'form';
    placeholder: string;
    options: string[];
    handleChange: (
        idx: number,
        newValue: string,
        type?: 'whoCompletes' | 'form'
    ) => void;
}

const AutocompletePlaceholder = ({
    idx,
    value,
    type,
    placeholder,
    options,
    handleChange,
}: AutocompleteProps) => {
    const handleAutocompleteChange = (
        event: SyntheticEvent<Element, Event>
    ) => {
        handleChange(idx, (event.target as HTMLElement).innerText, type);
    };

    return (
        <Autocomplete
            id='combo-box-demo'
            disablePortal
            disableClearable
            includeInputInList
            value={value}
            options={options.sort()}
            onChange={handleAutocompleteChange}
            popupIcon={<KeyboardArrowDownRoundedIcon />}
            className={style.autocompletePlaceholder}
            componentsProps={customComponentProps}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={null}
                    placeholder={placeholder}
                    sx={customInputStyle}
                />
            )}
        />
    );
};

export default AutocompletePlaceholder;
