import React, { useState, useEffect } from 'react';
import { Dropdown, Menu, Header, Image, Icon, Button } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import {
    HIDE_CYDOC_IN_NAV_MENU_BP,
    LOGGEDIN_NAV_MENU_MOBILE_BP,
} from 'constants/breakpoints.js';
import Logo from '../../assets/cydoc-logo.svg';
import NoteNameMenuItem from './NoteNameMenuItem';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import './NavMenu.css';
import {
    selectDoctorViewState,
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { changeUserView, UserViewAction } from 'redux/actions/userViewActions';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    updateActiveItem,
    UpdateActiveItemAction,
} from 'redux/actions/activeItemActions';
import { YesNoResponse } from 'constants/enums';
import { initialSurveyProps } from 'pages/EditNote/content/patientview/InitialSurvey';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import constants from '../../constants/constants.json';
import './NavMenu.css';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';

interface ConnectedNavMenuProps {
    className?: string;
    // For whether to stack another menu above/below
    attached?: 'top' | 'bottom';
    // Whether to display or hide the note name
    displayNoteName?: boolean;
}

// Navigation Bar component that will go at the top of most pages
const ConnectedNavMenu: React.FunctionComponent<Props> = (props: Props) => {
    const {
        className,
        attached = 'top',
        displayNoteName = false,
        patientView,
        doctorView,
        changeUserView,
        updateActiveItem,
    } = props;

    const { isSignedIn, signOut, loginCorrect } = useAuth();
    const { user, isManager } = useUser();

    // email/password correct but waiting on MFA? allow users to logOut
    const userCurrentlyLoggingIn = loginCorrect && !isSignedIn;

    console.log(`user manager: ${isManager}`, {
        user,
        isManager,
    });

    const [windowWidth, setWindowWidth] = useState(0);

    // Set event listeners for window resize to determine mobile vs web view
    useEffect(() => {
        const updateDimensions = (): void => {
            setWindowWidth(
                typeof window !== 'undefined' ? window.innerWidth : 0
            );
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return (): void =>
            window.removeEventListener('resize', updateDimensions);
    }, []);

    // Display warning when user tries to close the tab
    useEffect(() => {
        const handleTabClose = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            // Some browsers do not support overriding this message (ex: Chrome), so the custom message will not display
            // in all browsers.
            return (event.returnValue =
                'Are you sure you want to exit? Your current note will not be saved.');
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    const collapseLoggedInNav = windowWidth < LOGGEDIN_NAV_MENU_MOBILE_BP;
    const hideCydoc = windowWidth < HIDE_CYDOC_IN_NAV_MENU_BP;

    const dropdownOptions = [
        {
            as: Link,
            to: '/editprofile',
            key: 'editProfile',
            text: 'Edit Profile',
            icon: 'setting',
            selected: false,
            active: window.location.href.includes('editprofile'),
        },
        {
            as: Link,
            to: '/profilesecurity',
            key: 'profileSecurity',
            text: 'Profile Security',
            icon: 'lock',
            selected: false,
            active: window.location.href.includes('profilesecurity'),
        },
        {
            as: Link,
            to: '/',
            key: 'logout',
            text: 'Log Out',
            icon: 'sign out',
            onClick: signOut,
            selected: false,
            active: false,
        },
    ];

    // Use for redirecting
    const history = useHistory();

    const navigateToHome = () => {
        history.push('/dashboard');
    };

    const logoNotLoggedIn = () => {
        history.push('/');
    };

    const loginButton = (
        <Button
            as={Link}
            color='teal'
            name='login'
            to='/login'
            content='Login'
            id='nav-menu__login-button'
        />
    );

    const logOutButton = (
        <Button
            as={Link}
            color='teal'
            name='logOut'
            onClick={signOut}
            content='Log Out'
            id='nav-menu__login-button'
        />
    );

    const userManager = isManager ? (
        <Menu.Item>
            <Button
                basic
                color='teal'
                name='users'
                content={collapseLoggedInNav ? undefined : 'Manager Users'}
                icon='users'
                onClick={() => history.push('/managerdashboard')}
            />
        </Menu.Item>
    ) : null;
    // Menu items when not logged in
    const defaultMenuItems = (
        // email/password correct but waiting on MFA? allow users to logOut
        <Menu.Item>
            {userCurrentlyLoggingIn ? logOutButton : loginButton}
            <Button
                icon='plus'
                content='Sign Up'
                size='small'
                onClick={() => {
                    if (userCurrentlyLoggingIn) {
                        // if the user tries to signUp while waiting for MFA, sign them out
                        signOut();
                    }
                    history.push('/sign-up');
                }}
            />
        </Menu.Item>
    );
    // Menu items when logged in
    const loggedInMenuItems = (
        <>
            {userManager}
            <Menu.Item>
                <Button
                    basic
                    color='teal'
                    name='home'
                    content={collapseLoggedInNav ? undefined : 'Home'}
                    icon='hospital outline'
                    onClick={navigateToHome}
                />
            </Menu.Item>
            <Menu.Item>
                <Dropdown
                    button
                    basic
                    color='teal'
                    floating
                    name='profile'
                    className={`profile-button ${
                        collapseLoggedInNav ? 'profile-mobile' : ''
                    }`}
                    options={dropdownOptions}
                    trigger={
                        <span>
                            <Icon
                                name='user outline'
                                className={
                                    collapseLoggedInNav
                                        ? 'profile-mobile-icon'
                                        : ''
                                }
                            />
                            {collapseLoggedInNav ? undefined : user?.firstName}
                        </span>
                    }
                />
            </Menu.Item>
        </>
    );

    const checkPatientView = () => {
        if (!constants.PATIENT_VIEW_TAB_NAMES.includes(props.activeItem)) {
            return false;
        }
        const { userSurveyState, additionalSurvey } = props;
        const selected =
            userSurveyState.nodes['2'].response === YesNoResponse.Yes ||
            userSurveyState.nodes['3'].response === YesNoResponse.Yes ||
            userSurveyState.nodes['4'].response === YesNoResponse.Yes;
        if (
            !selected ||
            !userSurveyState.nodes['8'].response ||
            !additionalSurvey.legalFirstName ||
            !additionalSurvey.legalLastName ||
            !additionalSurvey.dateOfBirth ||
            !additionalSurvey.socialSecurityNumber
        ) {
            return false;
        }
        return true;
    };

    return (
        <Menu
            className={`${className} nav-menu nav-bar ${
                displayNoteName && doctorView ? 'nav-bar-input' : ''
            }`}
            attached={attached}
        >
            {isSignedIn ? (
                <Menu.Item className='logo-menu' onClick={navigateToHome}>
                    <Image
                        src={Logo}
                        className={
                            collapseLoggedInNav
                                ? 'logo-circle-mobile'
                                : 'logo-circle'
                        }
                    />
                    {!displayNoteName && !hideCydoc && (
                        <Header
                            as='h1'
                            className={`${
                                collapseLoggedInNav
                                    ? 'logo-text-mobile'
                                    : 'logo-text'
                            }`}
                            content='Cydoc'
                        />
                    )}
                </Menu.Item>
            ) : (
                <Menu.Item className='logo-menu' onClick={logoNotLoggedIn}>
                    <Image
                        src={Logo}
                        className={`${
                            collapseLoggedInNav
                                ? 'logo-circle-mobile'
                                : 'logo-circle'
                        }`}
                    />
                    {!displayNoteName && !hideCydoc && (
                        <Header
                            as='h1'
                            className={`${
                                collapseLoggedInNav
                                    ? 'logo-text-mobile'
                                    : 'logo-text'
                            }`}
                            content='Cydoc'
                        />
                    )}
                </Menu.Item>
            )}

            {/* When parent is EditNote, then display the note name item */}
            {displayNoteName && doctorView && (
                <NoteNameMenuItem mobile={collapseLoggedInNav} />
            )}
            {isSignedIn && history.location.pathname.length > 1 ? (
                collapseLoggedInNav ? (
                    <Button.Group>
                        <Button
                            compact
                            onClick={() => {
                                changeUserView('Patient View');
                                if (!checkPatientView()) updateActiveItem('CC');
                            }}
                            className={`hpi-ph-button${
                                patientView ? '-selected' : ''
                            }`}
                        >
                            Patient
                        </Button>
                        <Button.Or />
                        <Button
                            compact
                            onClick={() => changeUserView('Doctor View')}
                            className={`hpi-ph-button${
                                !patientView ? '-selected' : ''
                            }`}
                        >
                            Doctor
                        </Button>
                    </Button.Group>
                ) : (
                    <Button.Group>
                        <Button
                            style={{ maxHeight: '75%' }}
                            onClick={() => {
                                changeUserView('Patient View');
                                if (!checkPatientView()) updateActiveItem('CC');
                            }}
                            className={`hpi-ph-button${
                                patientView ? '-selected' : ''
                            }`}
                        >
                            Patient View
                        </Button>
                        <Button.Or />
                        <Button
                            style={{ maxHeight: '75%' }}
                            onClick={() => changeUserView('Doctor View')}
                            className={`hpi-ph-button${
                                !patientView ? '-selected' : ''
                            }`}
                        >
                            Doctor View
                        </Button>
                    </Button.Group>
                )
            ) : (
                ''
            )}

            {/* Navigation links */}
            <Menu.Menu position='right'>
                {/* Menu will have different options depending on whether the user is logged in or not */}
                {isSignedIn ? loggedInMenuItems : defaultMenuItems}
            </Menu.Menu>
        </Menu>
    );
};

interface DispatchProps {
    changeUserView: (userView: string) => UserViewAction;
    updateActiveItem: (updatedItem: string) => UpdateActiveItemAction;
}

const mapDispatchToProps = {
    changeUserView,
    updateActiveItem,
};

export interface userViewProps {
    patientView: boolean;
    doctorView: boolean;
}
export interface AdditionalSurveyProps {
    additionalSurvey: additionalSurvey;
}

export interface ActiveItemProps {
    activeItem: string;
}

const mapStateToProps = (
    state: CurrentNoteState
): userViewProps &
    initialSurveyProps &
    AdditionalSurveyProps &
    ActiveItemProps => {
    return {
        patientView: selectPatientViewState(state),
        doctorView: selectDoctorViewState(state),
        userSurveyState: selectInitialPatientSurvey(state),
        additionalSurvey: state.additionalSurvey,
        activeItem: selectActiveItem(state),
    };
};

type Props = ConnectedNavMenuProps &
    userViewProps &
    DispatchProps &
    initialSurveyProps &
    AdditionalSurveyProps &
    ActiveItemProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedNavMenu);
