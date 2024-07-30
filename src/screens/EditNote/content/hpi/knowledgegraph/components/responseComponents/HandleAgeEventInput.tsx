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

const HandleAgeEventInput: React.FC<Props> = ({
    hpi,
    node,
    additionalSurveyState,
    handleNumericInputChange,
}) => {
    const response = hpi.nodes[node].response;
    const currentYear = new Date().getFullYear();
    const [age, setAge] = useState<number | null>(
        response ? Number(response) : null
    );
    const [year, setYear] = useState<number | null>(
        response ? currentYear - Number(response) : null
    );
    const [birthday, setBirthday] = useState<string | undefined>(undefined);

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
            const dateParts = additionalSurveyState.dateOfBirth.split('-');
            const date = new Date(
                parseInt(dateParts[0]), // Year
                parseInt(dateParts[1], 10) - 1, // Month (0-based index)
                parseInt(dateParts[2]) // Day
            );

            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            const formattedDate = date.toLocaleDateString('en-US', options);
            setBirthday(formattedDate);
        }
    }, [additionalSurveyState.dateOfBirth]);

    useEffect(() => {
        handleNumericInputChange(node, age ? age : undefined);
    }, [age]);

    return (
        <div>
            <Grid
                item
                xs={6}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '15px',
                }}
            >
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
                <label
                    style={{
                        marginLeft: '8px',
                        whiteSpace: 'nowrap',
                        marginRight: '8px',
                    }}
                >
                    years old in
                </label>
                <TextField
                    size='small'
                    label='Event Year'
                    placeholder='YYYY'
                    value={year === null ? '' : year.toString()}
                    onChange={handleYearChange}
                    type='number'
                    inputProps={{
                        maxLength: 8,
                        style: { width: '12ch' },
                    }}
                />
            </Grid>
            <Grid
                item
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '5px',
                }}
            >
                <p>
                    based on reported birthday{' '}
                    {birthday ? birthday : 'January 1, 1990'}
                </p>
            </Grid>
        </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HandleAgeEventInput);
