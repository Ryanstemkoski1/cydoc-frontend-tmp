import React, { useEffect, useMemo } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';
import Logo from '../../assets/cydoc-logo.svg';
import NoteNameMenuItem from './NoteNameMenuItem';
/* eslint-disable no-console */
import { ProductType, ViewType } from 'assets/enums/route.enums';
import MenuButton, { MenuItem } from 'components/Header/MenuButton';
import { YesNoResponse } from 'constants/enums';
import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import { initialSurveyProps } from 'pages/EditNote/content/patientview/InitialSurvey';
import { connect } from 'react-redux';
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
import Setting from '../../assets/images/edit.svg';
import Logout from '../../assets/images/logout.svg';
import Notes from '../../assets/images/notes.svg';
import QrCode from '../../assets/images/qr-code.svg';
import Security from '../../assets/images/security.svg';
import Users from '../../assets/images/users.svg';
import constants from '../../constants/constants.json';
import style from './NavMenu.module.scss';

interface ConnectedNavMenuProps {
    className?: string;
    // For whether to stack another menu above/below
    attached?: 'top' | 'bottom';
    // Whether to display or hide the note name
    displayNoteName?: boolean;
}

const OurCreatedRoutes = [
    'hpi',
    'qrcode',
    '/view/product',
    'submission-successful',
];

// Navigation Bar component that will go at the top of most pages
const ConnectedNavMenu: React.FunctionComponent<Props> = (props: Props) => {
    const {
        displayNoteName = false,
        patientView,
        doctorView,
        changeUserView,
        updateActiveItem,
    } = props;

    const location = useLocation();
    const history = useHistory();
    const isHomePage = location?.pathname === '/';
    const { signOut, loginCorrect, isSignedIn, authLoading } = useAuth();
    const { user, isManager } = useUser();
    const isCurrentOurRoute = useMemo(
        () =>
            OurCreatedRoutes.some((item) =>
                location.pathname.toLowerCase().includes(item)
            ),
        [location.pathname]
    );
    // email/password correct but waiting on MFA? allow users to logOut
    const userCurrentlyLoggingIn = loginCorrect && !isSignedIn;

    // Logged In Menu Items
    const loggedInMenuButtonItems: MenuItem[] = [
        {
            to: `/${ProductType.HPI}/${ViewType.DOCTOR}`,
            label: 'Notes',
            icon: Notes,
            active: window.location.href.includes(
                `${ProductType.HPI}/${ViewType.DOCTOR}`
            ),
        },
        {
            to: '/qrcode',
            label: 'Clinic QR Code',
            icon: QrCode,
            active: window.location.href.includes('qrcode'),
        },
        {
            to: '/editprofile',
            label: 'Edit Profile',
            icon: Setting,
            active: window.location.href.includes('editprofile'),
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
            onClick: signOut,
            active: false,
        },
    ];

    if (isManager) {
        loggedInMenuButtonItems.splice(1, 0, {
            to: '/manager-dashboard',
            label: 'Manage Users',
            icon: Users,
            active: window.location.href.includes('manager-dashboard'),
        });
    }

    // Default Menu Items
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
            basic
            color='teal'
            name='logOut'
            onClick={signOut}
            content='Log Out'
            id='nav-menu__login-button'
        />
    );

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

    // Display warning when user tries to close the tab
    useEffect(() => {
        if (!isCurrentOurRoute) {
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
        }
    }, [isCurrentOurRoute]);

    return (
        <header
            className={`${style.header} ${
                displayNoteName && doctorView ? style.headerNote : ''
            } flex align-center justify-between`}
        >
            <Link
                className={`${style.header__logo} ${
                    isHomePage ? '' : style.isLinking
                } flex align-center`}
                to='/'
            >
                <img src={Logo} alt='Cydoc' />
                {(!(isSignedIn && history.location.pathname.length) ||
                    isCurrentOurRoute ||
                    isHomePage) && <span>Cydoc</span>}
            </Link>

            {displayNoteName &&
                doctorView &&
                !isHomePage &&
                !isCurrentOurRoute && (
                    <div className={style.header__note}>
                        <NoteNameMenuItem />
                    </div>
                )}

            {isSignedIn &&
                history.location.pathname.length > 1 &&
                !isCurrentOurRoute && (
                    <div className={`${style.header__view} flex align-center`}>
                        <button
                            onClick={() => {
                                changeUserView('Patient View');
                                if (!checkPatientView()) updateActiveItem('CC');
                            }}
                            className={`button sm pill gray ${
                                patientView ? 'active' : ''
                            }`}
                        >
                            Patient <span>View</span>
                        </button>
                        <strong className='flex align-center justify-center'>
                            or
                        </strong>
                        <button
                            onClick={() => changeUserView('Doctor View')}
                            className={`button sm pill gray ${
                                !patientView ? 'active' : ''
                            }`}
                        >
                            Doctor <span>View</span>
                        </button>
                    </div>
                )}

            {!authLoading &&
                (isSignedIn ? (
                    <MenuButton
                        label={user?.firstName ?? ''}
                        items={loggedInMenuButtonItems}
                    />
                ) : (
                    defaultMenuItems
                ))}
        </header>
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
