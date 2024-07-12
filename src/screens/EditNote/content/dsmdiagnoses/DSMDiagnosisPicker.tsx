import React, { useState, useEffect } from 'react';
import { dsmDiagnosesOptions } from '@constants/dsmDiagnoses';
import Select from 'react-select';
import AddRowButton from '@components/tools/AddRowButton/AddRowButton';
import './DSMDiagnosisPicker.css';
import { HpiStateProps } from '@constants/hpiEnums';
import { connect } from 'react-redux';
import { popResponse, PopResponseAction } from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface InputProps {
    node: string;
}

const DSMDiagnosisPicker: React.FC<Props> = ({ node, hpi, popResponse }) => {
    const response = hpi.nodes[node].response;
    const [primaryDiagnosis, setPrimaryDiagnosis] = useState(
        Array.isArray(response) && response[0] ? response[0] : ''
    );
    const [secondaryDiagnosis, setSecondaryDiagnosis] = useState(
        Array.isArray(response) && response[1] ? response[1] : ''
    );
    const [showSecondaryDiagnosis, setShowSecondaryDiagnosis] = useState(false);
    const [additionalDiagnoses, setAdditionalDiagnoses] = useState<string[]>(
        Array.isArray(response) && response.length > 2 ? response.slice(2) : []
    );
    const [showAdditionalDiagnosis, setShowAdditionalDiagnosis] =
        useState(false);

    useEffect(() => {
        const showSecondary = !!primaryDiagnosis;
        const showAdditional = !!secondaryDiagnosis && !!primaryDiagnosis;
        setShowSecondaryDiagnosis(showSecondary);
        setShowAdditionalDiagnosis(showAdditional);
    }, [primaryDiagnosis, secondaryDiagnosis]);

    // update response value
    useEffect(() => {
        let selectedDiagnoses: string[] = [];
        if (primaryDiagnosis !== '') {
            selectedDiagnoses.push(primaryDiagnosis);

            if (secondaryDiagnosis !== '') {
                selectedDiagnoses.push(secondaryDiagnosis);
            }

            if (additionalDiagnoses.length > 0) {
                selectedDiagnoses = [
                    ...selectedDiagnoses,
                    ...additionalDiagnoses.filter(
                        (diagnosis) => diagnosis !== ''
                    ),
                ];
            }
        }

        popResponse(node, selectedDiagnoses);
    }, [primaryDiagnosis, secondaryDiagnosis, additionalDiagnoses]);

    const isDuplicateDiagnosis = (newDiagnosis: string, type: number) => {
        if (!newDiagnosis) return false;

        switch (type) {
            case 1: // For primary diagnosis
                return (
                    newDiagnosis === secondaryDiagnosis ||
                    additionalDiagnoses.includes(newDiagnosis)
                );
            case 2: // For secondary diagnosis
                return (
                    newDiagnosis === primaryDiagnosis ||
                    additionalDiagnoses.includes(newDiagnosis)
                );
            default: // For additional diagnoses
                return (
                    newDiagnosis === primaryDiagnosis ||
                    newDiagnosis === secondaryDiagnosis ||
                    additionalDiagnoses.includes(newDiagnosis)
                );
        }
    };

    const handlePrimaryDiagnosisChange = async (selectedOption: any) => {
        const newDiagnosis = selectedOption ? selectedOption.value : '';
        if (isDuplicateDiagnosis(newDiagnosis, 1)) {
            window.alert(
                'You have selected the same diagnosis twice. Please select a different one.'
            );
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        setPrimaryDiagnosis(newDiagnosis);
    };

    const handleSecondaryDiagnosisChange = async (selectedOption: any) => {
        const newDiagnosis = selectedOption ? selectedOption.value : '';
        if (isDuplicateDiagnosis(newDiagnosis, 2)) {
            window.alert(
                'You have selected the same diagnosis twice. Please select a different one.'
            );
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        setSecondaryDiagnosis(newDiagnosis);
    };

    const handleAddAdditionalDiagnosis = async () => {
        if (
            additionalDiagnoses.filter((diagnosis) => diagnosis === '')
                .length === 0
        ) {
            await new Promise((resolve) => setTimeout(resolve, 0));
            setAdditionalDiagnoses([...additionalDiagnoses, '']);
        } else {
            window.alert('You have empty selection in Additonal Diagnosis.');
        }
    };

    const handleAdditionalDiagnosisChange = async (
        selectedOption: any,
        index: number
    ) => {
        const newDiagnosis = selectedOption ? selectedOption.value : '';
        if (isDuplicateDiagnosis(newDiagnosis, 3)) {
            window.alert(
                'You have selected the same diagnosis twice. Please select a different one.'
            );
            return;
        }

        const updatedDiagnoses = [...additionalDiagnoses];
        if (selectedOption === null) {
            updatedDiagnoses.splice(index, 1); // Remove the diagnosis at the specified index
        } else {
            updatedDiagnoses[index] = newDiagnosis;
        }

        await new Promise((resolve) => setTimeout(resolve, 0));
        setAdditionalDiagnoses(updatedDiagnoses);
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
            {showAdditionalDiagnosis &&
                additionalDiagnoses.map((diagnosis, index) =>
                    searchablePicker(
                        `Additional Diagnosis ${index + 1}`,
                        diagnosis,
                        (selectedOption: any) =>
                            handleAdditionalDiagnosisChange(
                                selectedOption,
                                index
                            ),
                        'Select additional diagnosis...'
                    )
                )}
            {showAdditionalDiagnosis && (
                <div style={{ width: '100%' }}>
                    <AddRowButton
                        onClick={handleAddAdditionalDiagnosis}
                        name='Additional Diagnosis'
                    />
                </div>
            )}
        </div>
    );
};

const searchablePicker = (
    label: string,
    value: string,
    onChange,
    placeholder: string
) => (
    <div className='form-row' key={label}>
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

interface DispatchProps {
    popResponse: (medId: string, conditionIds: string[]) => PopResponseAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & InputProps;

const mapDispatchToProps = {
    popResponse,
};

export default connect(mapStateToProps, mapDispatchToProps)(DSMDiagnosisPicker);
