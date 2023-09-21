import axios from 'axios';
import { ActiveItemProps } from 'components/navigation/NavMenu';
import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { YesNoResponse } from 'constants/enums';
import { GraphData, ResponseTypes } from 'constants/hpiEnums';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/HPIContent';
import ChiefComplaintsButton, {
    PatientViewProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import InputTextOrDateResponse from 'pages/EditNote/content/patientview/InputTextOrDateResponse';
import SurveyYesNoResponse from 'pages/EditNote/content/patientview/SurveyYesNoResponse';
import patientViewHeaders from 'pages/EditNote/content/patientview/constants/patientViewHeaders.json';
import React from 'react';
import { connect } from 'react-redux';
import { CHIEF_COMPLAINTS } from 'redux/actions/actionTypes';
import {
    GoBackToAdditionalSurvey,
    UpdateAdditionalSurveyAction,
    resetAdditionalSurveyPage,
    updateAdditionalSurveyDetails,
} from 'redux/actions/additionalSurveyActions';
import {
    ProcessKnowledgeGraphAction,
    processKnowledgeGraph,
} from 'redux/actions/hpiActions';
import {
    SaveHpiHeaderAction,
    saveHpiHeader,
} from 'redux/actions/hpiHeadersActions';
import {
    InitialSurveySearchAction,
    ProcessSurveyGraphAction,
    initialSurveySearch,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import { HpiHeadersState } from 'redux/reducers/hpiHeadersReducer';
import { isSelectOneResponse } from 'redux/reducers/hpiReducer';
import {
    InitialQuestionsState,
    isChiefComplaintsResponse,
    userSurveyState,
} from 'redux/reducers/userViewReducer';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import { Search } from 'semantic-ui-react';
import style from './PreHPI.module.scss';
import { NotificationTypeEnum } from 'components/tools/Notification/Notification';

interface InitialSurveyState {
    error: boolean;
    searchVal: string;
    message: string;
}

interface InitialSurveyComponentProps {
    continue: (e: any) => void;
    onPreviousClick: () => void;
    notification: {
        setNotificationMessage: (message: string) => void;
        setNotificationType: (type: NotificationTypeEnum) => void;
    };
}

class PreHPI extends React.Component<Props, InitialSurveyState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: false,
            searchVal: '',
            message: '',
        };
    }

    continue = (e: any) => this.props.continue(e);

    onPrevClick = () => {
        this.setState({ error: false });
        this.props.onPreviousClick();
    };

    onNextClick = (e: any) => {
        const { setNotificationType, setNotificationMessage } =
            this.props.notification;

        if (!this.props.userSurveyState.nodes['8'].response) {
            setNotificationType(NotificationTypeEnum.ERROR);
            setNotificationMessage(
                'Please confirm the date of your appointment.'
            );
            return;
        }

        this.continue(e);
    };

    getData = async (complaint: string) => {
        const { parentNodes } = this.props.hpiHeaders,
            chiefComplaint = Object.keys(parentNodes[complaint])[0],
            response = await axios.get(
                'https://cydocgraph.herokuapp.com/graph/category/' +
                    chiefComplaint +
                    '/4'
            ),
            { data } = response;

        this.props.processKnowledgeGraph(data);
        // This code wasn't being used so I commented it out...
        // { graph, /* nodes, */ edges } = data as GraphData,
        // parentNode = parentNodes[complaint][chiefComplaint];
        // const childNodes = graph[parentNode]
        //     .map((edge: number) => [
        //         edges[edge.toString()].toQuestionOrder.toString(),
        //         edges[edge.toString()].to,
        //     ])
        //     .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
        //     .map(([, /* _questionOrder, */ medId]) => medId);
    };

    renderSwitch = (id: string) => {
        const { userSurveyState, patientView, initialSurveySearch } =
                this.props,
            currEntry = userSurveyState.nodes[id],
            { bodySystems, parentNodes } = this.props.hpiHeaders;
        // map through all complaints on the HPI and create search resuls
        const getRes = () => {
            const filterResults: object[] = [];
            Object.entries(bodySystems).forEach((grouping) => {
                grouping[1].forEach((complaint) => {
                    const displayPatientView =
                            patientView &&
                            parentNodes[complaint].patientView !== 'HIDDEN',
                        title = displayPatientView
                            ? parentNodes[complaint].patientView
                            : complaint,
                        toCompare = title.toString().toLowerCase();
                    if (
                        complaint !== 'HIDDEN' &&
                        toCompare.includes(this.state.searchVal.toLowerCase())
                    ) {
                        const temp = {
                            title: title,
                            onClick: () => {
                                currentNoteStore.dispatch({
                                    type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                                    payload: {
                                        disease: complaint,
                                    },
                                });
                                this.getData(complaint);
                                initialSurveySearch(id, complaint);
                            },
                        };
                        filterResults.push(temp);
                    }
                });
            });
            return filterResults;
        };
        switch (currEntry.responseType) {
            case ResponseTypes.YES_NO:
                return <SurveyYesNoResponse id={id} />;
            case ResponseTypes.SELECTONE:
                return isSelectOneResponse(currEntry.response)
                    ? Object.keys(currEntry.response).map((condition) => (
                          <ChiefComplaintsButton
                              key={condition}
                              name={condition}
                          />
                      ))
                    : '';
            case 'SEARCH':
                return (
                    <div>
                        <Search
                            size='large'
                            placeholder='Type in a condition'
                            noResultsMessage
                            className='hpi-search-bar'
                            minCharacters={2}
                            onSearchChange={(event) => {
                                const target =
                                    event.target as HTMLTextAreaElement;
                                this.setState({ searchVal: target.value });
                            }}
                            value={this.state.searchVal}
                            results={getRes()}
                        />
                        {isChiefComplaintsResponse(currEntry.response)
                            ? Object.keys(currEntry.response).map(
                                  (complaint) => (
                                      <ChiefComplaintsButton
                                          key={complaint}
                                          name={complaint}
                                      />
                                  )
                              )
                            : ''}
                    </div>
                );
            case ResponseTypes.TIME3DAYS:
                return (
                    <InputTextOrDateResponse
                        id={id}
                        type={'date'}
                        defaultValue={
                            userSurveyState.nodes[id].response as string
                        }
                        required={true}
                        placeholder={'DD/MM/YYYY'}
                        name={'dateOfAppointment'}
                    />
                );
            case ResponseTypes.SHORT_TEXT: {
                return (
                    <InputTextOrDateResponse
                        id={id}
                        type={'text'}
                        defaultValue={
                            userSurveyState.nodes[id].response as string
                        }
                        required={false}
                        placeholder={'Last Name'}
                        name={'lastNameOfClinic'}
                    />
                );
            }
            default:
                return;
        }
    };

    render() {
        const { userSurveyState } = this.props,
            nodes = patientViewHeaders.parentNodes,
            nodeKey = Object.values(Object.entries(nodes)[0][1])[0],
            questions = initialQuestions as InitialQuestionsState;
        const initialSurvey =
            nodeKey in questions.nodes
                ? questions.graph[nodeKey].map((key) => {
                      return (
                          <div
                              className={`${style.preHpi__item} ${style.preHpi__itemCol} flex-wrap align-center justify-between`}
                              key={questions.nodes[key].text}
                          >
                              <p>{questions.nodes[key].text}</p>
                              <aside>
                                  {Object.keys(userSurveyState.nodes).length
                                      ? this.renderSwitch(key)
                                      : ''}
                              </aside>
                          </div>
                      );
                  })
                : '';

        return (
            <>
                <div className={style.preHpi}>
                    <div className={`${style.preHpi__items} flex-wrap`}>
                        {initialSurvey}
                    </div>
                    <NavigationButton
                        previousClick={this.onPrevClick}
                        nextClick={this.onNextClick}
                    />
                </div>
            </>
        );
    }
}

