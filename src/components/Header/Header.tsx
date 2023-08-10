import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import style from './Header.module.scss';

const Header = () => {
    const isHomePage = useLocation()?.pathname === '/';
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
        </header>
    );
};
export default Header;
