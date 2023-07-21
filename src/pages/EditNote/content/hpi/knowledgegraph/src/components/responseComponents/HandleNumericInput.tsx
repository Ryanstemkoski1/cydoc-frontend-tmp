import React from 'react';
import { Input } from 'semantic-ui-react';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps, NumberInput } from 'constants/hpiEnums';
import {
    handleNumericInputChange,
    HandleNumericInputChangeAction,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

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
                onChange={(_e, data) =>
                    handleNumericInputChange(node, parseInt(data.value))
                }
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
