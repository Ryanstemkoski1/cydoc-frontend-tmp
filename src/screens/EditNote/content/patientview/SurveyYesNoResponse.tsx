import axios from 'axios';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { setChiefComplaint } from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { initialSurveyYesNo } from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { UserSurveyState } from '@redux/reducers/userViewReducer';
import { selectChiefComplaintsState } from '@redux/selectors/chiefComplaintsSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from '../hpi/knowledgegraph/HPIContent';

interface SurveyYesNoResponseProps {
    id: string;
}

export interface InitialSurveyProps {
    userSurveyState: UserSurveyState;
}

type OwnProps = InitialSurveyProps &
    SurveyYesNoResponseProps &
    ChiefComplaintsProps &
    HpiHeadersProps;

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

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
        const { userSurveyState, id, hpiHeaders, setChiefComplaint } =
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
                setChiefComplaint(key);
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

const mapStateToProps = (
    state: CurrentNoteState
): InitialSurveyProps & ChiefComplaintsProps & HpiHeadersProps => {
    return {
        chiefComplaints: selectChiefComplaintsState(state),
        hpiHeaders: state.hpiHeaders,
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

const mapDispatchToProps = {
    initialSurveyYesNo,
    processKnowledgeGraph,
    setChiefComplaint,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SurveyYesNoResponse);
