import * as React from 'react';
import style from './SelectPlaceholder.module.scss';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 10,
        maxHeight: 52,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        fontSize: 16,
        fontWeight: 400,
        padding: '14px 12px',
        border: '1px solid #0000003B',
        color: '#000000DE',
        transition: theme.transitions.create([
            'border-color',
            'box-shadow',
            'border-width',
        ]),
        boxSizing: 'border-box',
        '&:hover': {
            borderColor: '#047A9B',
        },
    },
    '&.Mui-focused .MuiInputBase-input': {
        borderColor: '#047A9B',
        borderRadius: '10px',
        borderWidth: 2,
    },
    '&.Mui-open .MuiInputBase-input': {
        borderColor: '#047A9B',
        borderWidth: 2,
    },
}));

const MenuProps = {
    PaperProps: {
        style: {
            marginTop: '4px',
            width: 250,
            maxHeight: 200,
            borderRadius: '10px',
        },
    },
    sx: {
        '& .MuiMenu-list': {
            padding: 0,
        },
        '& .MuiMenuItem-root': {
            padding: '12px 16px',
            fontFamily: 'Nunito',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            color: '#383838',

            '&:hover': {
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
    classes: {
        paper: 'Mui-open',
    },
};

interface SelectPlaceholderProps {
    idx: number;
    value: string;
    placeholder: string;
    items: string[];
    type: 'whoCompletes' | 'form';
    handleChange: (
        idx: number,
        newValue: string,
        type: 'whoCompletes' | 'form'
    ) => void;
}

const SelectPlaceholder = ({
    idx,
    value,
    items,
    type,
    placeholder,
    handleChange,
}: SelectPlaceholderProps) => {
    const CustomPlaceholder = () => (
        <Typography className={style.placeholder}>{placeholder}</Typography>
    );

    const handleValue = (value: string) => {
        return value ? value : <CustomPlaceholder />;
    };

    return (
        <FormControl sx={{ bgcolor: 'white' }}>
            <Select
                displayEmpty
                value={value}
                onChange={(event) =>
                    handleChange(idx, event.target.value, type)
                }
                renderValue={handleValue}
                MenuProps={MenuProps}
                IconComponent={KeyboardArrowDownRoundedIcon}
                inputProps={{ 'aria-label': 'Without label' }}
                className={style.select}
                input={<BootstrapInput />}
            >
                {items.map((item) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectPlaceholder;
