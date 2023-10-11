import { ApiResponse, Institution } from '@cydoc-ai/types';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import axios from 'axios';
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
import { graphClientURL } from 'constants/api';
import useQuery from 'hooks/useQuery';
import useSelectedChiefComplaints from 'hooks/useSelectedChiefComplaints';
import { getInstitution } from 'modules/institution-api';
import { log } from 'modules/logging';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import React, { useCallback, useEffect, useState } from 'react';
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
import CCSelection from './ChiefComplaintSelection/CCSelection';
import style from './HPI.module.scss';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from './NotesPage/NotePage';
import PreHPI from './PreHpi/PreHPI';

const HPI = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();

    /* STATES */
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
    const [screenForPatient, setScreenForPatient] = useState<{
        title: string;
        component: React.JSX.Element | null;
    }>({
        title: '',
        component: null,
    });
    const [institution, setInstitution] = useState<InstitutionClass | null>(
        null
    );
    const [skipCC, setSkipCC] = useState(false);
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
    const [showCCModal, setShowCCModal] = useState(false);
    const selectedChiefComplaints = useSelectedChiefComplaints();
    const [newSelectedCC, setNewSelectedCC] = useState<string[]>([]);

    const institutionId = query.get(HPIPatientQueryParams.INSTITUTION_ID);

    /* FUNCTIONS */
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
            //TODO: PATCH FOR signature perinatal
            if (
                (institution?.name || '')
                    .toLowerCase()
                    .includes('signature perinatal')
            ) {
                setSkipCC(true);
            }
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
            window.scrollTo(0, 0);
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
        setNewSelectedCC([]);

        if (notificationMessage) setNotificationMessage('');

        let newCurrentTabs = currentTabs;

        const node7Response = userSurveyState.nodes['7'].response ?? {};

        if (activeItem === 'CCSelection') {
            if (
                !selectedChiefComplaints.length &&
                !isResponseValid(node7Response)
            ) {
                setNotificationMessage(
                    'You must select or describe at least one visit reason to proceed.'
                );
                setNotificationType(NotificationTypeEnum.ERROR);
            }

            if (selectedChiefComplaints.length > 3) {
                setNewSelectedCC([...selectedChiefComplaints]);
                setShowCCModal(true);
                return;
            }

            newCurrentTabs = [
                'InitialSurvey',
                'PreHPI',
                'CCSelection',
                ...selectedChiefComplaints,
            ];
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
        selectedChiefComplaints,
        currentTabs,
    ]);

    const loadCCData = async () => {
        const response = await axios.get(
            graphClientURL + '/graph/category/' + 'SIGPERI_ROOT' + '/4'
        );
        dispatch(processKnowledgeGraph(response.data));
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
    }, [onNextClick, onPreviousClick, activeItem]);

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

                if (!(validatedInstitution as ApiResponse).errorMessage) {
                    const { id, name } = validatedInstitution.detail;
                    setInstitution(new InstitutionClass({ id, name }));
                } else {
                    log(`HPI error fetching institution`);
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
        if (skipCC) {
            dispatch(
                selectChiefComplaint('Signature Perinatal Center Questionnaire')
            );
            setCurrentTabs([
                'InitialSurvey',
                'PreHPI',
                'Signature Perinatal Center Questionnaire',
            ]);

            loadCCData();
        }
    }, [skipCC]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (activeItem === 'CCSelection') {
            setCurrentTabs(['InitialSurvey', 'PreHPI', 'CCSelection']);
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
        dispatch(updateActiveItem('InitialSurvey'));

        if (hpiHeaders) {
            const data = knowledgeGraphAPI;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }

        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, []);

    const selectedChiefComplaintsOverflowBy =
        selectedChiefComplaints.length - 3;

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
                        We found the following conditions or symptoms matching your
                        concerns.
                    </h3>
                }
                footerNode={
                    <button
                        className='button'
                        disabled={
                            selectedChiefComplaints.length > 3 ||
                            selectedChiefComplaints.length === 0
                        }
                        onClick={onNextClick}
                    >
                        Continue
                    </button>
                }
            >
                <>
                    {selectedChiefComplaintsOverflowBy > 0 && (
                        <h4>
                            Deselect any {selectedChiefComplaintsOverflowBy}{' '}
                            {`${
                                selectedChiefComplaintsOverflowBy > 1
                                    ? 'conditions or symptoms'
                                    : 'condition or symptom'
                            }`}{' '}
                            from below to proceed.
                        </h4>
                    )}
                    <div className={`${style.editNote__btnWrap} flex-wrap`}>
                        {newSelectedCC.map((item) => (
                            <ToggleButton
                                key={item}
                                className='tag_text btn-space'
                                active={selectedChiefComplaints.includes(item)}
                                condition={item}
                                title={
                                    item in hpiHeaders.parentNodes
                                        ? hpiHeaders.parentNodes[item]
                                              .patientView
                                        : item
                                }
                                onToggleButtonClick={(e: any) => {
                                    dispatch(selectChiefComplaint(item));
                                }}
                            />
                        ))}
                    </div>
                </>
            </CustomModal>
        </>
    );
};

export default HPI;
