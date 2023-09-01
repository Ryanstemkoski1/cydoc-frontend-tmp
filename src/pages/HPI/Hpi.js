import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import { ProductType, ViewType } from 'assets/enums/route.enums';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import Header from 'components/Header/Header';
import Stepper from 'components/Stepper/Stepper';
import Notification, {
    NotificationTypeEnum,
} from 'components/tools/Notification/Notification';
import { stagingClient } from 'constants/api';
import { YesNoResponse } from 'constants/enums';
import useQuery from 'hooks/useQuery';
import { hpiHeaders } from 'pages/EditNote/content/hpi/knowledgegraph/src/API';
import initialQuestions from 'pages/EditNote/content/patientview//constants/initialQuestions.json';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { setClinicianDetail } from 'redux/actions/clinicianDetailActions';
import { saveHpiHeader } from 'redux/actions/hpiHeadersActions';
import {
    initialSurveyAddDateOrPlace,
    processSurveyGraph,
} from 'redux/actions/userViewActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { Loader } from 'semantic-ui-react';
import AuthContext from '../../contexts/AuthContext';
import BrowseNotes from '../BrowseNotes/BrowseNotes';
import CCSelection from './ChiefComplaintSelection/CCSelection';
import style from './HPI.module.scss';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import NewNotePage from './NotesPage/NotePage';
import PreHPI from './PreHpi/PreHPI';

const HPI = () => {
    const dispatch = useDispatch();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState(
        NotificationTypeEnum.ERROR
    );
    const [title, SetTitle] = useState('');
    const reduxState = useSelector((state) => ({
        _id: selectNoteId(state),
        patientView: selectPatientViewState(state),
        userSurveyState: selectInitialPatientSurvey(state),
        activeItem: selectActiveItem(state),
        additionalSurvey: state.additionalSurvey,
        chiefComplaints: state.chiefComplaints,
    }));
    const query = useQuery();
    const [isLoading, setIsLoading] = useState(false);
    let { view } = useParams();
    const history = useHistory();
    const context = useContext(AuthContext);
    const selectedChiefComplaints = useMemo(
        () =>
            Object.keys(reduxState.chiefComplaints).filter(
                (item) => item !== ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM
            ),
        [reduxState.chiefComplaints]
    );

    useEffect(() => {
        if (
            !Object.keys(reduxState.userSurveyState.graph).length &&
            !Object.keys(reduxState.userSurveyState.nodes).length &&
            !Object.keys(reduxState.userSurveyState.order).length
        )
            dispatch(processSurveyGraph(initialQuestions));

        if (hpiHeaders) {
            const data = hpiHeaders;
            data.then((res) => dispatch(saveHpiHeader(res.data)));
        }
    }, []);

    useEffect(() => {
        if (view === ViewType.DOCTOR) return;

        const [clinicianId, institutionId] = [
            query.get(HPIPatientQueryParams.CLINICIAN_ID),
            query.get(HPIPatientQueryParams.INSTITUTION_ID),
        ];

        if (!clinicianId || !institutionId) {
            history.replace(`/${ProductType.HPI}/${ViewType.PATIENT}`);
            return;
        }

        setIsLoading(true);

        stagingClient
            .get(`/institution/${institutionId}/${clinicianId}/member`)
            .then((res) => {
                dispatch(setClinicianDetail(res.data.detail));
                // setting the userSurveyState.node[9] value to clinician's last name.
                dispatch(
                    initialSurveyAddDateOrPlace(9, res.data.detail.lastName)
                );
            })
            .catch((_error) => {
                history.replace(`/${ProductType.HPI}/${ViewType.PATIENT}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [query, view]);

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
    }, [view]);

    useEffect(() => {
        if (view !== ViewType.PATIENT) return undefined;

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
    }, [view, reduxState.chiefComplaints, reduxState.userSurveyState]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNotificationMessage('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [notificationMessage]);

    useEffect(() => {
        const { title } = screenForPatient();
        SetTitle(title);
    }, [reduxState.activeItem]);

    function canWeMoveToChiefComplaintPages(name) {
        const questionTenResponse = (
            reduxState.userSurveyState.nodes['10'].response || ''
        ).trim();

        if (
            (selectedChiefComplaints.includes(name) ||
                name === ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM) &&
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
    }

    function onTabChange(name) {
        if (notificationMessage) {
            setNotificationMessage('');
        }

        const {
            legalFirstName,
            legalLastName,
            dateOfBirth,
            socialSecurityNumber,
        } = reduxState.additionalSurvey;

        if (
            !(
                legalFirstName &&
                legalLastName &&
                dateOfBirth &&
                socialSecurityNumber
            )
        ) {
            setNotificationMessage('Please fill in all details to continue');
            return;
        }

        if (canWeMoveToChiefComplaintPages(name)) {
            dispatch(updateActiveItem(name));
            window.scrollTo(0, 0);
        }
    }

    // brings users to the next form when clicked
    const onNextClick = () => {
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
    };

    // brings users to the previous form when clicked
    const onPreviousClick = () => {
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
    };

    // invalid view entered, redirect to hpi - patient view
    if ([ViewType.DOCTOR, ViewType.PATIENT].includes(view) === false) {
        return <Redirect to={`/${ProductType.HPI}/${ViewType.PATIENT}`} />;
    }

    // on doctor view authentication is must
    if (view === ViewType.DOCTOR && !context.token) {
        return <Redirect to='/login' />;
    }

    if (isLoading && view === ViewType.PATIENT) {
        return <Loader active />;
    }

    function screenForPatient() {
        switch (reduxState.activeItem) {
            case 'InitialSurvey': {
                return {
                    component: (
                        <InitialSurveyHPI
                            continue={onNextClick}
                            setErrorMessage={setNotificationMessage}
                        />
                    ),
                    title: 'Please enter the details below',
                };
            }
            case 'PreHPI': {
                return {
                    component: (
                        <PreHPI
                            continue={onNextClick}
                            onPreviousClick={onPreviousClick}
                            setErrorMessage={setNotificationMessage}
                        />
                    ),
                    title: 'Help Cydoc personalize your questionnaire',
                };
            }
            case 'CCSelection': {
                return {
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
                };
            }
            default: {
                return {
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
                };
            }
        }
    }

    return (
        <>
            <Header view={view} />
            <div className={style.editNote}>
                <div className='centering'>
                    {view === ViewType.PATIENT && (
                        <>
                            <Stepper
                                tabs={patientViewTabs}
                                onTabChange={onTabChange}
                            />
                            <CommonLayout title={title}>
                                {notificationMessage && (
                                    <Notification
                                        message={notificationMessage}
                                        type={notificationType}
                                    />
                                )}
                                {/* TODO: NEED TO REFACTOR */}
                                {screenForPatient().component}
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
