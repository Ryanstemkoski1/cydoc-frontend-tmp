/* eslint-disable no-console */
import Input from '@components/Input/Input';
import { HpiStateProps, NumberInput } from '@constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    HandleNumericInputChangeAction,
    handleNumericInputChange,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface HandleNumericInputProps {
    node: string;
}

class HandleNumericInput extends React.Component<Props> {
    render() {
        const { hpi, node, handleNumericInputChange } = this.props;
        const values = hpi.nodes[node];
        const value = values.response;
        const question = values.text;
        return (
            <Input
                key={question}
                id={'numeric-input'}
                type={'number'}
                pattern={'[0-9]*'} // for numeric keypad on iOS
                value={typeof value == 'number' ? value : undefined}
                min={0}
                onChange={(_e: any) => {
                    handleNumericInputChange(node, parseInt(_e.target.value));
                }}
            />
        );
    }
}

interface DispatchProps {
    handleNumericInputChange: (
        medId: string,
        input: NumberInput
    ) => HandleNumericInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & HandleNumericInputProps;

const mapDispatchToProps = {
    handleNumericInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleNumericInput);
