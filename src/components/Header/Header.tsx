import { Context } from 'components/navigation/NoteNameMenuItem';
import AuthContext from 'contexts/AuthContext';
import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import Setting from '../../assets/images/edit.svg';
import Home from '../../assets/images/home.svg';
import Logout from '../../assets/images/logout.svg';
import QrCode from '../../assets/images/qr-code.svg';
import Security from '../../assets/images/security.svg';
import style from './Header.module.scss';
import MenuButton, { MenuItem } from './MenuButton';

const Header = () => {
    const isHomePage = useLocation()?.pathname === '/';
    const context = useContext(AuthContext) as Context;

    let menuItems: MenuItem[] = [
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

    if (!isHomePage) {
        menuItems = [
            {
                to: '/',
                label: 'Home',
                icon: Home,
                active: false,
            },
            ...menuItems,
        ];
    }

    return (
        <header className={`${style.header} flex align-center justify-between`}>
            <Link
                className={`${style.header__logo} ${
                    isHomePage ? '' : style.isLinking
                } flex align-center`}
                to='/'
            >
                <img src={Logo} alt='Cydoc' />
                <span>Cydoc</span>
            </Link>

            {context.token && (
                <MenuButton
                    label={context.user?.firstName ?? ''}
                    items={menuItems}
                />
            )}
        </header>
    );
};
export default Header;
