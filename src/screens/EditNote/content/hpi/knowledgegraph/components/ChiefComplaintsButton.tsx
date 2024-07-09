import axios from 'axios';
import ToggleButton from '@components/tools/ToggleButton/ToggleButton';
import { graphClientURL } from '@constants/api';
import { getSelectedChiefComplaints } from '@hooks/useSelectedChiefComplaints';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { setChiefComplaint } from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectChiefComplaintsState } from '@redux/selectors/chiefComplaintsSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import './BodySystemDropdown';

interface OwnProps {
    name: string;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

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
            setChiefComplaint,
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
                onToggleButtonClick={() => {
                    const pinnedChiefComplaints = Object.keys(
                        userSurveyState.nodes['6'].response ?? {}
                    );
                    const pinnedSelectedChiefComplaints =
                        getSelectedChiefComplaints(chiefComplaints).filter(
                            (item) => pinnedChiefComplaints.includes(item)
                        );

                    if (
                        activeItem === 'CCSelection' &&
                        !pinnedSelectedChiefComplaints.includes(name) &&
                        pinnedSelectedChiefComplaints.length >= 3
                    ) {
                        return;
                    }

                    setChiefComplaint(name);

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

const mapStateToProps = (state: CurrentNoteState) => ({
    chiefComplaints: selectChiefComplaintsState(state),
    hpiHeaders: state.hpiHeaders,
    patientView: selectPatientViewState(state),
    activeItem: selectActiveItem(state),
    userSurveyState: selectInitialPatientSurvey(state),
});

const mapDispatchToProps = {
    setChiefComplaint,
    processKnowledgeGraph,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ChiefComplaintsButton);
