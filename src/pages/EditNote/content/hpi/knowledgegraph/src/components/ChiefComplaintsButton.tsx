import React from 'react';
import './BodySystemDropdown';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from 'redux/actions/chiefComplaintsActions';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
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
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
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
            activeItem,
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
                    const selectedChiefComplaints = Object.keys(
                        chiefComplaints
                    ).filter(
                        (item) =>
                            item !== ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM
                    );

                    if (
                        activeItem === 'CCSelection' &&
                        !selectedChiefComplaints.includes(name) &&
                        selectedChiefComplaints.length === 3
                    ) {
                        return;
                    }

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

interface ActiveItemProps {
    activeItem: string;
}

const mapStateToProps = (
    state: CurrentNoteState
): ChiefComplaintsProps &
    HpiHeadersProps &
    PatientViewProps &
    ActiveItemProps => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
    patientView: selectPatientViewState(state),
    activeItem: selectActiveItem(state),
});

type Props = DispatchProps &
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
