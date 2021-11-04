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

import './NavMenu.css';
import DoctorSignUp from 'pages/Account/DoctorSignUp';

interface ConnectedNavMenuProps {
    className: string;
    // For whether to stack another menu above/below
    attached: 'top' | 'bottom';
    // Whether to display or hiee the note name
    displayNoteName: boolean;
}

// Navigation Bar component that will go at the top of most pages
const ConnectedNavMenu: React.FunctionComponent<ConnectedNavMenuProps> = (
    props: ConnectedNavMenuProps
) => {
    const { className, attached, displayNoteName } = props;

    const context = useContext(AuthContext) as Context;
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
    // Check if currently editing note, then handle redirect
    const checkEditNote = () => {
        const path = '/dashboard';
        if (window.location.href.includes('editnote')) {
            const confirmBox = window.confirm(
                'Are you sure you want to redirect? Your generated note will not be saved.'
            );
            if (confirmBox === true) {
                history.push(path);
            }
        } else {
            history.push(path);
        }
    };

    window.addEventListener('beforeunload', function (e) {
        // alert('If you leave the page, your note will not be saved.');
        e.preventDefault();
        e.returnValue = '';
    });

    // Menu items when not logged in
    const defaultMenuItems = (
        <Menu.Item>
            <Button
                as={Link}
                color='teal'
                name='login'
                to='/login'
                content='Login'
            />
            <DoctorSignUp />
        </Menu.Item>
    );
    // Menu items when logged in
    const loggedInMenuItems = collapseLoggedInNav ? (
        <>
            <Menu.Item>
                <Button
                    basic
                    color='teal'
                    name='home'
                    icon='hospital outline'
                    onClick={checkEditNote}
                />
            </Menu.Item>
            <Menu.Item>
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
                    onClick={() => {
                        if (window.location.href.includes('editnote')) {
                            alert(
                                'If you redirect, your note will not be saved.'
                            );
                        }
                    }}
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
                    onClick={checkEditNote}
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
                    onClick={() => {
                        if (window.location.href.includes('editnote')) {
                            alert(
                                'If you redirect, your note will not be saved.'
                            );
                        }
                    }}
                />
            </Menu.Item>
        </>
    );

    return (
        <div>
            <Menu className={`${className} nav-menu`} attached={attached}>
                {context.token ? (
                    <Menu.Item className='logo-menu' onClick={checkEditNote}>
                        <Image src={Logo} className='logo-circle' />
                        {!displayNoteName && !hideCydoc && (
                            <Header
                                as='h1'
                                className='logo-text'
                                content='Cydoc'
                            />
                        )}
                    </Menu.Item>
                ) : (
                    <Menu.Item className='logo-menu' onClick={checkEditNote}>
                        <Image src={Logo} className='logo-circle' />
                        {!displayNoteName && !hideCydoc && (
                            <Header
                                as='h1'
                                className='logo-text'
                                content='Cydoc'
                            />
                        )}
                    </Menu.Item>
                )}

                {/* When parent is EditNote, then display the note name item */}
                {displayNoteName && <NoteNameMenuItem />}

                {/* Navigation links */}
                <Menu.Menu position='right'>
                    {/* Menu will have different options depending on whether the user is logged in or not */}
                    {context.token ? loggedInMenuItems : defaultMenuItems}
                </Menu.Menu>
            </Menu>
        </div>
    );
};

export default ConnectedNavMenu;
