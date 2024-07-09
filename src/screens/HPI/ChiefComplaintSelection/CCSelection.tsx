'use client';

import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { NotificationTypeEnum } from '@components/tools/Notification/Notification';
import { apiClient } from '@constants/api';
import { ResponseTypes } from '@constants/hpiEnums';
import useQuery from '@hooks/useQuery';
import { useSelectedPinnedChiefComplaints } from '@hooks/useSelectedChiefComplaints';
import { hpiHeaders as hpiHeadersApiClient } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import ChiefComplaintsButton from '@screens/EditNote/content/hpi/knowledgegraph/components/ChiefComplaintsButton';
import ListText from '@screens/EditNote/content/hpi/knowledgegraph/components/responseComponents/ListText';
import initialQuestions from '@screens/EditNote/content/patientview/constants/initialQuestions';
import patientViewHeaders from '@screens/EditNote/content/patientview/constants/patientViewHeaders.json';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect, useDispatch } from 'react-redux';
import {
    resetAdditionalSurveyPage,
    updateAdditionalSurveyDetails,
} from '@redux/actions/additionalSurveyActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import {
    initialSurveyAddListInput,
    initialSurveyAddText,
    initialSurveyListTextHandleChange,
    initialSurveyRemoveListInput,
    initialSurveySearch,
    processSurveyGraph,
} from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { isSelectOneResponse } from '@redux/reducers/hpiReducer';
import { InitialQuestionsState } from '@redux/reducers/userViewReducer';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import getHPIFormData, { isResponseValid } from '@utils/getHPIFormData';
import { getListTextResponseAsSingleString } from '@utils/getHPIText';
import { getQuestionnairesFromText } from '@utils/getQuestionnairesFromText';
import { loadChiefComplaintsData } from '@utils/loadKnowledgeGraphData';
import { OnNextClickParams } from '../Hpi';
import style from './CCSelection.module.scss';
import { selectFamilyHistoryState } from '@redux/selectors/familyHistorySelectors';
import { selectMedicationsState } from '@redux/selectors/medicationsSelectors';
import { selectSurgicalHistoryProcedures } from '@redux/selectors/surgicalHistorySelectors';
import { selectPatientInformationState } from '@redux/selectors/patientInformationSelector';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import { selectMedicalHistoryState } from '@redux/selectors/medicalHistorySelector';
import { redirect } from 'next/navigation';

interface OwnProps {
    continue: (args?: OnNextClickParams) => void;
    onPreviousClick: () => void;
    notification: {
        setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
        setNotificationType: React.Dispatch<
            React.SetStateAction<NotificationTypeEnum>
        >;
    };
    defaultInstitutionChiefComplaints: string[];
}

