import axios from 'axios';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import { GraphData } from 'constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    selectChiefComplaint,
    SelectChiefComplaintAction,
} from '@redux/actions/chiefComplaintsActions';
import {
    processKnowledgeGraph,
    ProcessKnowledgeGraphAction,
} from '@redux/actions/hpiActions';
import {
    initialSurveyYesNo,
    InitialSurveyYesNoAction,
} from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { userSurveyState } from '@redux/reducers/userViewReducer';
import { selectChiefComplaintsState } from '@redux/selectors/chiefComplaintsSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from '../hpi/knowledgegraph/HPIContent';

interface SurveyYesNoResponseProps {
    id: string;
}

class SurveyYesNoResponse extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    getData = async (chiefComplaint: string) => {
        const response = await axios.get(
            'https://cydocgraph.herokuapp.com/graph/category/' +
                chiefComplaint +
                '/4'
        );
        this.props.processKnowledgeGraph(response.data);
    };

    addChiefComplaint(action: YesNoResponse) {
        const { userSurveyState, id, hpiHeaders, selectChiefComplaint } =
                this.props,
            category = userSurveyState.nodes[id].category,
            prevVal = userSurveyState.nodes[id].response;
        if (category.length) {
            const key = Object.keys(hpiHeaders.parentNodes).find(
                (k) => Object.keys(hpiHeaders.parentNodes[k])[0] == category
            );
            if (
                key &&
                !(prevVal == YesNoResponse.No && action == YesNoResponse.No) &&
                !(prevVal == YesNoResponse.None && action == YesNoResponse.No)
            ) {
                selectChiefComplaint(key);
            }
        }
    }

    render() {
        const { userSurveyState, id, initialSurveyYesNo } = this.props;
        return (
            <div>
                <YesAndNo
                    yesButtonActive={
                        userSurveyState.nodes[id].response == YesNoResponse.Yes
                    }
                    handleYesButtonClick={() => {
                        this.addChiefComplaint(YesNoResponse.Yes);
                        initialSurveyYesNo(id, YesNoResponse.Yes);
                        const category = userSurveyState.nodes[id].category;
                        if (category.length) this.getData(category);
                    }}
                    noButtonActive={
                        userSurveyState.nodes[id].response == YesNoResponse.No
                    }
                    handleNoButtonClick={() => {
                        this.addChiefComplaint(YesNoResponse.No);
                        initialSurveyYesNo(id, YesNoResponse.No);
                    }}
                />
            </div>
        );
    }
}

export interface initialSurveyProps {
    userSurveyState: userSurveyState;
}

const mapStateToProps = (
    state: CurrentNoteState
): initialSurveyProps & ChiefComplaintsProps & HpiHeadersProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
        chiefComplaints: selectChiefComplaintsState(state),
        hpiHeaders: state.hpiHeaders,
    };
};

interface DispatchProps {
    initialSurveyYesNo: (
        uid: string,
        response: YesNoResponse
    ) => InitialSurveyYesNoAction;
    selectChiefComplaint: (disease: string) => SelectChiefComplaintAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
}

type Props = initialSurveyProps &
    SurveyYesNoResponseProps &
    DispatchProps &
    ChiefComplaintsProps &
    HpiHeadersProps;

const mapDispatchToProps = {
    initialSurveyYesNo,
    selectChiefComplaint,
    processKnowledgeGraph,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyYesNoResponse);
