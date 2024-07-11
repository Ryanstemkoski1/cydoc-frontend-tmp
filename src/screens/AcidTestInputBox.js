import React, { useState } from 'react';
import Input from 'components/Input/Input';

const AcidTestInputBox = ({ callback, label1, subscript, onKeyPress }) => {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
        callback(e.target.value);
    };
    return (
        <>
            <label>{label1}</label>

            <Input
                type='number'
                step='.1'
                size='mini'
                className='extra-small-input'
                onChange={handleChange}
                value={value}
                onKeyPress={onKeyPress}
            />
            <div className='normal-range'>{subscript}</div>
        </>
    );
};

export default AcidTestInputBox;