function createLowerCaseKeyNameToActualKeyNameMap(object = {}) {
    return Object.keys(object).reduce((accumulator, key) => {
        accumulator.set(key.toLowerCase(), key);
        return accumulator;
    }, new Map<string, string>([]));
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

const CCSelection = (props: Props) => {
    const {
        additionalSurvey,
        userSurveyState,
        processKnowledgeGraph,
        notification,
        hpiHeaders,
        defaultInstitutionChiefComplaints,
    } = props;
    const { setNotificationMessage, setNotificationType } = notification;
    const query = useQuery();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const selectedPinnedCC = useSelectedPinnedChiefComplaints();

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
        if (selectedPinnedCC.includes(complaint) || selectedPinnedCC.length < 3)
            return true;

        return false;
    }

    function onPrevClick() {
        return props.onPreviousClick();
    }

    /**
     * @param {string} text
     * @returns {string[]} chiefComplaintsFromListText
     */
    function getChiefComplaintsFromListText(text: string): string[] {
        const lowerCaseKeyNameToActualKeyNameMap =
            createLowerCaseKeyNameToActualKeyNameMap(hpiHeaders.parentNodes);

        return Array.from(
            new Set(
                getQuestionnairesFromText(text)
                    .filter((item) => !selectedPinnedCC.includes(item))
                    .map((item) =>
                        lowerCaseKeyNameToActualKeyNameMap.get(
                            item.toLowerCase()
                        )
                    ) as string[]
            )
        );
    }

    /**
     * Get Chief Complaints to Load
     * @param {string[]} chiefComplaints
     * @returns {string[]} chiefComplaintsToLoad
     */
    function getChiefComplaintsToLoad(chiefComplaints: string[]): string[] {
        return chiefComplaints.map(
            (item) => Object.keys(hpiHeaders?.parentNodes?.[item])?.[0] ?? ''
        );
    }

    async function onNextClick() {
        const node7Response = userSurveyState.nodes['7'].response ?? {};
        const node7ResponseAsText =
            getListTextResponseAsSingleString(node7Response);

        const chiefComplaintsFromListText =
            getChiefComplaintsFromListText(node7ResponseAsText);
        const chiefComplaintsToLoad = getChiefComplaintsToLoad(
            chiefComplaintsFromListText
        );

        if (
            !selectedPinnedCC.length &&
            !chiefComplaintsFromListText.length &&
            !defaultInstitutionChiefComplaints.length &&
            isResponseValid(node7Response)
        ) {
            handleSubmit();
            return;
        }

        setLoading(true);
        const values = await loadChiefComplaintsData(chiefComplaintsToLoad);
        setLoading(false);

        values.forEach((data) => dispatch(processKnowledgeGraph(data)));

        props.continue({
            allSelectedChiefComplaints: [
                ...selectedPinnedCC,
                ...chiefComplaintsFromListText,
            ],
            listTextChiefComplaints: chiefComplaintsFromListText,
        });
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
            query?.get(HPIPatientQueryParams.CLINICIAN_ID) ?? '';
        const institution_id =
            query?.get(HPIPatientQueryParams.INSTITUTION_ID) ?? '';

        const { setNotificationMessage, setNotificationType } =
            props.notification;

        setLoading(true);
        apiClient
            .post('/appointment', {
                ...getHPIFormData(additionalSurvey, userSurveyState, {
                    hpi: props.hpi,
                    chiefComplaints: props.chiefComplaints,
                    familyHistory: props.familyHistoryState,
                    medications: props.medicationsState,
                    medicalHistory: props.medicalHistoryState,
                    patientInformation: props.patientInformationState,
                    surgicalHistory: props.surgicalHistory,
                    userSurvey: props.userSurveyState,
                }),
                clinician_id,
                institution_id,
            })
            .then(() => {
                let url = `/submission-successful?${HPIPatientQueryParams.INSTITUTION_ID}=${institution_id}`;

                if (clinician_id) {
                    url += `&${HPIPatientQueryParams.CLINICIAN_ID}=${clinician_id}`;
                }

                redirect(url);
            })
            .catch(() => {
                setNotificationMessage('Failed to submit your questionnaire');
                setNotificationType(NotificationTypeEnum.ERROR);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        const { graph, nodes, order } = userSurveyState;
        const { bodySystems, parentNodes } = hpiHeaders;

        if (
            !Object.keys(graph).length &&
            !Object.keys(nodes).length &&
            !Object.keys(order).length
        ) {
            processSurveyGraph(initialQuestions as InitialQuestionsState);
        }

        if (
            !Object.keys(parentNodes).length &&
            !Object.keys(bodySystems).length
        ) {
            const data = hpiHeadersApiClient;
            data.then((res) => saveHpiHeader(res.data));
        }
    }, [hpiHeaders, userSurveyState]);

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

const mapStateToProps = (state: CurrentNoteState) => {
    return {
        additionalSurvey: selectAdditionalSurvey(state),
        chiefComplaints: state.chiefComplaints,
        familyHistoryState: selectFamilyHistoryState(state),
        hpi: selectHpiState(state),
        hpiHeaders: state.hpiHeaders,
        medicationsState: selectMedicationsState(state),
        medicalHistoryState: selectMedicalHistoryState(state),
        patientInformationState: selectPatientInformationState(state),
        surgicalHistory: selectSurgicalHistoryProcedures(state),
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

const mapDispatchToProps = {
    initialSurveyAddListInput,
    initialSurveyAddText,
    initialSurveyListTextHandleChange,
    initialSurveyRemoveListInput,
    initialSurveySearch,
    processKnowledgeGraph,
    processSurveyGraph,
    resetAdditionalSurveyPage,
    saveHpiHeader,
    updateAdditionalSurveyDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CCSelection);
