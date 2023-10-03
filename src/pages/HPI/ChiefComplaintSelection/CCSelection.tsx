import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
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
import ListText from 'pages/EditNote/content/hpi/knowledgegraph/src/components/responseComponents/ListText';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import patientViewHeaders from 'pages/EditNote/content/patientview/constants/patientViewHeaders.json';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
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
    const query = useQuery();
    const [loading, setLoading] = useState(false);

    const selectedCC = useSelectedChiefComplaints();

    const disableSubmitButton = useMemo(
        () =>
            isResponseValid(userSurveyState.nodes['7'].response) &&
            Object.keys(chiefComplaints).length === 0,
        [chiefComplaints, userSurveyState.nodes]
    );

    const nodes = patientViewHeaders.parentNodes;
    const nodeKey = Object.values(Object.entries(nodes)[1][1])[0];
    const questions = initialQuestions as InitialQuestionsState;
    const userSurveyStateNodes = Object.keys(userSurveyState.nodes);
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

    function onNextClick(e: any) {
        props.continue(e);
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
                nextClick={disableSubmitButton ? handleSubmit : onNextClick}
                secondButtonLabel={disableSubmitButton ? 'Submit' : 'Next'}
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
    initialSurveyAddListInput,
    initialSurveyListTextHandleChange,
    initialSurveyRemoveListInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(CCSelection);
