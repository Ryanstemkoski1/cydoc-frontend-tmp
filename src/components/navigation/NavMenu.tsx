import React, { useContext, useState, useEffect } from 'react';
import { Dropdown, Menu, Header, Image, Icon, Button } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import {
    HIDE_CYDOC_IN_NAV_MENU_BP,
    LOGGEDIN_NAV_MENU_MOBILE_BP,
} from 'constants/breakpoints.js';
import AuthContext from '../../contexts/AuthContext';
import Logo from '../../assets/cydoc-logo.svg';
import NoteNameMenuItem, { Context } from './NoteNameMenuItem';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import './NavMenu.css';
import SignUpModal from 'pages/Account/SignUpModal';
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

interface ConnectedNavMenuProps {
    className: string;
    // For whether to stack another menu above/below
    attached: 'top' | 'bottom';
    // Whether to display or hiee the note name
    displayNoteName: boolean;
}

// Navigation Bar component that will go at the top of most pages
const ConnectedNavMenu: React.FunctionComponent<Props> = (props: Props) => {
    const {
        className,
        attached,
        displayNoteName,
        patientView,
        doctorView,
        changeUserView,
        updateActiveItem,
    } = props;

    const context = useContext(AuthContext) as Context;
    const [windowWidth, setWindowWidth] = useState(0);
    const [signUpActive, setSignUpActive] = useState(false);

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
            onClick: context.logOut,
            selected: false,
            active: false,
        },
    ];

    // Use for redirecting
    const history = useHistory();

    const navigateToHome = () => {
        const path = '/dashboard';
        history.push(path);
    };

    const logoNotLoggedIn = () => {
        const path = '/';
        history.push(path);
    };

    const handleClickSignUp = () => setSignUpActive(true);
    const resetSignupState = () => {
        setSignUpActive(false);
    };

    // Menu items when not logged in
    const defaultMenuItems = (
        <Menu.Item>
            <Button
                as={Link}
                color='teal'
                name='login'
                to='/login'
                content='Login'
                id='nav-menu__login-button'
            />
            <Button
                icon='plus'
                content='Sign Up'
                size='small'
                onClick={handleClickSignUp}
            />
            {signUpActive && (
                <SignUpModal
                    navToSignUp={signUpActive}
                    reloadModal={resetSignupState}
                />
            )}
        </Menu.Item>
    );
    // Menu items when logged in
    const loggedInMenuItems = collapseLoggedInNav ? (
        <>
            <Menu.Item className='home-menu-item'>
                <Button
                    basic
                    color='teal'
                    name='home'
                    icon='hospital outline'
                    onClick={navigateToHome}
                />
            </Menu.Item>
            <Menu.Item className='profile-menu-item'>
                <Dropdown
                    button
                    basic
                    color='teal'
                    floating
                    icon={null}
                    name='profile'
                    className='profile-button profile-mobile'
                    options={dropdownOptions}
                    trigger={
                        <span>
                            <Icon
                                name='user outline'
                                className='profile-mobile-icon'
                            />
                        </span>
                    }
                />
            </Menu.Item>
        </>
    ) : (
        <>
            <Menu.Item>
                <Button
                    basic
                    color='teal'
                    name='home'
                    content='Home'
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
                    className='profile-button'
                    options={dropdownOptions}
                    trigger={
                        <span>
                            <Icon name='user outline' />{' '}
                            {context.user?.firstName}
                        </span>
                    }
                />
            </Menu.Item>
        </>
    );

    const checkPatientView = () => {
        const { userSurveyState } = props,
            check1 =
                'graph' in userSurveyState &&
                '1' in userSurveyState.graph &&
                Object.keys(userSurveyState.graph['1']).every(
                    (key) =>
                        userSurveyState.nodes[key].response !=
                        YesNoResponse.None
                ),
            check2 =
                'nodes' in userSurveyState &&
                '6' in userSurveyState.nodes &&
                '7' in userSurveyState.nodes &&
                Object.keys(userSurveyState.nodes['6'].response).length +
                    Object.keys(userSurveyState.nodes['7'].response).length >
                    0;
        return check1 && check2;
    };

    return (
        <div>
            <Menu className={`${className} nav-menu`} attached={attached}>
                {context.token ? (
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
                {context.token && history.location.pathname.length > 1 ? (
                    collapseLoggedInNav ? (
                        <Button.Group>
                            <Button
                                compact
                                onClick={() => {
                                    changeUserView('Patient View');
                                    if (!checkPatientView())
                                        updateActiveItem('CC');
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
                                    if (!checkPatientView())
                                        updateActiveItem('CC');
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
                    {context.token ? loggedInMenuItems : defaultMenuItems}
                </Menu.Menu>
            </Menu>
        </div>
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

const mapStateToProps = (
    state: CurrentNoteState
): userViewProps & initialSurveyProps => {
    return {
        patientView: selectPatientViewState(state),
        doctorView: selectDoctorViewState(state),
        userSurveyState: selectInitialPatientSurvey(state),
    };
};

type Props = ConnectedNavMenuProps &
    userViewProps &
    DispatchProps &
    initialSurveyProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedNavMenu);
