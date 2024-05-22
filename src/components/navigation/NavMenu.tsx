'use client';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button, Menu } from 'semantic-ui-react';
import NoteNameMenuItem from './NoteNameMenuItem';
/* eslint-disable no-console */
import { ProductType, ViewType } from '@constants/enums/route.enums';
import MenuButton, { MenuItem } from '@components/Header/MenuButton';
import { YesNoResponse } from '@constants/enums';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import 'screens/EditNote/content/hpi/knowledgegraph/css/Button.css';
import { InitialSurveyProps } from '@screens/EditNote/content/patientview/InitialSurvey';
import { connect } from 'react-redux';
import {
    UpdateActiveItemAction,
    updateActiveItem,
} from '@redux/actions/activeItemActions';
import { UserViewAction, changeUserView } from '@redux/actions/userViewActions';
import { CurrentNoteState } from '@redux/reducers';
import { AdditionalSurvey } from '@redux/reducers/additionalSurveyReducer';
import { selectActiveItem } from '@redux/selectors/activeItemSelectors';
import {
    selectDoctorViewState,
    selectInitialPatientSurvey,
    selectPatientViewState,
} from '@redux/selectors/userViewSelectors';
import constants from '@constants/constants.json';
import style from './NavMenu.module.scss';
import { usePathname, useRouter } from 'next/navigation';

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
    '/subscription',
    'form-preferences',
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

    const pathname = usePathname();
    const router = useRouter();
    const isHomePage = pathname === '/';
    const isEditNotePage = pathname?.includes('editnote');
    const isHPIPatientView =
        pathname === `/${ProductType.HPI}/${ViewType.PATIENT}` ||
        pathname === '/submission-successful';

    const { signOut, loginCorrect, isSignedIn, authLoading } = useAuth();
    const { user, isManager } = useUser();
    const isCurrentOurRoute = useMemo(
        () =>
            OurCreatedRoutes.some((item) =>
                pathname?.toLowerCase().includes(item)
            ),
        [pathname]
    );
    // email/password correct but waiting on MFA? allow users to logOut
    const userCurrentlyLoggingIn = loginCorrect && !isSignedIn;

    // Logged In Menu Items
    const loggedInMenuButtonItems: MenuItem[] = [
        {
            href: `/${ProductType.HPI}/${ViewType.DOCTOR}`,
            label: 'Notes',
            icon: '/images/notes.svg',
            active: !!pathname?.includes(
                `${ProductType.HPI}/${ViewType.DOCTOR}`
            ),
        },
        {
            href: '/qrcode',
            label: 'Clinic QR Code',
            icon: '/images/qr-code.svg',
            active: !!pathname?.includes('qrcode'),
        },
        {
            href: '/editprofile',
            label: 'Edit Profile',
            icon: '/images/edit.svg',
            active: !!pathname?.includes('editprofile'),
        },
        {
            href: '/profilesecurity',
            label: 'Profile Security',
            icon: '/images/security.svg',
            active: !!pathname?.includes('profilesecurity'),
        },
        {
            href: '/',
            label: 'Log Out',
            icon: '/images/logout.svg',
            onClick: signOut,
            active: false,
        },
    ];

    if (isManager) {
        loggedInMenuButtonItems.splice(
            1,
            0,
            {
                href: '/manager-dashboard',
                label: 'Manage Users',
                icon: '/images/users.svg',
                active: !!pathname?.includes('manager-dashboard'),
            },
            {
                href: '/form-preferences',
                label: 'Form Preferences',
                icon: '/images/assignment.svg',
                active: !!pathname?.includes('form-preferences'),
            },
            {
                href: '/subscription',
                label: 'Subscription',
                icon: '/images/security.svg',
                active: !!pathname?.includes('subscription'),
            }
        );
    }

    // Default Menu Items
    const loginButton = (
        <Button
            as={Link}
            color='teal'
            name='login'
            href='/login'
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
            {userCurrentlyLoggingIn
                ? logOutButton
                : !isHPIPatientView && loginButton}

            {!isHPIPatientView && (
                <Button
                    icon='plus'
                    content='Sign Up'
                    size='small'
                    onClick={() => {
                        if (userCurrentlyLoggingIn) {
                            // if the user tries to signUp while waiting for MFA, sign them out
                            signOut();
                        }
                        router.push('/sign-up');
                    }}
                />
            )}
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
                href='/'
            >
                <img
                    height={50}
                    width={50}
                    src={'/images/cydoc-logo.svg'}
                    alt='Cydoc'
                />
                {!isEditNotePage && <span>Cydoc</span>}
            </Link>

            {displayNoteName && doctorView && isEditNotePage && (
                <div className={style.header__note}>
                    <NoteNameMenuItem />
                </div>
            )}

            {isSignedIn && isEditNotePage && (
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
                        label={user?.firstName ?? 'menu'}
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
    additionalSurvey: AdditionalSurvey;
}

export interface ActiveItemProps {
    activeItem: string;
}

const mapStateToProps = (
    state: CurrentNoteState
): userViewProps &
    InitialSurveyProps &
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
    InitialSurveyProps &
    AdditionalSurveyProps &
    ActiveItemProps;

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ConnectedNavMenu);
