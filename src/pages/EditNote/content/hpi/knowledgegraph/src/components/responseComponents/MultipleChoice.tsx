import React from 'react';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import {
    multipleChoiceHandleClick,
    MultipleChoiceHandleClickAction,
} from 'redux/actions/hpiActions';
import { isStringArray } from 'redux/reducers/hpiReducer';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';

interface MultipleChoiceProps {
    node: string;
    name: string;
}

class MultipleChoice extends React.Component<Props> {
    render() {
        const { hpi, node, name, multipleChoiceHandleClick } = this.props;
        const response = hpi.nodes[node].response;
        const included = isStringArray(response) && response.includes(name);
        return (
            <ToggleButton
                className='button_question'
                active={included}
                condition={name}
                title={name}
                onToggleButtonClick={(): MultipleChoiceHandleClickAction =>
                    multipleChoiceHandleClick(node, name)
                }
            />
        );
    }
}

interface DispatchProps {
    multipleChoiceHandleClick: (
        medId: string,
        name: string
    ) => MultipleChoiceHandleClickAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & MultipleChoiceProps;

const mapDispatchToProps = {
    multipleChoiceHandleClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleChoice);
