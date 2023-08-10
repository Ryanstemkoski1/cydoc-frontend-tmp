import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import axios from 'axios';
import Search from 'components/Input/Search';
import { ActiveItemProps } from 'components/navigation/NavMenu';
import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import { GraphData, ResponseTypes } from 'constants/hpiEnums';
import {
    ChiefComplaintsProps,
    HpiHeadersProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/HPIContent';
import { hpiHeaders } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import ChiefComplaintsButton, {
    PatientViewProps,
} from 'pages/EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions.json';
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
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import { currentNoteStore } from 'redux/store';
import style from './CCSelection.module.scss';

interface InitialSurveyComponentProps {
    continue: (e: any) => void;
    onPreviousClick: () => void;
    setErrorMessage: (message: string) => void;
}

const CCSelection = (props: Props) => {
    const [searchVal, setSearchVal] = useState('');
    const selectedCC = useMemo(() => {
        return Object.keys(props.chiefComplaints).filter(
            (item) => item !== ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM
        );
    }, [props.chiefComplaints]);

    const canWeAddNewCC = (complaint: string): boolean => {
        // if user trying to unselect or length is < 3
        if (selectedCC.includes(complaint) || selectedCC.length < 3)
            return true;

        return false;
    };

    useEffect(() => {
        const { userSurveyState, processSurveyGraph, saveHpiHeader } = props;
        if (
            !Object.keys(userSurveyState.graph).length &&
            !Object.keys(userSurveyState.nodes).length &&
            !Object.keys(userSurveyState.order).length
        )
            processSurveyGraph(initialQuestions as initialQuestionsState);

        if (hpiHeaders) {
            const data = hpiHeaders;
            data.then((res) => saveHpiHeader(res.data));
        }
    }, []);

    const onPrevClick = () => props.onPreviousClick();

    const onNextClick = (e: any) => {
        const CC = Object.keys(props.chiefComplaints);

        if (
            !CC.includes(ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM) &&
            CC.length === 0
        ) {
            props.setErrorMessage(
                'Please select at least one condition or symptom'
            );
        } else {
            props.continue(e);
        }
    };

    const getData = async (complaint: string) => {
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
        props.processKnowledgeGraph(data);
        const childNodes = graph[parentNode]
            .map((edge: number) => [
                edges[edge.toString()].toQuestionOrder.toString(),
                edges[edge.toString()].to,
            ])
            .sort((tup1, tup2) => parseInt(tup1[0]) - parseInt(tup2[0]))
            .map(([, /* _questionOrder, */ medId]) => medId);
    };

    const renderSwitch = (id: string) => {
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
                                    props.setErrorMessage(
                                        'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
                                    );
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
                        className={`${style.diseaseSelections__wrap} flex-wrap`}
                    >
                        {Object.keys(currEntry.response).map((condition) => (
                            <span
                                onClick={() => {
                                    if (!canWeAddNewCC(condition)) {
                                        props.setErrorMessage(
                                            'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
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
                                                    props.setErrorMessage(
                                                        'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
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
            default:
                return;
        }
    };

    const nodes = patientViewHeaders.parentNodes;
    const nodeKey = Object.values(Object.entries(nodes)[1][1])[0];
    const questions = initialQuestions as initialQuestionsState;
    const userSurveyStateNodes = Object.keys(props.userSurveyState.nodes);

    const content =
        nodeKey in questions.nodes &&
        questions.graph[nodeKey].map((key) => {
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
                </div>
            );
        });

    return (
        <div className={style.diseaseSelections}>
            {content}
            <NavigationButton
                previousClick={onPrevClick}
                nextClick={onNextClick}
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
    AdditionalSurveyProps &
    ActiveItemProps;

const mapDispatchToProps = {
    processSurveyGraph,
    saveHpiHeader,
    processKnowledgeGraph,
    initialSurveySearch,
    updateAdditionalSurveyDetails,
    resetAdditionalSurveyPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CCSelection);
