import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import { ProductType, ViewType } from 'assets/enums/route.enums';
import {
    Institution as InstitutionClass,
    InstitutionType,
} from 'classes/institution.class';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import Stepper from 'components/Stepper/Stepper';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import { YesNoResponse } from 'constants/enums';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import useSelectedChiefComplaints from 'hooks/useSelectedChiefComplaints';
import { hpiHeaders } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestions from 'pages/EditNote/content/patientview/constants/initialQuestions';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import {
    initialSurveyAddText,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { Loader } from 'semantic-ui-react';
import BrowseNotes from '../BrowseNotes/BrowseNotes';
import CCSelection from './ChiefComplaintSelection/CCSelection';
import style from './HPI.module.scss';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from './NotesPage/NotePage';
import PreHPI from './PreHpi/PreHPI';
import { getInstitution } from 'modules/institution-api';
import { log } from 'modules/logging';
import invariant from 'tiny-invariant';
import { ApiResponse, Institution } from '@cydoc-ai/types';

const HPI = () => {
    const dispatch = useDispatch();
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
    const reduxState = useSelector((state: any) => ({
        _id: selectNoteId(state),
        patientView: selectPatientViewState(state),
        userSurveyState: selectInitialPatientSurvey(state),
        activeItem: selectActiveItem(state),
        additionalSurvey: state.additionalSurvey,
        chiefComplaints: state.chiefComplaints,
    }));
    const query = useQuery();
    const [isLoading, setIsLoading] = useState(false);
    const { isSignedIn, authLoading } = useAuth();
    const { view } = useParams<{ view: any }>();
    const history = useHistory();
    const selectedChiefComplaints = useSelectedChiefComplaints();
    const institutionId = query.get(HPIPatientQueryParams.INSTITUTION_ID);

    const [institution, setInstitution] = useState<InstitutionClass | null>(
        null
    );

    useEffect(() => {
        if (hpiHeaders) {
            const data = hpiHeaders;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }

        return () => {
            dispatch(updateActiveItem('CC'));
        };
    }, [dispatch]);

    useEffect(() => {
        const { graph, nodes, order } = reduxState.userSurveyState;

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

            // TODO: call this differently or remove it
            dispatch(initialSurveyAddText('6', favChiefComplaintsObj));
        }
    }, [dispatch, institution]);

    useEffect(() => {
        if (view === ViewType.DOCTOR) return;
        if (!institutionId) {
            history.replace('/');
            return;
        }

        const fetchInstitution = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchInstitution();
    }, [history, institutionId, query, view]);

    const [patientViewTabs, setPatientViewTabs] = useState([
        'InitialSurvey',
        'PreHPI',
    ]);

    useEffect(() => {
        if (view === ViewType.PATIENT)
            dispatch(updateActiveItem('InitialSurvey'));
        else if (view === ViewType.DOCTOR)
            dispatch(updateActiveItem('Generated Note'));

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }, [dispatch, view]);

    useEffect(() => {
        if (view !== ViewType.PATIENT) return;

        const steps = ['InitialSurvey', 'PreHPI'];
        if (
            reduxState.userSurveyState.nodes['3']?.response ===
                YesNoResponse.Yes ||
            reduxState.userSurveyState.nodes['4']?.response ===
                YesNoResponse.Yes
        ) {
            steps.push('CCSelection');
        } else {
            selectedChiefComplaints.forEach((item) => {
                dispatch(selectChiefComplaint(item));
            });
        }
        steps.push(...Object.keys(reduxState.chiefComplaints));
        setPatientViewTabs(steps);
    }, [
        view,
        reduxState.chiefComplaints,
        reduxState.userSurveyState,
        selectedChiefComplaints,
        dispatch,
    ]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNotificationMessage('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, []);

    const canWeMoveToChiefComplaintPages = useCallback(
        (name: string) => {
            const questionTenResponse = (
                (reduxState?.userSurveyState?.nodes?.['10']?.response ||
                    '') as string
            ).trim();

            if (
                (selectedChiefComplaints.includes(name) ||
                    name === ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM ||
                    name ===
                        ChiefComplaintsEnum.ANNUAL_GYN_EXAM_WELL_WOMAN_VISIT) &&
                (reduxState.userSurveyState.nodes['3'].response ===
                    YesNoResponse.Yes ||
                    reduxState.userSurveyState.nodes['4'].response ===
                        YesNoResponse.Yes) &&
                selectedChiefComplaints.length === 0 &&
                !questionTenResponse
            ) {
                return false;
            }

            return true;
        },
        [reduxState.userSurveyState.nodes, selectedChiefComplaints]
    );

    function onTabChange(name: string) {
        if (notificationMessage) {
            setNotificationMessage('');
        }

        const { legalFirstName, legalLastName, dateOfBirth } =
            reduxState.additionalSurvey;

        if (!(legalFirstName && legalLastName && dateOfBirth)) {
            setNotificationMessage('Please fill in all details to continue');
            return;
        }

        if (canWeMoveToChiefComplaintPages(name)) {
            dispatch(updateActiveItem(name));
            window.scrollTo(0, 0);
        }
    }

    // brings users to the next form when clicked
    const onNextClick = useCallback(() => {
        // do nothing
        if (!reduxState.patientView) return;

        if (notificationMessage) {
            setNotificationMessage('');
        }

        const tabs = patientViewTabs;
        const length = tabs.length;
        const nextTabIndex = tabs.indexOf(reduxState.activeItem) + 1;
        if (length === nextTabIndex) return;

        const nextTab = tabs[nextTabIndex];
        if (canWeMoveToChiefComplaintPages(nextTab)) {
            dispatch(updateActiveItem(nextTab));
            window.scrollTo(0, 0);
        }
    }, [
        canWeMoveToChiefComplaintPages,
        dispatch,
        notificationMessage,
        patientViewTabs,
        reduxState.activeItem,
        reduxState.patientView,
    ]);

    // brings users to the previous form when clicked
    const onPreviousClick = useCallback(() => {
        // do nothing
        if (!reduxState.patientView) return;

        if (notificationMessage) {
            setNotificationMessage('');
        }

        const tabs = patientViewTabs;
        const nextTabIndex = tabs.indexOf(reduxState.activeItem) - 1;
        if (-1 === nextTabIndex) return;

        const nextTab = tabs[tabs.indexOf(reduxState.activeItem) - 1];

        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    }, [
        dispatch,
        notificationMessage,
        patientViewTabs,
        reduxState.activeItem,
        reduxState.patientView,
    ]);

    useEffect(() => {
        switch (reduxState.activeItem) {
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
                            setErrorMessage={setNotificationMessage}
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
                    title: reduxState.activeItem,
                });
            }
        }
    }, [onNextClick, onPreviousClick, reduxState.activeItem]);

    // invalid view entered, redirect to hpi - patient view
    if ([ViewType.DOCTOR, ViewType.PATIENT].includes(view) === false) {
        return <Redirect to={`/${ProductType.HPI}/${ViewType.PATIENT}`} />;
    }

    if (view === ViewType.DOCTOR && !(isSignedIn || authLoading)) {
        return <Redirect to='/login' />;
    }

    if (isLoading && view === ViewType.PATIENT) {
        return <Loader active />;
    }

    return (
        <>
            <div className={style.editNote}>
                <div className='centering'>
                    {view === ViewType.PATIENT && (
                        <>
                            <Stepper
                                tabs={patientViewTabs}
                                onTabChange={onTabChange}
                            />
                            <CommonLayout title={screenForPatient.title}>
                                {notificationMessage && (
                                    <Notification
                                        message={notificationMessage}
                                        type={notificationType}
                                    />
                                )}
                                {screenForPatient.component}
                                {/* <QRCode showDownloadButton={true} /> */}
                            </CommonLayout>
                        </>
                    )}
                    {view === ViewType.DOCTOR && <BrowseNotes />}
                </div>
            </div>
        </>
    );
};

export default HPI;
