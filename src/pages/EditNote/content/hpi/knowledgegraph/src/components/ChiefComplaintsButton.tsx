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
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { graphClientURL } from 'constants/api.js';

interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    getData = async (chiefComplaint: string) => {
        const response = await axios.get(
            graphClientURL + '/graph/category/' + chiefComplaint + '/4'
        );
        this.props.processKnowledgeGraph(response.data);
    };
    render() {
        const {
            selectChiefComplaint,
            name,
            chiefComplaints,
            hpiHeaders,
            patientView,
        } = this.props;
        return (
            <ToggleButton
                className='tag_text btn-space'
                active={name in chiefComplaints}
                condition={name}
                title={
                    patientView && name in hpiHeaders.parentNodes
                        ? hpiHeaders.parentNodes[name].patientView
                        : name
                }
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

export interface PatientViewProps {
    patientView: boolean;
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps & HpiHeadersProps & PatientViewProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
    patientView: selectPatientViewState(state),
});

type Props = DispatchProps &
    ChiefComplaintsButtonProps &
    ChiefComplaintsProps &
    HpiHeadersProps &
    PatientViewProps;

const mapDispatchToProps = {
    selectChiefComplaint,
    processKnowledgeGraph,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
