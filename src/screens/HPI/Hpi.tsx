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
import CustomModal from '@components/CustomModal/CustomModal';
import Stepper from '@components/Stepper/Stepper';
import Notification, {
    NotificationTypeEnum,
} from '@components/tools/Notification/Notification';
import ToggleButton from '@components/tools/ToggleButton/ToggleButton';
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
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from '@redux/selectors/userViewSelectors';
import { isResponseValid } from '@utils/getHPIFormData';
import { loadChiefComplaintsData } from '@utils/loadKnowledgeGraphData';
import CCSelection from './ChiefComplaintSelection/CCSelection';
import style from './HPI.module.scss';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from './NotesPage/NotePage';
import PreHPI from './PreHpi/PreHPI';
import { selectAdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectHpiHeaders } from '@redux/reducers/hpiHeadersReducer';

export interface OnNextClickParams {
    allSelectedChiefComplaints?: string[];
    listTextChiefComplaints?: string[];
}

interface ScreenForPatientType {
    title: string;
    component: React.JSX.Element | null;
}

const HPI = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const router = useRouter();

    /* STATES */
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
    const activeItem = useSelector(selectActiveItem);
    const additionalSurvey = useSelector(selectAdditionalSurvey);
    const hpiHeaders = useSelector(selectHpiHeaders);

    const [currentTabs, setCurrentTabs] = useState<string[]>([
        'InitialSurvey',
        'PreHPI',
        'CCSelection',
    ]);
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

    const institutionId = query?.get(HPIPatientQueryParams.INSTITUTION_ID);

    /* FUNCTIONS */
    const resetCurrentTabs = useCallback(() => {
        if (!institutionConfig) return [];

        const { showChiefComplaints, showDefaultForm } = institutionConfig;

        const newCurrentTabs = ['InitialSurvey', 'PreHPI'];

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
            Object.keys(graph).length === 0 ||
            Object.keys(nodes).length === 0 ||
            Object.keys(order).length === 0
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
    }, [dispatch, institution]);

    // FIXME: this logic should be combined with the logic in the next button handler! it currently doesn't work the same
    const onTabChange = useCallback(
        (name: string) => {
            // NOTE: disabling clicking the stepper for now
            // logic for which steps to display is in multiple functions in Hpi.tsx
            // this logic conflicts depending on if tabs are changed by clicking or by the next button
            // re-enable stepper button clicking when this logic is consolidated in utils function
            return;

            if (notificationMessage) {
                setNotificationMessage('');
            }

            const currentActiveItemIndex = currentTabs.findIndex(
                (item) => item === activeItem
            );

            const nextActiveItemIndex = currentTabs.findIndex(
                (item) => item === name
            );

            if (currentActiveItemIndex < nextActiveItemIndex) {
                const { legalFirstName, legalLastName, socialSecurityNumber } =
                    additionalSurvey;

                const dateOfBirth = new Date(additionalSurvey.dateOfBirth);

                const appointmentDate = (
                    (userSurveyState?.nodes?.['8']?.response ?? '') as string
                ).trim();

                if (
                    legalFirstName.trim() === '' ||
                    legalLastName.trim() === '' ||
                    dateOfBirth.toString() === 'Invalid Date'
                ) {
                    setNotificationType(NotificationTypeEnum.ERROR);
                    setNotificationMessage(
                        'Please fill in all details to continue'
                    );
                    return;
                }

                if (new Date() < dateOfBirth) {
                    setNotificationType(NotificationTypeEnum.ERROR);
                    setNotificationMessage(
                        'Date of birth should be before current date'
                    );
                    return;
                }

                if (dateOfBirth.getFullYear() < 1900) {
                    setNotificationType(NotificationTypeEnum.ERROR);
                    setNotificationMessage(
                        `Please enter a valid date of birth between 1900 and ${new Date().getFullYear()}.`
                    );
                    return;
                }

                if (
                    socialSecurityNumber.trim() &&
                    socialSecurityNumber.trim().length !== 4
                ) {
                    setNotificationType(NotificationTypeEnum.ERROR);
                    setNotificationMessage(
                        'Social security number should consist of 4 numbers'
                    );
                    return;
                }

                if (!appointmentDate) {
                    if (name !== 'PreHPI') {
                        setNotificationType(NotificationTypeEnum.ERROR);
                        setNotificationMessage(
                            'Please confirm the date of your appointment.'
                        );
                    }
                    dispatch(updateActiveItem('PreHPI'));
                    return;
                }
            }

            dispatch(updateActiveItem(name));
        },
        [
            notificationMessage,
            currentTabs,
            dispatch,
            activeItem,
            additionalSurvey,
            userSurveyState?.nodes,
        ]
    );

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

    /* EFFECTS */
    useEffect(() => {
        let component: React.ReactNode = null;
        let title = '';

        switch (activeItem) {
            case 'InitialSurvey': {
                component = (
                    <InitialSurveyHPI
                        continue={onNextClick}
                        setErrorMessage={setNotificationMessage}
                    />
                );
                title = 'Please enter the details below';
                break;
            }
            case 'PreHPI': {
                component = (
                    <PreHPI
                        continue={onNextClick}
                        onPreviousClick={onPreviousClick}
                        notification={{
                            setNotificationMessage,
                            setNotificationType,
                        }}
                    />
                );
                title = 'Help Cydoc personalize your questionnaire';
                break;
            }
            case 'CCSelection': {
                component = (
                    <CCSelection
                        continue={onNextClick}
                        onPreviousClick={onPreviousClick}
                        notification={{
                            setNotificationMessage,
                            setNotificationType,
                        }}
                        defaultInstitutionChiefComplaints={institutionDefaultCC}
                    />
                );
                title = `Please select the top 3 conditions or symptoms you'd like to discuss`;
                break;
            }
            default: {
                component = (
                    <NewNotePage
                        onNextClick={onNextClick}
                        onPreviousClick={onPreviousClick}
                        notification={{
                            setNotificationMessage,
                            setNotificationType,
                        }}
                    />
                );
                title =
                    activeItem in hpiHeaders.parentNodes
                        ? hpiHeaders.parentNodes[activeItem].patientView
                        : activeItem;
            }
        }

        setScreenForPatient({ component, title });
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
            // router.replace('/');
            return;
        }

        const fetchInstitution = async () => {
            dispatch(setLoadingStatus(true));
            try {
                const getInstitutionConfigResponse =
                    await getInstitutionConfig(institutionId);

                if (
                    !(getInstitutionConfigResponse as ApiResponse).errorMessage
                ) {
                    const result = (
                        getInstitutionConfigResponse as InstitutionConfigResponse
                    ).config;

                    const { id, name } = result;
                    setInstitution(new InstitutionClass({ id, name }));

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
        dispatch(updateActiveItem('InitialSurvey'));
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
        <>
            <div className={style.editNote}>
                <div className='centering'>
                    <Stepper tabs={currentTabs} onTabChange={onTabChange} />
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

            <CustomModal
                maxWidth='720px'
                onClose={() => setShowCCModal(false)}
                modalVisible={showCCModal}
                title={
                    <h3>
                        We found the following conditions or symptoms matching
                        your concerns.
                    </h3>
                }
                footerNode={
                    <button
                        className='button'
                        disabled={selectedChiefComplaintsForModal.length === 0}
                        onClick={handleContinueForCCModal}
                    >
                        Continue
                    </button>
                }
            >
                <>
                    {notificationMessage && (
                        <Notification
                            message={notificationMessage}
                            type={notificationType}
                        />
                    )}
                    <h4>
                        Please select up to 3 conditions or symptoms that are
                        most important to you.
                    </h4>

                    <div className={`${style.editNote__btnWrap} flex-wrap`}>
                        {chiefComplaintsForModal.map(
                            ({ chiefComplaint, isSelected }, index) => (
                                <ToggleButton
                                    key={chiefComplaint}
                                    className='tag_text btn-space'
                                    active={isSelected}
                                    condition={chiefComplaint}
                                    title={
                                        chiefComplaint in hpiHeaders.parentNodes
                                            ? hpiHeaders.parentNodes[
                                                  chiefComplaint
                                              ].patientView
                                            : chiefComplaint
                                    }
                                    onToggleButtonClick={() => {
                                        const newChiefComplaints = [
                                            ...chiefComplaintsForModal,
                                        ];

                                        if (
                                            !newChiefComplaints[index]
                                                .isSelected &&
                                            selectedChiefComplaintsForModal.length ===
                                                3
                                        ) {
                                            setNotificationMessage(
                                                'The maximum of 3 has been reached. Please un-select an existing option before adding a new one.'
                                            );
                                            setNotificationType(
                                                NotificationTypeEnum.ERROR
                                            );
                                            return;
                                        }
                                        newChiefComplaints[index].isSelected =
                                            !newChiefComplaints[index]
                                                .isSelected;

                                        setChiefComplaintsForModal(
                                            newChiefComplaints
                                        );
                                    }}
                                />
                            )
                        )}
                    </div>
                </>
            </CustomModal>
        </>
    );
};

export default HPI;
