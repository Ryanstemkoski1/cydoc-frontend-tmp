import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';

const AcidTestInputBox = ({ callback, label1, subscript, onKeyPress }) => {
    const [value, setValue] = useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
        callback(e.target.value);
    };
    return (
        <div
            className='label-set'
            style={{
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                className='label'
                style={{ color: 'teal', fontWeight: 'bold' }}
            >
                {label1}
            </div>
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
        </div>
    );
};

export default AcidTestInputBox;
