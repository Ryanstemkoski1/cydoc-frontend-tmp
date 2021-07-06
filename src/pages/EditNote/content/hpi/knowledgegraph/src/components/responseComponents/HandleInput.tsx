import React from 'react';
import { Input } from 'semantic-ui-react';
import '../../css/HandleInput.css';
import { HpiStateProps } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import {
    handleInputChange,
    HandleInputChangeAction,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

interface HandleInputProps {
    node: string;
}

class HandleInput extends React.Component<Props> {
    render() {
        const { hpi, node, handleInputChange } = this.props;
        return (
            <Input
                id={'handle-input'}
                onChange={(_e, data) => handleInputChange(node, data.value)}
                value={hpi.nodes[node].response}
            />
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(HandleInput);
