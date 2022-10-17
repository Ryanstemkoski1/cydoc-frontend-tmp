import React from 'react';
import './BodySystemDropdown';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ToggleButton from 'components/tools/ToggleButton';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import { ChiefComplaintsProps, HpiHeadersProps } from '../../HPIContent';
import { GraphData } from 'constants/hpiEnums';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from 'redux/actions/hpiActions';
import axios from 'axios';

interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    getData = async (chiefComplaint: string) => {
        const response = await axios.get(
            'https://cydocgraph.herokuapp.com/graph/category/' +
                chiefComplaint +
                '/4'
        );
        const { data } = response;
        this.props.processKnowledgeGraph(data);
    };
    render() {
        const {
            selectChiefComplaint,
            name,
            chiefComplaints,
            hpiHeaders,
        } = this.props;
        return (
            <ToggleButton
                className='tag_text'
                active={name in chiefComplaints}
                condition={name}
                title={name}
                onToggleButtonClick={() => {
                    selectChiefComplaint(name);
                    this.getData(Object.keys(hpiHeaders.parentNodes[name])[0]);
                }}
            />
        );
    }
}

interface DispatchProps {
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & HpiHeadersProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
});

type Props = DispatchProps &
    ChiefComplaintsButtonProps &
    ChiefComplaintsProps &
    HpiHeadersProps;

const mapDispatchToProps = {
    selectChiefComplaint,
    processKnowledgeGraph,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
