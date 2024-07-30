import React from 'react';
import style from './CustomTextField.module.scss';
import { Box, TextField, Typography } from '@mui/material';

const CustomTextField = ({
    label,
    required = false,
    appearanceSimple = false,
    children,
    ...inputProps
}: any) => {
    return (
        <Box className={style.input}>
            {label && (
                <Typography component='p'>
                    {label}
                    <span>{required ? '*' : ''}</span>
                </Typography>
            )}
            <Box>
                <TextField
                    {...inputProps}
                    id='outlined-required'
                    className={style.input__wrap}
                />
                {inputProps?.type == 'date' && (
                    <Box
                        sx={label && { top: '44px !important' }}
                        className={style.input__icon}
                    >
                        <img src={'/images/calendar.svg'} alt='Calendar' />{' '}
                    </Box>
                )}
            </Box>
            {children}
        </Box>
    );
};
export default CustomTextField;
