import axios from 'axios';
import { YesNoResponse } from 'constants/enums';
import { GraphData, ResponseTypes } from 'constants/hpiEnums';
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
    initialQuestionsState,
    isChiefComplaintsResponse,
    userSurveyState,
} from 'redux/reducers/userViewReducer';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import {
    Button,
    Container,
    Grid,
    Icon,
    Message,
    Search,
    Segment,
} from 'semantic-ui-react';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from '../hpi/knowledgegraph/HPIContent';
import { hpiHeaders } from '../hpi/knowledgegraph/src/API';
import ChiefComplaintsButton, {
    PatientViewProps,
} from '../hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import DetailsPage from './AdditionalSurvey';
import InputTextOrDateResponse from './InputTextOrDateResponse';
import SurveyYesNoResponse from './SurveyYesNoResponse';
import UserInfoForm from './UserInfoForm';
import initialQuestions from './constants/initialQuestions.json';
import patientViewHeaders from './constants/patientViewHeaders.json';
import './InitialSurvey.css';

interface InitialSurveyState {
    activeItem: number;
    error: boolean;
    searchVal: string;
    tempLegalFirstName: string;
    tempLegalLastName: string;
    tempSocialSecurityNumber: string;
    tempDateOfBirth: string;
    message: string;
}

interface InitialSurveyComponentProps {
    continue: (e: any) => void;
}

