import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { HpiStateProps, NumberInput } from '@constants/hpiEnums';
import { connect } from 'react-redux';
import {
    HandleNumericInputChangeAction,
    handleNumericInputChange,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
// import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
// import { PatientInformationState } from '@redux/reducers/patientInformationReducer';

interface InputProps {
    node: string;
}

const HandleAgeInput: React.FC<Props> = ({ node }) => {
    const [age, setAge] = useState<number | null>(null);
    const [year, setYear] = useState<number | null>(null);
    const currentYear = new Date().getFullYear();
    const minValidYear = 1900;

    // console.log('checking patientInformationState', patientInformationState);

    useEffect(() => {
        if (
            year &&
            !isNaN(year) &&
            minValidYear <= year &&
            year <= currentYear
        ) {
            setAge(currentYear - year);
        } else {
            setAge(null);
        }
    }, [year]);

    const handleAgeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 150) {
            setAge(value);
        } else {
            setAge(null);
        }
    };

    const handleYearChange = (e) => {
        const value = e.target.value.trim(); // Trim to prevent leading spaces affecting validation
        const currentYear = new Date().getFullYear();

        // Check if input value is a valid number and does not start with '1'
        if (
            value === '' ||
            (value.length === 4 && !isNaN(value) && value.charAt(0) !== '1') ||
            '2'
        ) {
            setYear(parseInt(value));
        } else {
            setYear(null);
        }
    };

    return (
        <Grid container spacing={2} sx={{ width: '80%' }}>
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    size='small'
                    label='Age'
                    value={age === null ? '' : age.toString()}
                    onChange={handleAgeChange}
                    type='number'
                    InputProps={{
                        inputProps: {
                            maxLength: 3,
                            min: 0,
                            max: 150,
                            style: { width: '8ch' },
                        },
                    }}
                />
                <label style={{ marginLeft: '8px' }}>years old.</label>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    size='small'
                    label='Year'
                    placeholder='YYYY'
                    value={year === null ? '' : year.toString()}
                    onChange={handleYearChange}
                    type='number'
                    inputProps={{
                        maxLength: 4,
                        style: { width: '8ch' },
                    }}
                />
            </Grid>
        </Grid>
    );
};

interface DispatchProps {
    handleNumericInputChange: (
        medId: string,
        input: NumberInput
    ) => HandleNumericInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & InputProps;

const mapDispatchToProps = {
    handleNumericInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleAgeInput);