export interface initialSurveyProps {
    userSurveyState: userSurveyState;
}

export interface AdditionalSurveyProps {
    additionalSurvey: additionalSurvey;
}

const mapStateToProps = (
    state: CurrentNoteState
): initialSurveyProps &
    HpiHeadersProps &
    ChiefComplaintsProps &
    ActiveItemProps &
    AdditionalSurveyProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
        hpiHeaders: state.hpiHeaders,
        activeItem: selectActiveItem(state),
        chiefComplaints: state.chiefComplaints,
        additionalSurvey: state.additionalSurvey,
    };
};

interface DispatchProps {
    processSurveyGraph: (
        graph: InitialQuestionsState
    ) => ProcessSurveyGraphAction;
    saveHpiHeader: (data: HpiHeadersState) => SaveHpiHeaderAction;
    processKnowledgeGraph: (
        graphData: GraphData
    ) => ProcessKnowledgeGraphAction;
    initialSurveySearch: (
        uid: string,
        chiefComplaint: string
    ) => InitialSurveySearchAction;
    updateAdditionalSurveyDetails: (
        legalFirstName: string,
        legalLastName: string,
        legalMiddleName: string,
        socialSecurityNumber: string,
        dateOfBirth: string,
        initialSurveyState: number
    ) => UpdateAdditionalSurveyAction;
    resetAdditionalSurveyPage: () => GoBackToAdditionalSurvey;
}

type Props = HpiHeadersProps &
    InitialSurveyComponentProps &
    initialSurveyProps &
    DispatchProps &
    HpiHeadersProps &
    PatientViewProps &
    ChiefComplaintsProps &
    AdditionalSurveyProps;

const mapDispatchToProps = {
    processSurveyGraph,
    saveHpiHeader,
    processKnowledgeGraph,
    initialSurveySearch,
    updateAdditionalSurveyDetails,
    resetAdditionalSurveyPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreHPI);
