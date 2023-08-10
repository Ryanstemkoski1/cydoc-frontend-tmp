import React, { useEffect, useState } from 'react';
import { selectNoteId } from 'redux/selectors/currentNoteSelectors';
import {
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { updateActiveItem } from 'redux/actions/activeItemActions';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import { YesNoResponse } from 'constants/enums';
import Stepper from 'components/Stepper/Stepper';
import PreHPI from './PreHpi/PreHPI';
import InitialSurveyHPI from './InitialSurvey/InitialSurvey';
import CCSelection from './ChiefComplaintSelection/CCSelection';
import NewNotePage from './NotesPage/NotePage';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import style from './HPI.module.scss';
import { Redirect, useParams } from 'react-router';
import CommonLayout from 'components/CommonLayout/CommonLayout';
import Header from 'components/Header/Header';
import BrowseNotes from '../BrowseNotes/BrowseNotes';
import { selectChiefComplaint } from 'redux/actions/chiefComplaintsActions';
import { ChiefComplaintsEnum } from 'assets/enums/chiefComplaints.enums';
import Notification from 'components/tools/Notification/Notification';

const HPI = () => {
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');
    const [title, SetTitle] = useState('');

    const [patientViewTabs, setPatientViewTabs] = useState([
        'InitialSurvey',
        'PreHPI',
    ]);

    const reduxState = useSelector((state) => ({
        _id: selectNoteId(state),
        patientView: selectPatientViewState(state),
        userSurveyState: selectInitialPatientSurvey(state),
        activeItem: selectActiveItem(state),
        additionalSurvey: state.additionalSurvey,
        chiefComplaints: state.chiefComplaints,
    }));

    let { view } = useParams();

    useEffect(() => {
        if (view === 'patient') dispatch(updateActiveItem('InitialSurvey'));
        else if (view === 'doctor')
            dispatch(updateActiveItem('Generated Note'));

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }, [view]);

    useEffect(() => {
        if (view !== 'patient') return undefined;

        const steps = ['InitialSurvey', 'PreHPI'];
        if (
            reduxState.userSurveyState.nodes['3']?.response ===
                YesNoResponse.Yes ||
            reduxState.userSurveyState.nodes['4']?.response ===
                YesNoResponse.Yes
        ) {
            steps.push('CCSelection');
        } else {
            const selectedChiefComplaints = Object.keys(
                reduxState.chiefComplaints
            ).filter(
                (item) => item !== ChiefComplaintsEnum.ANNUAL_PHYSICAL_EXAM
            );

            // remove selected CC from state
            selectedChiefComplaints.forEach((item) => {
                dispatch(selectChiefComplaint(item));
            });
        }
        steps.push(...Object.keys(reduxState.chiefComplaints));
        setPatientViewTabs(steps);
    }, [view, reduxState.chiefComplaints, reduxState.userSurveyState]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorMessage('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [errorMessage]);

    useEffect(() => {
        const { title } = screenForPatient();
        SetTitle(title);
    }, [reduxState.activeItem]);

    function onTabChange(name) {
        if (errorMessage) {
            setErrorMessage('');
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
            setErrorMessage('Please fill in all details to continue');
            return;
        }

        dispatch(updateActiveItem(name));
        window.scrollTo(0, 0);
    }

    // brings users to the next form when clicked
    const onNextClick = () => {
        // do nothing
        if (!reduxState.patientView) return;

        if (errorMessage) {
            setErrorMessage('');
        }

        const tabs = patientViewTabs;
        const length = tabs.length;
        const nextTabIndex = tabs.indexOf(reduxState.activeItem) + 1;
        if (length === nextTabIndex) return;

        const nextTab = tabs[nextTabIndex];
        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    };

    // brings users to the previous form when clicked
    const onPreviousClick = () => {
        // do nothing
        if (!reduxState.patientView) return;

        if (errorMessage) {
            setErrorMessage('');
        }

        const tabs = patientViewTabs;
        const nextTabIndex = tabs.indexOf(reduxState.activeItem) - 1;
        if (-1 === nextTabIndex) return;

        const nextTab = tabs[tabs.indexOf(reduxState.activeItem) - 1];

        dispatch(updateActiveItem(nextTab));
        window.scrollTo(0, 0);
    };

    // invalid view entered, redirect to hpi - patient view
    if (['doctor', 'patient'].includes(view) === false) {
        return <Redirect to='/hpi/patient' />;
    }

    function screenForPatient() {
        switch (reduxState.activeItem) {
            case 'InitialSurvey': {
                return {
                    component: (
                        <InitialSurveyHPI
                            continue={onNextClick}
                            setErrorMessage={setErrorMessage}
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
                            setErrorMessage={setErrorMessage}
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
                            setErrorMessage={setErrorMessage}
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
                        />
                    ),
                    title: reduxState.activeItem,
                };
            }
        }
    }

    return (
        <>
            <Header />
            <div className={style.editNote}>
                <div className='centering'>
                    {view === 'patient' && (
                        <Stepper
                            tabs={patientViewTabs}
                            onTabChange={onTabChange}
                        />
                    )}
                    {view === 'patient' && (
                        <CommonLayout title={title}>
                            {errorMessage && (
                                <Notification message={errorMessage} />
                            )}
                            {/* TODO: NEED TO REFACTOR */}
                            {view === 'patient' && screenForPatient().component}
                        </CommonLayout>
                    )}
                    {view === 'doctor' && <BrowseNotes />}
                </div>
            </div>
        </>
    );
};

export default HPI;
