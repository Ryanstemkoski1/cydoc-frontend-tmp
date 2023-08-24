/* eslint-disable no-console */
import MenuButton, { MenuItem } from 'components/Header/MenuButton';
import { YesNoResponse } from 'constants/enums';
import SignUpModal from 'pages/Account/SignUpModal';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import { initialSurveyProps } from 'pages/EditNote/content/patientview/InitialSurvey';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
    UpdateActiveItemAction,
    updateActiveItem,
} from 'redux/actions/activeItemActions';
import { UserViewAction, changeUserView } from 'redux/actions/userViewActions';
import { CurrentNoteState } from 'redux/reducers';
import { additionalSurvey } from 'redux/reducers/additionalSurveyReducer';
import { selectActiveItem } from 'redux/selectors/activeItemSelectors';
import {
    selectDoctorViewState,
    selectInitialPatientSurvey,
    selectPatientViewState,
} from 'redux/selectors/userViewSelectors';
import { Button, Header, Image, Menu } from 'semantic-ui-react';
import Logo from '../../assets/cydoc-logo.svg';
import DashboardIcon from '../../assets/images/dashboard.png';
import Setting from '../../assets/images/edit.svg';
import Home from '../../assets/images/home.svg';
import Logout from '../../assets/images/logout.svg';
import QrCode from '../../assets/images/qr-code.svg';
import Security from '../../assets/images/security.svg';
import constants from '../../constants/constants.json';
import AuthContext from '../../contexts/AuthContext';
import './NavMenu.css';
import NoteNameMenuItem, { Context } from './NoteNameMenuItem';

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

    const loggedInMenuButtonItems: MenuItem[] = [
        {
            to: '/',
            label: 'Home',
            icon: Home,
            active: false,
        },
        {
            to: '/dashboard',
            label: 'Dashboard',
            icon: DashboardIcon,
            active: window.location.href.includes('dashboard'),
        },
        {
            to: '/editprofile',
            label: 'Edit Profile',
            icon: Setting,
            active: window.location.href.includes('editprofile'),
        },
        {
            to: '/qrcode',
            label: 'QR Code',
            icon: QrCode,
            active: window.location.href.includes('qrcode'),
        },
        {
            to: '/profilesecurity',
            label: 'Profile Security',
            icon: Security,
            active: window.location.href.includes('profilesecurity'),
        },
        {
            to: '/',
            label: 'Log Out',
            icon: Logout,
            onClick: context.logOut,
            active: false,
        },
    ];

    const [signUpActive, setSignUpActive] = useState(false);

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
    const loggedInMenuItems = (
        <MenuButton
            label={context.user?.firstName ?? ''}
            items={loggedInMenuButtonItems}
        />
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

    const handleClickLogo = () => {
        if (context.token) {
            navigateToHome();
        } else {
            logoNotLoggedIn();
        }
    };

    return (
        <Menu
            className={`${className} nav-menu nav-bar ${
                displayNoteName && doctorView ? 'nav-bar-input' : ''
            }`}
            attached={attached}
        >
            <Menu.Item className='logo-menu' onClick={handleClickLogo}>
                <Image src={Logo} className={'logo-circle'} />
                {!displayNoteName && (
                    <Header
                        as='h1'
                        className={`${'logo-text'}`}
                        content='Cydoc'
                    />
                )}
            </Menu.Item>
            {/* When parent is EditNote, then display the note name item */}
            {displayNoteName && doctorView && <NoteNameMenuItem />}
            {context.token && history.location.pathname.length > 1 ? (
                <Button.Group className='btn-group'>
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
            ) : (
                ''
            )}

            {/* Navigation links */}
            <Menu.Menu position='right'>
                {/* Menu will have different options depending on whether the user is logged in or not */}
                {context.token ? loggedInMenuItems : defaultMenuItems}
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
