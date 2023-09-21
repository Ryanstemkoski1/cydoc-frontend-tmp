import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import axios from 'axios';
import Search from 'components/Input/Search';
import TextArea from 'components/Input/Textarea';
import { ActiveItemProps } from 'components/navigation/NavMenu';
import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { NotificationTypeEnum } from 'components/tools/Notification/Notification';
import { apiClient } from 'constants/api';
import { GraphData, ResponseTypes } from 'constants/hpiEnums';
import useQuery from 'hooks/useQuery';
import useSelectedChiefComplaints from 'hooks/useSelectedChiefComplaints';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/HPIContent';
import { hpiHeaders as hpiHeadersApiClient } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import ChiefComplaintsButton, {
    PatientViewProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import patientViewHeaders from 'pages/EditNote/content/patientview/constants/patientViewHeaders.json';
import React, { useEffect, useMemo, useState } from 'react';
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
    InitialSurveyAddTextActions,
    InitialSurveySearchAction,
    ProcessSurveyGraphAction,
    initialSurveyAddText,
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
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import getHPIFormData from 'utils/getHPIFormData';
import style from './CCSelection.module.scss';

interface InitialSurveyComponentProps {
    continue: (e: any) => void;
    onPreviousClick: () => void;
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
}

const CCSelection = (props: Props) => {
    const {
        userSurveyState,
        chiefComplaints,
        processKnowledgeGraph,
        notification,
        hpiHeaders,
        processSurveyGraph,
        saveHpiHeader,
    } = props;
    const { setNotificationMessage, setNotificationType } = notification;
    const nodeTenResponse = (
        (userSurveyState.nodes['10'].response ?? '') as string
    ).trim();

    const query = useQuery();

    const [searchVal, setSearchVal] = useState('');
    const [loading, setLoading] = useState(false);

    const [showRequiredFieldValidation, setShowRequiredFieldValidation] =
        useState({
            status: false,
            forUID: '-1',
        });
    const [showNodeTen, setShowNodeTen] = useState(Boolean(nodeTenResponse));

    const selectedCC = useSelectedChiefComplaints();
    const showSubmitButton = useMemo(
        () => showNodeTen && Object.keys(chiefComplaints).length === 0,
        [chiefComplaints, showNodeTen]
    );

    const nodes = patientViewHeaders.parentNodes;
    const nodeKey = Object.values(Object.entries(nodes)[1][1])[0];
    const questions = initialQuestions as InitialQuestionsState;
    const userSurveyStateNodes = Object.keys(userSurveyState.nodes);
    const content =
        nodeKey in questions.nodes &&
        questions.graph[nodeKey].map((key) => {
            if (key === '10' && !(showNodeTen && selectedCC.length === 0))
                return null;

            return (
                <div
                    className={`${
                        questions.nodes[key].responseType === 'SEARCH'
                            ? `${style.diseaseSelections__search} flex-wrap justify-between`
                            : ''
                    }`}
                    key={questions.nodes[key].text}
                >
                    <p>{questions.nodes[key].text}</p>

                    {userSurveyStateNodes.length && renderSwitch(key)}
                    {showRequiredFieldValidation.forUID === key &&
                        showRequiredFieldValidation.status === true && (
                            <div className={style.diseaseSelections__error}>
                                This field is required
                            </div>
                        )}
                </div>
            );
        });

    /* ----- FUNCTIONS ----- */

    function canWeAddNewCC(complaint: string): boolean {
        // if user trying to unselect or length is < 3
        if (selectedCC.includes(complaint) || selectedCC.length < 3)
            return true;

        return false;
    }

    function onPrevClick() {
        return props.onPreviousClick();
    }

    function onNextClick(e: any) {
        if (!selectedCC.length && !showNodeTen) {
            setShowNodeTen(true);
            return;
        }

        if (!selectedCC.length && showNodeTen && !nodeTenResponse) {
            setShowRequiredFieldValidation({
                status: true,
                forUID: '10',
            });
            return;
        }

        if (selectedCC.length && nodeTenResponse) {
            props.initialSurveyAddText('10', '');
        }

        props.continue(e);
    }

    async function getData(complaint: string) {
        const { parentNodes } = props.hpiHeaders,
            chiefComplaint = Object.keys(parentNodes[complaint])[0],
            response = await axios.get(
                'https://cydocgraph.herokuapp.com/graph/category/' +
                    chiefComplaint +
                    '/4'
            ),
            { data } = response,
            { graph, nodes, edges } = data as GraphData,
            parentNode = parentNodes[complaint][chiefComplaint];
        processKnowledgeGraph(data);
        const childNodes = graph[parentNode]
            .map((edge: number) => [
                edges[edge.toString()].toQuestionOrder.toString(),
                edges[edge.toString()].to,
            ])
            .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
            .map(([, /* _questionOrder, */ medId]) => medId);
    }

    function renderSwitch(id: string) {
        const { userSurveyState, patientView, initialSurveySearch } = props,
            currEntry = userSurveyState.nodes[id],
            { bodySystems, parentNodes } = props.hpiHeaders;
        // map through all complaints on the HPI and create search resuls
        const getRes = () => {
            const filterResults: {
                title: string;
                onClick: (event?: any) => void;
            }[] = [];
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
                        toCompare.includes(searchVal.toLowerCase())
                    ) {
                        const temp = {
                            title: title,
                            onClick: () => {
                                if (!canWeAddNewCC(complaint)) {
                                    setNotificationMessage(
                                        'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
                                    );
                                    setNotificationType(
                                        NotificationTypeEnum.ERROR
                                    );
                                    getData(complaint);
                                    initialSurveySearch(id, complaint);
                                    return;
                                }
                                currentNoteStore.dispatch({
                                    type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                                    payload: {
                                        disease: complaint,
                                    },
                                });

                                const currentEntryResponse = Object.keys(
                                    currEntry.response || {}
                                );

                                if (!currentEntryResponse.includes(complaint)) {
                                    getData(complaint);
                                    initialSurveySearch(id, complaint);
                                }
                            },
                        };
                        filterResults.push(temp);
                    }
                });
            });

            return filterResults;
        };

        switch (currEntry.responseType) {
            case ResponseTypes.SELECTONE:
                return isSelectOneResponse(currEntry.response) ? (
                    <div
                        id='pinnedChiefComplaints'
                        className={`${style.diseaseSelections__wrap} flex-wrap`}
                    >
                        {Object.keys(currEntry.response).map((condition) => (
                            <span
                                onClick={() => {
                                    if (!canWeAddNewCC(condition)) {
                                        setNotificationMessage(
                                            'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
                                        );
                                        setNotificationType(
                                            NotificationTypeEnum.ERROR
                                        );

                                        return;
                                    }
                                }}
                                key={condition}
                            >
                                <ChiefComplaintsButton
                                    key={condition}
                                    name={condition}
                                />
                            </span>
                        ))}
                    </div>
                ) : (
                    ''
                );
            case 'SEARCH':
                return (
                    <>
                        <aside>
                            <Search
                                items={getRes()}
                                value={searchVal}
                                onChange={(event: any) => {
                                    const target =
                                        event.target as HTMLTextAreaElement;
                                    setSearchVal(target.value);
                                }}
                                placeholder='Type in a condition'
                            />
                        </aside>

                        {isChiefComplaintsResponse(currEntry.response) ? (
                            <div className={style.diseaseSelections__selected}>
                                {Object.keys(currEntry.response).map(
                                    (complaint) => (
                                        <span
                                            onClick={() => {
                                                if (!canWeAddNewCC(complaint)) {
                                                    setNotificationMessage(
                                                        'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
                                                    );
                                                    setNotificationType(
                                                        NotificationTypeEnum.ERROR
                                                    );
                                                    return;
                                                }
                                            }}
                                            key={complaint}
                                        >
                                            <ChiefComplaintsButton
                                                key={complaint}
                                                name={complaint}
                                            />
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            case ResponseTypes.LONG_TEXT:
                return (
                    <div className={style.diseaseSelections__textarea}>
                        <TextArea
                            maxLength='200'
                            key={id}
                            value={(currEntry?.response as string) || ''}
                            placeholder={
                                'Description of condition or symptom... (max 200 characters)'
                            }
                            onChange={(
                                _e: any,
                                { value }: { value: string }
                            ) => {
                                props.initialSurveyAddText(
                                    id,
                                    value.substring(0, 200)
                                );
                            }}
                        />
                    </div>
                );

            default:
                return;
        }
    }

    function handleSubmit() {
        if (selectedCC.length === 0 && showNodeTen === false) {
            setShowNodeTen(true);
            return;
        }

        if (showNodeTen && selectedCC.length === 0 && !nodeTenResponse) {
            setShowRequiredFieldValidation({
                status: true,
                forUID: '10',
            });
            return;
        }

        const clinician_id =
            query.get(HPIPatientQueryParams.CLINICIAN_ID) ?? '';
        const institution_id =
            query.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';

        const { setNotificationMessage, setNotificationType } =
            props.notification;

        setLoading(true);
        apiClient
            .post('/appointment', {
                ...getHPIFormData(),
                clinician_id,
                institution_id,
            })
            .then(() => {
                localStorage.setItem('HPI_FORM_SUBMITTED', '1');
                let url = `/submission-successful?${HPIPatientQueryParams.INSTITUTION_ID}=${institution_id}`;

                if (clinician_id) {
                    url += `&${HPIPatientQueryParams.CLINICIAN_ID}=${clinician_id}`;
                }

                window.location.href = url;
            })
            .catch((_error) => {
                setNotificationMessage('Failed to submit your questionnaire');
                setNotificationType(NotificationTypeEnum.ERROR);
            })
            .finally(() => {
                if (showRequiredFieldValidation.status) {
                    setShowRequiredFieldValidation({
                        status: false,
                        forUID: '-1',
                    });
                }
                setLoading(false);
            });
    }

    /* ----- EFFECTS ----- */

    useEffect(() => {
        if (
            !Object.keys(userSurveyState.graph).length &&
            !Object.keys(userSurveyState.nodes).length &&
            !Object.keys(userSurveyState.order).length
        )
            processSurveyGraph(initialQuestions as InitialQuestionsState);

        if (hpiHeaders) {
            const data = hpiHeadersApiClient;
            data.then((res) => saveHpiHeader(res.data));
        }
    }, []);

    useEffect(() => {
        setShowRequiredFieldValidation({
            status: false,
            forUID: '-1',
        });
    }, [userSurveyState]);

    return (
        <div className={style.diseaseSelections}>
            {content}
            <NavigationButton
                previousClick={onPrevClick}
                loading={loading}
                nextClick={showSubmitButton ? handleSubmit : onNextClick}
                secondButtonLabel={showSubmitButton ? 'Submit' : 'Next'}
            />
        </div>
    );
};

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
    AdditionalSurveyProps => {
    return {
        userSurveyState: selectInitialPatientSurvey(state),
        hpiHeaders: state.hpiHeaders,
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
    initialSurveyAddText: (
        id: string,
        response: string
    ) => InitialSurveyAddTextActions;
}

type Props = HpiHeadersProps &
    InitialSurveyComponentProps &
    initialSurveyProps &
    DispatchProps &
    HpiHeadersProps &
    PatientViewProps &
    ChiefComplaintsProps &
    AdditionalSurveyProps &
    ActiveItemProps;

const mapDispatchToProps = {
    processSurveyGraph,
    saveHpiHeader,
    processKnowledgeGraph,
    initialSurveySearch,
    updateAdditionalSurveyDetails,
    resetAdditionalSurveyPage,
    initialSurveyAddText,
};

export default connect(mapStateToProps, mapDispatchToProps)(CCSelection);