class InitialSurvey extends React.Component<Props, InitialSurveyState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activeItem: 0,
            error: false,
            searchVal: '',
            tempLegalFirstName: '',
            tempLegalLastName: '',
            tempSocialSecurityNumber: '',
            tempDateOfBirth: '',
            message: '',
        };
    }

    counter() {
        const { userSurveyState, chiefComplaints } = this.props;
        const res1 = userSurveyState.nodes['6'],
            res2 = userSurveyState.nodes['7'],
            q1_count = isSelectOneResponse(res1.response)
                ? Object.keys(res1.response).filter((k) =>
                      Object.keys(chiefComplaints).includes(k)
                  ).length
                : 0,
            q2_count = isChiefComplaintsResponse(res2.response)
                ? Object.keys(res2.response).length
                : 0;
        return [q1_count, q2_count];
    }

    componentDidMount() {
        const { userSurveyState, processSurveyGraph, saveHpiHeader } =
            this.props;
        if (
            !Object.keys(userSurveyState.graph).length &&
            !Object.keys(userSurveyState.nodes).length &&
            !Object.keys(userSurveyState.order).length
        )
            processSurveyGraph(initialQuestions as initialQuestionsState);
        else
            this.setState({
                activeItem: Object.keys(userSurveyState.nodes).every(
                    (key) =>
                        userSurveyState.nodes[key].response !=
                        YesNoResponse.None
                )
                    ? 1
                    : 0,
            });
        if (hpiHeaders) {
            const data = hpiHeaders;
            data.then((res) => saveHpiHeader(res.data));
        }
    }

    continue = (e: any) => this.props.continue(e);

    onPrevClick = () => {
        this.setState({ error: false });
        if (
            this.state.activeItem === 0 &&
            [1, 2].includes(this.props.additionalSurvey.initialSurveyState)
        ) {
            this.props.resetAdditionalSurveyPage();
            return;
        }
        this.setState({ activeItem: this.state.activeItem - 1 });
    };

    onNextClick = (e: any) => {
        if (
            this.state.activeItem === 0 &&
            this.props.additionalSurvey.initialSurveyState === 1 &&
            this.props.additionalSurvey.isUserInfoValid == false
        ) {
            return;
        }

        if (
            this.state.activeItem === 0 &&
            this.props.additionalSurvey.initialSurveyState === 0
        ) {
            if (new Date() < new Date(this.state.tempDateOfBirth)) {
                this.setState({
                    error: true,
                    message: 'Date of birth should be before current date',
                });
                return;
            }

            if (
                this.state.tempLegalFirstName.trim() === '' ||
                this.state.tempLegalLastName.trim() == '' ||
                this.state.tempDateOfBirth.trim() === '' ||
                this.state.tempSocialSecurityNumber.trim() == ''
            ) {
                this.setState({
                    error: true,
                    message: 'Please fill in all details to continue',
                });
                return;
            }

            if (this.state.tempSocialSecurityNumber.length !== 4) {
                this.setState({
                    error: true,
                    message:
                        'Social security number should consist of 4 numbers',
                });
                return;
            }

            this.props.updateAdditionalSurveyDetails(
                this.state.tempLegalFirstName,
                this.state.tempLegalLastName,
                this.state.tempSocialSecurityNumber,
                this.state.tempDateOfBirth,
                1
            );
            this.setState({ error: false });
            return;
        }

        if (
            this.state.activeItem === 0 &&
            this.props.additionalSurvey.initialSurveyState === 1
        ) {
            this.props.updateAdditionalSurveyDetails(
                this.props.additionalSurvey.legalFirstName,
                this.props.additionalSurvey.legalLastName,
                this.props.additionalSurvey.socialSecurityNumber,
                this.props.additionalSurvey.dateOfBirth,
                2
            );
            this.setState({ error: false });
            return;
        }

        const { userSurveyState } = this.props;

        if (
            this.state.activeItem === 0 &&
            !userSurveyState.nodes['8'].response
        ) {
            this.setState({ error: true });
            return;
        }
        if (
            this.state.activeItem == 0 &&
            userSurveyState.graph['1']?.some(
                (key) =>
                    userSurveyState.nodes[key].response == YesNoResponse.Yes
            )
        )
            if (
                userSurveyState.graph['1']
                    .slice(1, userSurveyState.graph['1'].length)
                    .every(
                        (key) =>
                            userSurveyState.nodes[key].response !=
                            YesNoResponse.Yes
                    )
            ) {
                this.setState({ error: false });
                this.continue(e);
            } else
                this.setState({
                    activeItem: this.state.activeItem + 1,
                    error: false,
                });
        else if (this.state.activeItem == 0) {
            this.setState({ error: true });
        } else if (this.state.activeItem == 1) {
            const [q1_count, q2_count] = this.counter();
            if (q1_count + q2_count <= 3) {
                this.setState({ error: false });
                this.continue(e);
            } else this.setState({ error: true });
        }
    };

    setTempAdditionalDetails = (
        tempLegalFirstName: string,
        tempLegalLastName: string,
        tempSocialSecurityNumber: string,
        tempDateOfBirth: string
    ) => {
        this.setState({
            tempLegalFirstName: tempLegalFirstName.trim(),
            tempLegalLastName: tempLegalLastName.trim(),
            tempSocialSecurityNumber: tempSocialSecurityNumber.trim(),
            tempDateOfBirth: tempDateOfBirth,
        });
        this.props.updateAdditionalSurveyDetails(
            tempLegalFirstName.trim(),
            tempLegalLastName.trim(),
            tempSocialSecurityNumber.trim(),
            tempDateOfBirth,
            0
        );
    };

    getData = async (complaint: string) => {
        const { parentNodes } = this.props.hpiHeaders,
            chiefComplaint = Object.keys(parentNodes[complaint])[0],
            response = await axios.get(
                'https://cydocgraph.herokuapp.com/graph/category/' +
                    chiefComplaint +
                    '/4'
            ),
            { data } = response,
            { graph, nodes, edges } = data as GraphData,
            parentNode = parentNodes[complaint][chiefComplaint];
        this.props.processKnowledgeGraph(data);
        const childNodes = graph[parentNode]
            .map((edge: number) => [
                edges[edge.toString()].toQuestionOrder.toString(),
                edges[edge.toString()].to,
            ])
            .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
            .map(([, /* _questionOrder, */ medId]) => medId);
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
            case ResponseTypes.SHORT_TEXT:
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
            default:
                return;
        }
    };

    isAtLeaseOneInputYesOnPage() {
        const selected =
            this.props.userSurveyState.nodes['2'].response ===
                YesNoResponse.Yes ||
            this.props.userSurveyState.nodes['3'].response ===
                YesNoResponse.Yes ||
            this.props.userSurveyState.nodes['4'].response ===
                YesNoResponse.Yes;
        if (
            this.state.activeItem == 0 &&
            selected &&
            this.props.userSurveyState.nodes['8'].response
        ) {
            this.setState({ error: false });
        }
        return selected;
    }

    render() {
        const { activeItem } = this.state,
            { userSurveyState } = this.props,
            nodes = patientViewHeaders.parentNodes,
            nodeKey = Object.values(Object.entries(nodes)[activeItem][1])[0],
            questions = initialQuestions as initialQuestionsState;
        let initialSurvey =
            nodeKey in questions.nodes
                ? questions.graph[nodeKey].map((key) => {
                      return (
                          <div
                              key={questions.nodes[key].text}
                              className={'qa-div sixteen wide column'}
                          >
                              {questions.nodes[key].text}
                              <div className='survey-chips button-spacing'>
                                  {Object.keys(this.props.userSurveyState.nodes)
                                      .length
                                      ? this.renderSwitch(key)
                                      : ''}
                              </div>
                          </div>
                      );
                  })
                : '';
        const isLoaded =
            Object.keys(userSurveyState.graph).length &&
            Object.keys(userSurveyState.nodes).length &&
            Object.keys(userSurveyState.order).length;

        initialSurvey =
            this.props.additionalSurvey.initialSurveyState == 0
                ? [
                      <DetailsPage
                          key={0}
                          legalFirstName={
                              this.props.additionalSurvey.legalFirstName
                          }
                          legalLastName={
                              this.props.additionalSurvey.legalLastName
                          }
                          socialSecurityNumber={
                              this.props.additionalSurvey.socialSecurityNumber
                          }
                          dateOfBirth={this.props.additionalSurvey.dateOfBirth}
                          setTempAdditionalDetails={
                              this.setTempAdditionalDetails
                          }
                      />,
                  ]
                : this.props.additionalSurvey.initialSurveyState === 1
                ? [<UserInfoForm key={1} />]
                : initialSurvey;

        return (
            <div>
                <Container className='active-tab-container'>
                    {this.state.error ||
                    (isLoaded && this.counter().reduce((a, v) => a + v) > 3) ? (
                        <Message negative>
                            <Message.Header>
                                {this.state.activeItem == 0
                                    ? this.props.additionalSurvey
                                          .initialSurveyState === 0
                                        ? this.state.message
                                        : this.isAtLeaseOneInputYesOnPage()
                                        ? 'Please confirm the date of your appointment.'
                                        : 'Please answer Yes to at least one question to proceed.'
                                    : 'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'}
                            </Message.Header>
                        </Message>
                    ) : (
                        ''
                    )}
                    <Segment>
                        <Grid>{initialSurvey}</Grid>
                    </Segment>
                </Container>
                {[1, 2].includes(
                    this.props.additionalSurvey.initialSurveyState
                ) && this.state.activeItem === 0 ? (
                    <div>
                        {' '}
                        <Button
                            icon
                            labelPosition='left'
                            floated='left'
                            className='hpi-previous-button'
                            onClick={this.onPrevClick}
                        >
                            Previous
                            <Icon name='arrow left' />
                        </Button>
                        <Button
                            icon
                            floated='left'
                            className='hpi-small-previous-button'
                            onClick={this.onPrevClick}
                        >
                            <Icon name='arrow left' />
                        </Button>{' '}
                    </div>
                ) : (
                    ''
                )}
                {this.state.activeItem > 0 ? (
                    <div>
                        {' '}
                        <Button
                            icon
                            labelPosition='left'
                            floated='left'
                            className='hpi-previous-button'
                            onClick={this.onPrevClick}
                        >
                            Prev
                            <Icon name='arrow left' />
                        </Button>
                        <Button
                            icon
                            floated='left'
                            className='hpi-small-previous-button'
                            onClick={this.onPrevClick}
                        >
                            <Icon name='arrow left' className='big' />
                        </Button>{' '}
                    </div>
                ) : (
                    ''
                )}
                <Button
                    icon
                    labelPosition='right'
                    floated='right'
                    className='hpi-next-button'
                    onClick={this.onNextClick}
                >
                    Next
                    <Icon name='arrow right' />
                </Button>
                <Button
                    icon
                    floated='right'
                    className='hpi-small-next-button'
                    onClick={this.onNextClick}
                >
                    <Icon name='arrow right' className='big' />
                </Button>
            </div>
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
    PatientViewProps &
    ChiefComplaintsProps &
    AdditionalSurveyProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
        hpiHeaders: state.hpiHeaders,
        patientView: selectPatientViewState(state),
        chiefComplaints: state.chiefComplaints,
        additionalSurvey: state.additionalSurvey,
    };
};

interface DispatchProps {
    processSurveyGraph: (
        graph: initialQuestionsState
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

export default connect(mapStateToProps, mapDispatchToProps)(InitialSurvey);
