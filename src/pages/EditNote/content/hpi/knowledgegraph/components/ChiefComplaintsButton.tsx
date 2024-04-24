import axios from 'axios';
import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import { graphClientURL } from 'constants/api.js';
import { GraphData } from 'constants/hpiEnums';
import { getSelectedChiefCompliants } from 'hooks/useSelectedChiefComplaints';
import { initialSurveyProps } from 'pages/HPI/ChiefComplaintSelection/CCSelection';
import React from 'react';
import { connect } from 'react-redux';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectChiefComplaintsState } from 'redux/selectors/chiefComplaintsSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { ChiefComplaintsProps, HpiHeadersProps } from '../HPIContent';
import './BodySystemDropdown';
interface ChiefComplaintsButtonProps {
    name: string;
}

class ChiefComplaintsButton extends React.Component<Props> {
    getData = async (chiefComplaint: string) => {
        if (!chiefComplaint) {
            return;
        }
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
            activeItem,
            userSurveyState,
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
                onToggleButtonClick={(e: any) => {
                    const pinnedChiefComplaints = Object.keys(
                        userSurveyState.nodes['6'].response ?? {}
                    );
                    const pinnedSelectedChiefComplaints =
                        getSelectedChiefCompliants(chiefComplaints).filter(
                            (item) => pinnedChiefComplaints.includes(item)
                        );

                    if (
                        activeItem === 'CCSelection' &&
                        !pinnedSelectedChiefComplaints.includes(name) &&
                        pinnedSelectedChiefComplaints.length >= 3
                    ) {
                        return;
                    }

                    selectChiefComplaint(name);

                    if (!(name in hpiHeaders?.parentNodes)) {
                        console.error(
                            `Chief Complaint named '${name}' is not present in the Knowledge Graph API response, SYSTEM MIGHT FAIL DUE TO THIS`
                        );
                    }

                    this.getData(
                        Object.keys(hpiHeaders?.parentNodes?.[name])?.[0]
                    );
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

interface ActiveItemProps {
    activeItem: string;
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps &
    initialSurveyProps &
    HpiHeadersProps &
    PatientViewProps &
    ActiveItemProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
    patientView: selectPatientViewState(state),
    activeItem: selectActiveItem(state),
    userSurveyState: selectInitialPatientSurvey(state),
});

type Props = DispatchProps &
    initialSurveyProps &
    ChiefComplaintsButtonProps &
    ChiefComplaintsProps &
    HpiHeadersProps &
    PatientViewProps &
    ActiveItemProps;

const mapDispatchToProps = {
    selectChiefComplaint,
    processKnowledgeGraph,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChiefComplaintsButton);
