import ToggleButton from '@components/tools/ToggleButton/ToggleButton';
import { HpiStateProps } from '@constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    singleMultipleChoiceHandleClick,
    SingleMultipleChoiceHandleClickAction,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { isSelectOneResponse } from '@redux/reducers/hpiReducer';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface MultipleChoiceProps {
    node: string;
    name: string;
}

class MultipleChoice extends React.Component<Props> {
    render() {
        const { hpi, node, name, singleMultipleChoiceHandleClick } = this.props;
        const response = hpi.nodes[node].response;
        const included = isSelectOneResponse(response) && response[name];
        return (
            <ToggleButton
                className='button_question'
                active={included}
                condition={name}
                title={name}
                onToggleButtonClick={(): SingleMultipleChoiceHandleClickAction =>
                    singleMultipleChoiceHandleClick(node, name)
                }
            />
        );
    }
}

interface DispatchProps {
    singleMultipleChoiceHandleClick: (
        medId: string,
        name: string
    ) => SingleMultipleChoiceHandleClickAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & MultipleChoiceProps;

const mapDispatchToProps = {
    singleMultipleChoiceHandleClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(MultipleChoice);
