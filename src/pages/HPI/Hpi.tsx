import { ApiResponse, Institution } from '@cydoc-ai/types';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import {
    Institution as InstitutionClass,
    InstitutionType,
} from 'classes/institution.class';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import CustomModal from 'components/CustomModal/CustomModal';
import Stepper from 'components/Stepper/Stepper';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import useQuery from 'hooks/useQuery';
import useSelectedChiefComplaints from 'hooks/useSelectedChiefComplaints';
import {
    InstitutionConfig,
    InstitutionConfigResponse,
    getInstitution,
    getInstitutionConfig,
    validateDiseaseForm,
} from 'modules/institution-api';
import { log } from 'modules/logging';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { processKnowledgeGraph } from 'redux/actions/hpiActions';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
import { isResponseValid } from 'utils/getHPIFormData';
import { loadChiefComplaintsData } from 'utils/loadKnowledgeGraphData';
import CCSelection from './ChiefComplaintSelection/CCSelection';
import style from './HPI.module.scss';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from './NotesPage/NotePage';
import PreHPI from './PreHpi/PreHPI';

interface ScreenForPatientType {
    title: string;
    component: React.JSX.Element | null;
}

const HPI = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();

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
    const { userSurveyState, activeItem, additionalSurvey, hpiHeaders } =
        useSelector((state: CurrentNoteState) => ({
            userSurveyState: selectInitialPatientSurvey(state),
            activeItem: selectActiveItem(state),
            additionalSurvey: state.additionalSurvey,
            hpiHeaders: state.hpiHeaders,
        }));
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

    const selectedCC = useSelectedChiefComplaints();
    const selectedCCExceptInstitutionDefault = useMemo(() => {
        return selectedCC.filter(
            (item) => !institutionDefaultCC.includes(item)
        );
    }, [institutionDefaultCC, selectedCC]);

    const [showCCModal, setShowCCModal] = useState(false);
    const selectedChiefComplaints = useSelectedChiefComplaints();
    const [chiefComplaintsForModal, setChiefComplaintsForModal] = useState<
        { chiefComplaint: string; isSelected: boolean }[]
    >([]);
    const selectedChiefComplaintsForModal = useMemo(
        () => chiefComplaintsForModal.filter((item) => item.isSelected),
        [chiefComplaintsForModal]
    );

    const institutionId = query.get(HPIPatientQueryParams.INSTITUTION_ID);
    const onNextClickRef = useRef<() => void>();

    /* FUNCTIONS */
    const resetCurrentTabs = useCallback(() => {
        if (!institutionConfig) return [];

        const { showChiefComplaints, showDefaultForm } = institutionConfig;

        const newCurrentTabs = ['InitialSurvey', 'PreHPI'];

        if (showChiefComplaints) {
            newCurrentTabs.push('CCSelection');
        } else if (showDefaultForm) {
            newCurrentTabs.push(...institutionDefaultCC);
            // Add institution default CC
            institutionDefaultCC.forEach((item) => {
                if (!selectedCC.includes(item)) {
                    dispatch(selectChiefComplaint(item));
                }
            });
        }

        return newCurrentTabs;
    }, [institutionConfig, institutionDefaultCC, selectedCC]);

    const changeFavComplaintsBasedOnInstitute = useCallback(() => {
        const { graph, nodes, order } = userSurveyState;

        if (!institution) {
            if (
                !Object.keys(graph).length &&
                !Object.keys(nodes).length &&
                !Object.keys(order).length
            ) {
                dispatch(processSurveyGraph(initialQuestions));
            }
        } else {
            if (institution.type === InstitutionType.GYN) {
                initialQuestions.nodes['2'].category = 'ANNUAL_GYN_EXAM';
                initialQuestions.nodes['2'].doctorView =
                    ChiefComplaintsEnum.ANNUAL_GYN_EXAM_WELL_WOMAN_VISIT;

                dispatch(processSurveyGraph(initialQuestions));
            }
            const favChiefComplaintsObj: { [item: string]: any } = {};
            institution.favComplaints.forEach((item) => {
                favChiefComplaintsObj[item] = false;
            });

            dispatch(initialSurveyAddText('6', favChiefComplaintsObj));
        }
    }, [dispatch, institution, userSurveyState]);

    const onTabChange = useCallback(
        (name: string) => {
            if (notificationMessage) {
                setNotificationMessage('');
            }

            const { legalFirstName, legalLastName, dateOfBirth } =
                additionalSurvey;
            const appointmentDate = (
                (userSurveyState?.nodes?.['8']?.response ?? '') as string
            ).trim();

            if (!(legalFirstName && legalLastName && dateOfBirth)) {
                setNotificationMessage(
                    'Please fill in all details to continue'
                );
                return;
            }

            if (!appointmentDate) {
                setNotificationType(NotificationTypeEnum.ERROR);
                setNotificationMessage(
                    'Please confirm the date of your appointment.'
                );
                return;
            }

            dispatch(updateActiveItem(name));
        },
        [notificationMessage, userSurveyState, additionalSurvey]
    );

    const onPreviousClick = useCallback(() => {
        if (notificationMessage) setNotificationMessage('');

        const tabs = currentTabs;
        const nextTabIndex = tabs.indexOf(activeItem) - 1;
        if (-1 === nextTabIndex) return;

        const nextTab = tabs[nextTabIndex];

        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    }, [currentTabs, activeItem, notificationMessage]);

    const onNextClick = useCallback(() => {
        setShowCCModal(false);
        setChiefComplaintsForModal([]);

        if (notificationMessage) setNotificationMessage('');

        let newCurrentTabs = currentTabs;

        const node7Response = userSurveyState.nodes['7'].response ?? {};

        if (activeItem === 'CCSelection') {
            if (!selectedCC.length && !isResponseValid(node7Response)) {
                setNotificationMessage(
                    'You must select or describe at least one visit reason to proceed.'
                );
                setNotificationType(NotificationTypeEnum.ERROR);
                return;
            }

            if (selectedCCExceptInstitutionDefault.length > 3) {
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

            newCurrentTabs = [
                ...resetCurrentTabs(),
                ...selectedCC,
                ...institutionDefaultCC,
            ];

            newCurrentTabs = Array.from(new Set(newCurrentTabs));

            // Add institution default CC
            institutionDefaultCC.forEach((item) => {
                if (!selectedCC.includes(item)) {
                    dispatch(selectChiefComplaint(item));
                }
            });

            setCurrentTabs(newCurrentTabs);
        }

        const nextTabIndex = newCurrentTabs.indexOf(activeItem) + 1;
        if (newCurrentTabs.length === nextTabIndex) {
            return;
        }
        const nextTab = newCurrentTabs[nextTabIndex];
        dispatch(updateActiveItem(nextTab));
    }, [
        activeItem,
        notificationMessage,
        userSurveyState,
        selectedCCExceptInstitutionDefault,
        currentTabs,
        resetCurrentTabs,
        selectedCC,
        institutionDefaultCC,
    ]);

    const handleContinueForCCModal = () => {
        const unSelectedCCForCCModal = chiefComplaintsForModal.filter(
            (CC) => CC.isSelected === false
        );

        // Remove Chief Complaints for Redux State
        unSelectedCCForCCModal.forEach((CC) => {
            dispatch(selectChiefComplaint(CC.chiefComplaint));
        });

        setTimeout(() => onNextClickRef!.current!(), 0);
    };

    /* EFFECTS */
    useEffect(() => {
        switch (activeItem) {
            case 'InitialSurvey': {
                return setScreenForPatient({
                    component: (
                        <InitialSurveyHPI
                            continue={onNextClick}
                            setErrorMessage={setNotificationMessage}
                        />
                    ),
                    title: 'Please enter the details below',
                });
            }
            case 'PreHPI': {
                return setScreenForPatient({
                    component: (
                        <PreHPI
                            continue={onNextClick}
                            onPreviousClick={onPreviousClick}
                            notification={{
                                setNotificationMessage,
                                setNotificationType,
                            }}
                        />
                    ),
                    title: 'Help Cydoc personalize your questionnaire',
                });
            }
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
    }, [onNextClick, onPreviousClick, activeItem, institutionDefaultCC]);

    useEffect(() => {
        changeFavComplaintsBasedOnInstitute();
    }, [institution]);

    useEffect(() => {
        if (!institutionId) {
            history.replace('/');
            return;
        }

        const fetchInstitution = async () => {
            dispatch(setLoadingStatus(true));
            try {
                const validatedInstitution = (await getInstitution(
                    institutionId
                )) as { detail: Institution };
                const getInstitutionConfigResponse = await getInstitutionConfig(
                    institutionId
                );

                if (!(validatedInstitution as ApiResponse).errorMessage) {
                    const { id, name } = validatedInstitution.detail;
                    setInstitution(new InstitutionClass({ id, name }));
                } else {
                    log(`HPI error fetching institution`);
                    history.replace('/');
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
                    history.replace('/');
                }
            } catch (e) {
                log(`HPI error fetching institution`);
                history.replace('/');
            } finally {
                dispatch(setLoadingStatus(false));
            }
        };

        fetchInstitution();
    }, [history, institutionId, query]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (activeItem === 'CCSelection') {
            setCurrentTabs(['InitialSurvey', 'PreHPI', 'CCSelection']);
            // Remove institution default CC
            institutionDefaultCC.forEach((item) => {
                if (selectedCC.includes(item)) {
                    dispatch(selectChiefComplaint(item));
                }
            });
        }
    }, [activeItem]);

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

    useEffect(() => {
        onNextClickRef.current = onNextClick;
    }, [onNextClick]);

    useEffect(() => {
        if (!institutionConfig) return;

        const { diseaseForm } = institutionConfig;

        const diseaseFormKeys = diseaseForm.map((form) => form.diseaseKey);

        loadChiefComplaintsData(diseaseFormKeys).then((values) => {
            values.forEach((data) => dispatch(processKnowledgeGraph(data)));
        });

        setCurrentTabs(resetCurrentTabs());
    }, [institutionConfig]);

    useEffect(() => {
        dispatch(updateActiveItem('InitialSurvey'));

        if (hpiHeaders) {
            const data = knowledgeGraphAPI;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }

        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, []);

    return (
        <>
            <div className={style.editNote}>
                <div className='centering'>
                    <Stepper tabs={currentTabs} onTabChange={onTabChange} />
                    <CommonLayout title={screenForPatient.title}>
                        {notificationMessage && (
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
                        disabled={
                            selectedChiefComplaintsForModal.length > 3 ||
                            selectedChiefComplaintsForModal.length === 0
                        }
                        onClick={handleContinueForCCModal}
                    >
                        Continue
                    </button>
                }
            >
                <>
                    <h4>
                        Please select the top 3 conditions or symptoms that are
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
                                        const newChiefCompliants = [
                                            ...chiefComplaintsForModal,
                                        ];
                                        newChiefCompliants[index].isSelected =
                                            !newChiefCompliants[index]
                                                .isSelected;

                                        setChiefComplaintsForModal(
                                            newChiefCompliants
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
