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
import { AdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';

interface InputProps {
    node: string;
    additionalSurveyState: AdditionalSurvey;
}

const HandleAgeInput: React.FC<Props> = ({
    hpi,
    node,
    additionalSurveyState,
    handleNumericInputChange,
}) => {
    const [age, setAge] = useState<number | null>(null);
    const [year, setYear] = useState<number | null>(null);
    const currentYear = new Date().getFullYear();

    const calculateAge = (birthdayString: string) => {
        const today = new Date();
        const birthDate = new Date(birthdayString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        // Check if the birthday hasn't occurred yet this year
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    const handleAgeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 150) {
            setAge(value);
            setYear(currentYear - value);
        } else {
            setAge(null);
        }
    };

    const handleYearChange = (e) => {
        const value = e.target.value.trim();
        if (
            value === '' ||
            (value.length === 4 && !isNaN(value) && value.charAt(0) !== '1') ||
            ('2' && parseInt(value) > 0 && parseInt(value) <= currentYear)
        ) {
            setYear(parseInt(value));
            const ageVal = currentYear - parseInt(value);
            if (!isNaN(ageVal) && ageVal >= 0 && ageVal <= 150) {
                setAge(ageVal);
            }
        } else {
            setYear(null);
        }
    };

    // Age field is auto-populated using the patient's birth date
    useEffect(() => {
        if (additionalSurveyState.dateOfBirth) {
            const ageInfo = calculateAge(additionalSurveyState.dateOfBirth);
            setAge(ageInfo);
            setYear(currentYear - ageInfo);
            handleNumericInputChange(node, ageInfo);
        }
    }, [additionalSurveyState.dateOfBirth]);

    useEffect(() => {
        handleNumericInputChange(node, age ? age : undefined);
    }, [age]);

    console.log('response', hpi.nodes[node].response);

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
                <label style={{ marginLeft: '8px', whiteSpace: 'nowrap' }}>
                    years old.
                </label>
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

const mapStateToProps = (state: CurrentNoteState) => ({
    hpi: selectHpiState(state),
    additionalSurveyState: state.additionalSurvey,
});

type Props = HpiStateProps & DispatchProps & InputProps;

const mapDispatchToProps = {
    handleNumericInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleAgeInput);
