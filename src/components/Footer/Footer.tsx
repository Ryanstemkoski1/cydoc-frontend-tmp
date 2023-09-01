import React from 'react';
import style from './Footer.module.scss';

const Footer = () => {
    return (
        <div className={style.footer}>
            <ul className='flex-wrap justify-center'>
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
