import React, { useState, useEffect } from 'react';
import { dsmDiagnosesOptions, dsmDiagnosesInfo } from '@constants/dsmDiagnoses';
import Select from 'react-select';
import AddRowButton from '@components/tools/AddRowButton/AddRowButton';
import './DSMDiagnosisPicker.css';

const DSMDiagnosisPicker = () => {
    const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
    const [secondaryDiagnosis, setSecondaryDiagnosis] = useState('');
    const [showSecondaryDiagnosis, setShowSecondaryDiagnosis] = useState(false);
    const [additionalDiagnosis, setAdditionalDiagnosis] = useState('');
    const [showAdditionalDiagnosis, setShowAdditionalDiagnosis] =
        useState(false);

    useEffect(() => {
        setShowSecondaryDiagnosis(!!primaryDiagnosis);
        setShowAdditionalDiagnosis(!!(primaryDiagnosis && secondaryDiagnosis));
    }, [primaryDiagnosis, secondaryDiagnosis]);

    const handlePrimaryDiagnosisChange = (selectedOption) => {
        setPrimaryDiagnosis(selectedOption ? selectedOption.value : '');
    };

    const handleSecondaryDiagnosisChange = (selectedOption) => {
        setSecondaryDiagnosis(selectedOption ? selectedOption.value : '');
    };

    return (
        <div className='dsmd-picker-container' style={{ width: '50%' }}>
            {searchablePicker(
                'Primary Diagnosis',
                primaryDiagnosis,
                handlePrimaryDiagnosisChange,
                'Select primary diagnosis...'
            )}
            {showSecondaryDiagnosis &&
                searchablePicker(
                    'Secondary Diagnosis',
                    secondaryDiagnosis,
                    handleSecondaryDiagnosisChange,
                    'Select secondary diagnosis...'
                )}
            {showAdditionalDiagnosis && (
                <div style={{ width: '100%' }}>
                    <AddRowButton
                        onClick={() => {
                            console.log('clicked');
                        }}
                        name='Additional diagnosis'
                    />
                </div>
            )}
        </div>
    );
};

const searchablePicker = (label, value, onChange, placeholder) => (
    <div className='form-row'>
        <label className={`floating-label ${value ? 'focused' : ''}`}>
            {label}
        </label>
        <Select
            className='picker-gap'
            options={dsmDiagnosesOptions}
            value={value ? { value, label: value } : null}
            onChange={onChange}
            placeholder={placeholder}
            isSearchable
            isClearable
            styles={{
                control: (provided) => ({
                    ...provided,
                    width: '100%',
                    marginTop: '5px', // Ensure consistent spacing
                    position: 'relative', // Ensure consistent positioning
                }),
                singleValue: (provided) => ({
                    ...provided,
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflow: 'visible',
                }),
            }}
        />
    </div>
);

export default DSMDiagnosisPicker;
