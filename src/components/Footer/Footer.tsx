import React from 'react';
import style from './Footer.module.scss';
import pkgInfo from '../../../package.json';

const Footer = () => {
    return (
        <div className={style.footer}>
            <ul className='flex-wrap justify-center'>
                <p
                    style={{
                        margin: 'auto',
                        marginRight: '1rem',
                        marginLeft: 0,
                    }}
                >
                    v{pkgInfo.version}
                </p>
                <li>
                    Copyright © 2023 Cydoc Corporation. All rights reserved.
                    Patent pending.
                </li>
                <li>
                    <a href='/privacypolicy'>Privacy Policy</a>
                </li>
                <li>
                    <a href='/termsandconditions'>Terms and Conditions</a>
                </li>
            </ul>
        </div>
    );
};
export default Footer;
