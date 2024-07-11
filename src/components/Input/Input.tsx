import React from 'react';
import style from './Input.module.scss';

const Input = ({
    label,
    required = false,
    appearanceSimple = false,
    children,
    ...inputProps
}: any) => {
    return (
        <div
            className={`${style.input} ${
                appearanceSimple && style.inputSimple
            }`}
        >
            {label && (
                <label>
                    {label}
                    <span>{required ? '*' : ''}</span>
                </label>
            )}
            <div className={style.input__wrap}>
                <input {...inputProps} />
                {inputProps?.type == 'date' && (
                    <div className={style.input__icon}>
                        <img src={'/images/calendar.svg'} alt='Calendar' />{' '}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
};
export default Input;
