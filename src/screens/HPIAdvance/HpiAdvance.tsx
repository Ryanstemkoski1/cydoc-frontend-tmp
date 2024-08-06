'use client';

import { ApiResponse, Institution } from '@cydoc-ai/types';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import { ChiefComplaintsEnum } from '@constants/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from '@constants/enums/hpi.patient.enums';
import {
    Institution as InstitutionClass,
    InstitutionType,
} from 'classes/institution.class';
import CommonLayout from '@components/CommonLayout/CommonLayout';
import Notification, {
    NotificationTypeEnum,
} from '@components/tools/Notification/Notification';
import useQuery from '@hooks/useQuery';
import useSelectedChiefComplaints from '@hooks/useSelectedChiefComplaints';
import {
    InstitutionConfigResponse,
    getInstitution,
    getInstitutionConfig,
    validateDiseaseForm,
} from 'modules/institution-api';
import { log } from 'modules/logging';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import initialQuestions from '@screens/EditNote/content/patientview/constants/initialQuestions';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateActiveItem } from '@redux/actions/activeItemActions';
import { setChiefComplaint } from '@redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from '@redux/actions/hpiActions';
import { saveHpiHeader } from '@redux/actions/hpiHeadersActions';
import { setLoadingStatus } from '@redux/actions/loadingStatusActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from '@redux/actions/userViewActions';
import { updateAdditionalSurveyDetails } from '@redux/actions/additionalSurveyActions';
import { initialSurveyAddDateOrPlace } from '@redux/actions/userViewActions';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { isResponseValid } from '@utils/getHPIFormData';
import { loadChiefComplaintsData } from '@utils/loadKnowledgeGraphData';
import CCSelection from '../HPI/ChiefComplaintSelection/CCSelection';
import style from './HpiAdvance.module.scss';
// import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from '../HPI/NotesPage/NotePage';
// import PreHPI from './PreHpi/PreHPI';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectHpiHeaders } from '@redux/reducers/hpiHeadersReducer';
import useSignInRequired from '@hooks/useSignInRequired';

export interface OnNextClickParams {
    allSelectedChiefComplaints?: string[];
    listTextChiefComplaints?: string[];
}

interface ScreenForPatientType {
    title: string;
    component: React.JSX.Element | null;
}

