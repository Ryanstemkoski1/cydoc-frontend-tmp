import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
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
import ChiefComplaintsButton from 'pages/EditNote/content/hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import ListText from 'pages/EditNote/content/hpi/knowledgegraph/src/components/responseComponents/ListText';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import patientViewHeaders from 'pages/EditNote/content/patientview/constants/patientViewHeaders.json';
import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    GoBackToAdditionalSurvey,
    UpdateAdditionalSurveyAction,
    resetAdditionalSurveyPage,
    updateAdditionalSurveyDetails,
} from 'redux/actions/additionalSurveyActions';
import { selectChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import {
    ProcessKnowledgeGraphAction,
    processKnowledgeGraph,
} from 'redux/actions/hpiActions';
import {
    SaveHpiHeaderAction,
    saveHpiHeader,
} from 'redux/actions/hpiHeadersActions';
import {
    InitialSurveyAddListInputAction,
    InitialSurveyAddTextActions,
    InitialSurveyListTextHandleChangeAction,
    InitialSurveyRemoveListInputAction,
    InitialSurveySearchAction,
    ProcessSurveyGraphAction,
    initialSurveyAddListInput,
    initialSurveyAddText,
    initialSurveyListTextHandleChange,
    initialSurveyRemoveListInput,
    initialSurveySearch,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import { HpiHeadersState } from 'redux/reducers/hpiHeadersReducer';
import { isSelectOneResponse } from 'redux/reducers/hpiReducer';
import {
    InitialQuestionsState,
    userSurveyState,
} from 'redux/reducers/userViewReducer';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import getHPIFormData, { isResponseValid } from 'utils/getHPIFormData';
import { getListTextResponseAsSingleString } from 'utils/getHPIText';
import { getQuestionnairesFromText } from 'utils/getQuestionnairesFromText';
import { loadQuestionnairesData } from 'utils/loadKnowledgeGraphData';
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

function createLowerCaseKeyNameToActualKeyNameMap(object = {}) {
    return Object.keys(object).reduce((accumulator, key) => {
        accumulator.set(key.toLowerCase(), key);
        return accumulator;
    }, new Map<string, string>([]));
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
    const query = useQuery();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const selectedCC = useSelectedChiefComplaints();

    const nodes = patientViewHeaders.parentNodes;
    const nodeKey = Object.values(Object.entries(nodes)[1][1])[0];
    const questions = initialQuestions as InitialQuestionsState;
    const userSurveyStateNodes = Object.keys(userSurveyState.nodes);
    const continueRef = useRef<(e: any) => void | undefined>();
    const content =
        nodeKey in questions.nodes &&
        questions.graph[nodeKey].map((key) => {
            return (
                <div key={questions.nodes[key].text}>
                    <p>{questions.nodes[key].text}</p>
                    {userSurveyStateNodes.length && renderSwitch(key)}
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

    /**
     * Remove Questionnaires
     * @param {string[]} pinnedChiefComplaints
     * @returns {string[]} updatedSelectedChiefComplaints
     */
    function removeQuestionniares(pinnedChiefComplaints: string[]): string[] {
        const chiefComplaintsToRemove = selectedCC.filter(
            (questionnaire) => !pinnedChiefComplaints.includes(questionnaire)
        );

        chiefComplaintsToRemove.forEach((questionnaire) =>
            dispatch(selectChiefComplaint(questionnaire))
        );

        // updated selected chief complaints after removal.
        return selectedCC.filter(
            (item) => !chiefComplaintsToRemove.includes(item)
        );
    }

    /**
     * @param {string} text
     * @param {string[]} pinnedChiefComplaints
     * @returns {string[]} newQuestionnaires
     */
    function getNewQuestionnaires(
        text: string,
        pinnedChiefComplaints: string[]
    ): string[] {
        const lowerCaseKeyNameToActualKeyNameMap =
            createLowerCaseKeyNameToActualKeyNameMap(hpiHeaders.parentNodes);

        return getQuestionnairesFromText(text)
            .filter(
                (item) =>
                    !(
                        pinnedChiefComplaints.includes(item) &&
                        selectedCC.includes(item)
                    )
            )
            .map((item) =>
                lowerCaseKeyNameToActualKeyNameMap.get(item.toLowerCase())
            ) as string[];
    }

    /**
     * Get Questionnaires to Load
     * @param {string[]} newQuestionnaires
     * @returns {string[]} questionnairesToLoad
     */
    function getQuestionnairesToLoad(newQuestionnaires: string[]): string[] {
        return newQuestionnaires
            .filter((questionnaire) => !selectedCC.includes(questionnaire))
            .map((item) => Object.keys(hpiHeaders.parentNodes[item])[0]);
    }

    async function onNextClick(e: any) {
        const pinnedChiefComplaints = Object.keys(
            userSurveyState.nodes['6'].response ?? {}
        );

        const node7Response = userSurveyState.nodes['7'].response ?? {};
        const node7ResponseAsText =
            getListTextResponseAsSingleString(node7Response);

        const newQuestionnaires = getNewQuestionnaires(
            node7ResponseAsText,
            pinnedChiefComplaints
        );

        const updatedSelectedChiefCompliants = removeQuestionniares(
            pinnedChiefComplaints
        );

        if (
            !newQuestionnaires.length &&
            !updatedSelectedChiefCompliants.length &&
            isResponseValid(node7Response)
        ) {
            handleSubmit();
            return;
        }

        const questionnairesToLoad = getQuestionnairesToLoad(newQuestionnaires);

        setLoading(true);
        const values = await loadQuestionnairesData(questionnairesToLoad);
        setLoading(false);

        // Dispatching actions
        values.forEach((data) => dispatch(processKnowledgeGraph(data)));
        newQuestionnaires.forEach((questionnaire) =>
            dispatch(selectChiefComplaint(questionnaire))
        );

        setTimeout(() => continueRef!.current!(e), 0);
    }

    function renderSwitch(id: string) {
        const {
                userSurveyState,
                initialSurveyAddListInput,
                initialSurveyListTextHandleChange,
                initialSurveyRemoveListInput,
            } = props,
            currEntry = userSurveyState.nodes[id];

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
            case ResponseTypes.LIST_TEXT:
                return (
                    <div className={style.diseaseSelections__listWrap}>
                        <ListText
                            key={id}
                            nodeId={id}
                            response={currEntry.response}
                            onAddListItem={initialSurveyAddListInput}
                            onChangeListItem={initialSurveyListTextHandleChange}
                            onRemoveListItem={initialSurveyRemoveListInput}
                        />
                    </div>
                );
            default:
                return;
        }
    }

    function handleSubmit() {
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
                setLoading(false);
            });
    }

    /* ----- EFFECTS ----- */

    useEffect(() => {
        continueRef.current = props.continue;
    }, [props.continue]);

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

    return (
        <div className={style.diseaseSelections}>
            {content}
            <NavigationButton
                previousClick={onPrevClick}
                loading={loading}
                nextClick={onNextClick}
                secondButtonLabel={'Next'}
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
    initialSurveyAddListInput: (id: string) => InitialSurveyAddListInputAction;
    initialSurveyListTextHandleChange: (
        key: string,
        id: string,
        textInput: string
    ) => InitialSurveyListTextHandleChangeAction;
    initialSurveyRemoveListInput: (
        key: string,
        id: string
    ) => InitialSurveyRemoveListInputAction;
}

type Props = HpiHeadersProps &
    InitialSurveyComponentProps &
    initialSurveyProps &
    DispatchProps &
    HpiHeadersProps &
    ChiefComplaintsProps &
    AdditionalSurveyProps;

const mapDispatchToProps = {
    processSurveyGraph,
    saveHpiHeader,
    processKnowledgeGraph,
    initialSurveySearch,
    updateAdditionalSurveyDetails,
    resetAdditionalSurveyPage,
    initialSurveyAddText,
    initialSurveyAddListInput,
    initialSurveyListTextHandleChange,
    initialSurveyRemoveListInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(CCSelection);
