import { HpiStateProps } from '@constants/hpiEnums';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    handleInputChange,
    HandleInputChangeAction,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface HandleInputProps {
    node: string;
}

const HandlePronounInput: React.FC<Props> = ({
    hpi,
    node,
    handleInputChange,
}) => {
    const [pronoun, setPronoun] = useState(hpi.nodes[node].response as string);

    console.log('checking', hpi.nodes[node].response);
    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                onChange={(e, value) => {
                    handleInputChange(node, e.target.value as string);
                    setPronoun(e.target.value as string);
                }}
            >
                <FormControlLabel value='He' control={<Radio />} label='He' />
                <FormControlLabel value='She' control={<Radio />} label='She' />
                <FormControlLabel
                    value='They'
                    control={<Radio />}
                    label='They'
                />
            </RadioGroup>
        </FormControl>
    );
};

interface DispatchProps {
    handleInputChange: (
        medId: string,
        textInput: string
    ) => HandleInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & HandleInputProps;

const mapDispatchToProps = {
    handleInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandlePronounInput);
