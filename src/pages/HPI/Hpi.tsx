import { ApiResponse, Institution } from '@cydoc-ai/types';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import {
    Institution as InstitutionClass,
    InstitutionType,
} from 'classes/institution.class';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import Stepper from 'components/Stepper/Stepper';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import useQuery from 'hooks/useQuery';
import { getSelectedChiefCompliants } from 'hooks/useSelectedChiefComplaints';
import { getInstitution } from 'modules/institution-api';
import { log } from 'modules/logging';
import { hpiHeaders as knowledgeGraphAPI } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectInitialPatientSurvey } from 'redux/selectors/userViewSelectors';
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
    const {
        userSurveyState,
        activeItem,
        additionalSurvey,
        chiefComplaints,
        hpiHeaders,
    } = useSelector((state: CurrentNoteState) => ({
        userSurveyState: selectInitialPatientSurvey(state),
        activeItem: selectActiveItem(state),
        additionalSurvey: state.additionalSurvey,
        chiefComplaints: state.chiefComplaints,
        hpiHeaders: state.hpiHeaders,
    }));
    const [currentTabs, setCurrentTabs] = useState<string[]>([]);
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

            const nodeTenResponse = (
                (userSurveyState?.nodes?.['10']?.response ?? '') as string
            ).trim();

            if (
                getSelectedChiefCompliants(chiefComplaints).length &&
                nodeTenResponse
            )
                dispatch(initialSurveyAddText('10', ''));

            dispatch(updateActiveItem(name));
            window.scrollTo(0, 0);
        },
        [
            notificationMessage,
            chiefComplaints,
            userSurveyState,
            additionalSurvey,
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
    }, [currentTabs, activeItem, notificationMessage]);

    const onNextClick = useCallback(() => {
        if (notificationMessage) setNotificationMessage('');

        const tabs = currentTabs;
        const length = tabs.length;
        const nextTabIndex = tabs.indexOf(activeItem) + 1;
        if (length === nextTabIndex) return;

        const nextTab = tabs[nextTabIndex];

        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    }, [currentTabs, activeItem, notificationMessage]);

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
                            patientView={false} // TODO: is this correct? seems like it would be patient view
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
                            activeItem=''
                            patientView={false} // TODO: is this correct? seems like it would be patient view
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
                    title: activeItem,
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
        setCurrentTabs([
            'InitialSurvey',
            'PreHPI',
            'CCSelection',
            ...getSelectedChiefCompliants(chiefComplaints),
        ]);
    }, [chiefComplaints]);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }, [activeItem]);

    useEffect(() => {
        let timeoutId: any;
        if (notificationMessage) {
            timeoutId = setTimeout(() => {
                setNotificationMessage('');
            }, 3000);
        }
        return () => {
            clearTimeout(timeoutId);
        };
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

    return (
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
    );
};

export default HPI;