const HpiAdvance = () => {
    useSignInRequired(); // this route is private, sign in required

    const dispatch = useDispatch();
    const query = useQuery();
    const router = useRouter();

    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
    const [screenForPatient, setScreenForPatient] =
        useState<ScreenForPatientType>({
            title: '',
            component: null,
        });
    const [institution, setInstitution] = useState<InstitutionClass>();
    const userSurveyState = useSelector(selectInitialPatientSurvey);
    const hpiHeaders = useSelector(selectHpiHeaders);
    const activeItem = useSelector(selectActiveItem);

    const [currentTabs, setCurrentTabs] = useState<string[]>(['CCSelection']);
    const [institutionConfig, setInstitutionConfig] =
        useState<InstitutionConfig>();

    const institutionDefaultCC = useMemo((): string[] => {
        if (!institutionConfig) return [];
        return institutionConfig.diseaseForm.map((item) => item.diseaseName);
    }, [institutionConfig]);

    const [showCCModal, setShowCCModal] = useState(false);
    const selectedChiefComplaints = useSelectedChiefComplaints();
    const [chiefComplaintsForModal, setChiefComplaintsForModal] = useState<
        { chiefComplaint: string; isSelected: boolean }[]
    >([]);
    const selectedChiefComplaintsForModal = useMemo(
        () => chiefComplaintsForModal.filter((item) => item.isSelected),
        [chiefComplaintsForModal]
    );
    const [appointmentDate, setAppointmentDate] = useState('');

    const institutionId = query?.get(HPIPatientQueryParams.INSTITUTION_ID);

    useEffect(() => {
        const selectedAppointment = localStorage.getItem('selectedAppointment');
        if (selectedAppointment) {
            const temp = JSON.parse(selectedAppointment);
            const appointmentDate = temp.selectedAppointment.appointmentDate;
            const legalFirstName = temp.selectedAppointment.firstName;
            const legalLastName = temp.selectedAppointment.lastName;
            const legalMiddleName = temp.selectedAppointment.middleName;
            const dateOfBirth = temp.selectedAppointment.dob;

            setAppointmentDate(appointmentDate);
            dispatch(
                updateAdditionalSurveyDetails(
                    legalFirstName,
                    legalLastName,
                    legalMiddleName ? legalMiddleName : '',
                    '',
                    dateOfBirth,
                    0
                )
            );
        }
    }, [query, router, dispatch]);

    const resetCurrentTabs = useCallback(() => {
        if (!institutionConfig) return [];

        const { showChiefComplaints, showDefaultForm } = institutionConfig;

        const newCurrentTabs: string[] = [];

        if (showChiefComplaints) {
            newCurrentTabs.push('CCSelection');
        } else if (showDefaultForm) {
            newCurrentTabs.push(...institutionDefaultCC);
        }

        return newCurrentTabs;
    }, [institutionConfig, institutionDefaultCC]);

    const changeFavComplaintsBasedOnInstitute = useCallback(() => {
        const { graph, nodes, order } = userSurveyState;

        if (
            !institution ||
            Object.keys(graph).length ||
            Object.keys(nodes).length ||
            Object.keys(order).length
        ) {
            return;
        }

        switch (institution.type) {
            case InstitutionType.GYN: {
                initialQuestions.nodes['2'].category = 'ANNUAL_GYN_EXAM';
                initialQuestions.nodes['2'].doctorView =
                    ChiefComplaintsEnum.ANNUAL_GYN_EXAM_WELL_WOMAN_VISIT;

                dispatch(processSurveyGraph(initialQuestions));

                const favChiefComplaintsObj: { [item: string]: boolean } = {};
                institution.favComplaints.forEach((item) => {
                    favChiefComplaintsObj[item] = false;
                });

                dispatch(initialSurveyAddText('6', favChiefComplaintsObj));
                break;
            }
            case InstitutionType.ENDO:
            case InstitutionType.KAVIRA_HEALTH: {
                dispatch(processSurveyGraph(initialQuestions));

                const favChiefComplaintsObj: { [item: string]: boolean } = {};
                institution.favComplaints.forEach((item) => {
                    favChiefComplaintsObj[item] = false;
                });

                dispatch(initialSurveyAddText('6', favChiefComplaintsObj));
                break;
            }
            default: {
                dispatch(processSurveyGraph(initialQuestions));
                break;
            }
        }
    }, [dispatch, institution, userSurveyState]);

    const onPreviousClick = useCallback(() => {
        if (notificationMessage) setNotificationMessage('');

        const tabs = currentTabs;
        const nextTabIndex = tabs.indexOf(activeItem) - 1;
        if (-1 === nextTabIndex) return;

        const nextTab = tabs[nextTabIndex];

        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    }, [currentTabs, activeItem, notificationMessage, dispatch]);

    // FIXME: this logic should be combined with the logic in the stepper button handler! it currently doesn't work the same
    const onNextClick = useCallback(
        (args?: OnNextClickParams) => {
            const allSelectedChiefComplaints =
                args?.allSelectedChiefComplaints || [];
            const listTextChiefComplaints = args?.listTextChiefComplaints || [];

            setShowCCModal(false);
            setChiefComplaintsForModal([]);

            if (notificationMessage) setNotificationMessage('');

            let newCurrentTabs = currentTabs;

            const node7Response = userSurveyState.nodes['7'].response ?? {};

            if (activeItem === 'CCSelection') {
                if (
                    !allSelectedChiefComplaints.length &&
                    !isResponseValid(node7Response)
                ) {
                    setNotificationMessage(
                        'You must select or describe at least one visit reason to proceed.'
                    );
                    setNotificationType(NotificationTypeEnum.ERROR);
                    return;
                }

                const selectedCCExceptInstitutionDefault =
                    allSelectedChiefComplaints.filter(
                        (item) => !institutionDefaultCC.includes(item)
                    );

                const listTextChiefComplaintsExceptInstitutionDefault =
                    listTextChiefComplaints.filter(
                        (item) => !institutionDefaultCC.includes(item)
                    );

                if (listTextChiefComplaintsExceptInstitutionDefault.length) {
                    const chiefComplaintsForModal =
                        selectedCCExceptInstitutionDefault.map(
                            (chiefComplaint) => ({
                                chiefComplaint: chiefComplaint,
                                isSelected: false,
                            })
                        );

                    setChiefComplaintsForModal(chiefComplaintsForModal);
                    setShowCCModal(true);
                    return;
                }

                const newSelectedChiefComplaints = Array.from(
                    new Set([
                        ...allSelectedChiefComplaints,
                        ...institutionDefaultCC,
                    ])
                );

                newCurrentTabs = [
                    ...resetCurrentTabs(),
                    ...newSelectedChiefComplaints,
                ];

                // remove current selected Chief Complaints
                selectedChiefComplaints.forEach((item) => {
                    dispatch(setChiefComplaint(item));
                });

                // add new selected Chief Complaints
                newSelectedChiefComplaints.forEach((item) => {
                    dispatch(setChiefComplaint(item));
                });
            }

            const nextTabIndex = newCurrentTabs.indexOf(activeItem) + 1;
            if (newCurrentTabs.length === nextTabIndex) {
                return;
            }
            const nextTab = newCurrentTabs[nextTabIndex];
            dispatch(updateActiveItem(nextTab));
        },
        [
            notificationMessage,
            currentTabs,
            userSurveyState.nodes,
            activeItem,
            dispatch,
            institutionDefaultCC,
            resetCurrentTabs,
            selectedChiefComplaints,
        ]
    );

    const handleContinueForCCModal = () => {
        const selectedCC = chiefComplaintsForModal
            .filter((item) => item.isSelected === true)
            .map((item) => item.chiefComplaint);
        onNextClick({
            allSelectedChiefComplaints: selectedCC,
            listTextChiefComplaints: [],
        });
    };

    useEffect(() => {
        switch (activeItem) {
            case 'CCSelection': {
                return setScreenForPatient({
                    component: (
                        <CCSelection
                            continue={onNextClick}
                            onPreviousClick={onPreviousClick}
                            notification={{
                                setNotificationMessage,
                                setNotificationType,
                            }}
                            defaultInstitutionChiefComplaints={
                                institutionDefaultCC
                            }
                        />
                    ),
                    title: `Please select the top 3 conditions or symptoms you'd like to discuss`,
                });
            }
            default: {
                return setScreenForPatient({
                    component: (
                        <NewNotePage
                            onNextClick={onNextClick}
                            onPreviousClick={onPreviousClick}
                            notification={{
                                setNotificationMessage,
                                setNotificationType,
                            }}
                        />
                    ),
                    title:
                        activeItem in hpiHeaders.parentNodes
                            ? hpiHeaders.parentNodes[activeItem].patientView
                            : activeItem,
                });
            }
        }
    }, [
        onNextClick,
        onPreviousClick,
        activeItem,
        institutionDefaultCC,
        hpiHeaders?.parentNodes,
    ]);

    useEffect(() => {
        changeFavComplaintsBasedOnInstitute();
    }, [changeFavComplaintsBasedOnInstitute]);

    useEffect(() => {
        if (!institutionId) {
            router.replace('/');
            return;
        }

        const fetchInstitution = async () => {
            dispatch(setLoadingStatus(true));
            try {
                const validatedInstitution = (await getInstitution(
                    institutionId
                )) as { detail: Institution };
                const getInstitutionConfigResponse =
                    await getInstitutionConfig(institutionId);

                if (!(validatedInstitution as ApiResponse).errorMessage) {
                    const { id, name } = validatedInstitution.detail;
                    setInstitution(new InstitutionClass({ id, name }));
                } else {
                    log(`HPI error fetching institution`);
                    router.replace('/');
                }

                if (
                    !(getInstitutionConfigResponse as ApiResponse).errorMessage
                ) {
                    const result = (
                        getInstitutionConfigResponse as InstitutionConfigResponse
                    ).config;

                    const validationDiseaseFormResult =
                        await validateDiseaseForm(result);

                    if (!validationDiseaseFormResult) {
                        throw new Error('DiseaseForm validation failed');
                    }

                    setInstitutionConfig(result);
                } else {
                    log(`HPI error fetching institution preferences`);
                    router.replace('/');
                }
            } catch (e) {
                log(`HPI error fetching institution`);
                router.replace('/');
            } finally {
                dispatch(setLoadingStatus(false));
            }
        };
        fetchInstitution();
    }, [router, institutionId, query, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeItem, dispatch]);

    useEffect(() => {
        let newCurrentTabs = [
            ...resetCurrentTabs(),
            ...selectedChiefComplaints,
        ];

        newCurrentTabs = Array.from(new Set(newCurrentTabs));

        setCurrentTabs(newCurrentTabs);
        if (
            userSurveyState &&
            userSurveyState.nodes &&
            userSurveyState.nodes['8']
        ) {
            dispatch(initialSurveyAddDateOrPlace('8', appointmentDate));
        }
    }, [resetCurrentTabs, selectedChiefComplaints]);

    useEffect(() => {
        if (notificationMessage) {
            window.scrollTo(0, 0);
            const timeoutId = setTimeout(() => {
                setNotificationMessage('');
            }, 3000);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [notificationMessage]);

    // handle loading institution config
    useEffect(() => {
        if (!institutionConfig) return;

        const { diseaseForm, showChiefComplaints, showDefaultForm } =
            institutionConfig;

        const diseaseFormKeys = diseaseForm.map((form) => form.diseaseKey);

        loadChiefComplaintsData(diseaseFormKeys).then((values) => {
            values.forEach((data) => dispatch(processKnowledgeGraph(data)));
        });

        setCurrentTabs(resetCurrentTabs());

        if (showChiefComplaints || !showDefaultForm) return;

        // FIXME: this logic is not idempotent and it should be!
        // here we're ensuring the default form is set locally in redux
        // however, when this useEffect gets called twice, it will end up removing the default form
        // this function: setChiefComplaint is the same for adding and removing items, causing bugs when called more than once...
        // remove existing "default forms" chief complaints before updating with new ones
        selectedChiefComplaints.forEach((item) => {
            dispatch(setChiefComplaint(item));
        });

        institutionDefaultCC.forEach((item) => {
            dispatch(setChiefComplaint(item));
        });
        // this effect changes selectedChiefComplaints, so don't add it to dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        institutionConfig,
        institutionDefaultCC,
        resetCurrentTabs,
        // selectedChiefComplaints <-- do not add this here, causes infinite loop
    ]);

    useEffect(() => {
        if (
            !Object.keys(hpiHeaders.parentNodes).length &&
            !Object.keys(hpiHeaders.bodySystems).length
        ) {
            const data = knowledgeGraphAPI;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }
    }, [dispatch, hpiHeaders]);

    useEffect(() => {
        dispatch(updateActiveItem('CCSelection'));
        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, [dispatch]);

    const showMainNotificationMessage = useMemo(() => {
        if (!notificationMessage) return false;
        if (activeItem !== 'CCSelection') return true;
        if (!selectedChiefComplaintsForModal.length) return true;
        return false;
    }, [
        activeItem,
        notificationMessage,
        selectedChiefComplaintsForModal.length,
    ]);

    return (
        <div className={style.editNote}>
            <div className='centering'>
                <CommonLayout title={screenForPatient.title}>
                    {showMainNotificationMessage && (
                        <Notification
                            message={notificationMessage}
                            type={notificationType}
                        />
                    )}
                    {screenForPatient.component}
                </CommonLayout>
            </div>
        </div>
    );
};

export default HpiAdvance;
