import React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import '../../css/HandleInput.css';
import { HpiStateProps } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import {
    handleInputChange,
    HandleInputChangeAction,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import '../../css/HandleInput.css';

interface HandleInputProps {
    node: string;
}

class HandleInput extends React.Component<Props> {
    render() {
        const { hpi, node, handleInputChange } = this.props;
        return (
            <Form>
                <TextArea
                    className='handle-input'
                    id='handle-input'
                    onChange={(_e, data) =>
                        handleInputChange(node, data.value as string)
                    }
                    value={hpi.nodes[node].response as string}
                />
            </Form>
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
