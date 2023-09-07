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
            <input {...inputProps} />
            {children}
        </div>
    );
};
export default Input;
