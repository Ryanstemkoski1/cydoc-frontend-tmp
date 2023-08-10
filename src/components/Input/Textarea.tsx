import React from 'react';
import style from './Input.module.scss';

const TextArea = ({
    label,
    mobileHeight = false,
    value,
    onChange,
    ...inputProps
}: any) => {
    return (
        <div className={`${style.input} ${mobileHeight && style.inputMobile}`}>
            {label && <label>{label}</label>}
            <textarea
                className='scrollbar'
                onChange={(e) => {
                    onChange(e, { value: e.target.value });
                }}
                {...inputProps}
            >
                {value}
            </textarea>
        </div>
    );
};
export default TextArea;
