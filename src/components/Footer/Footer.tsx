'use client';

import React from 'react';
import style from './Footer.module.scss';
import pkgInfo from '../../../package.json';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Footer = () => {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return isHomePage ? null : (
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
                    <Link href='/privacypolicy'>Privacy Policy</Link>
                </li>
                <li>
                    <Link href='/termsandconditions'>Terms and Conditions</Link>
                </li>
            </ul>
        </div>
    );
};
export default Footer;
