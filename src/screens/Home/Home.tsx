'use client';

import React from 'react';
import style from './Home.module.scss';
import { useRouter } from 'next/navigation';
import useUser from '@hooks/useUser';

const Home = () => {
    const { user } = useUser();
    const router = useRouter();

    return user ? (
        router.push('/hpi/doctor')
    ) : (
        <>
            <div className='centering'>
                <div className={`${style.home} flex`}>
                    <div className={style.home__top}>
                        <div className={style.home__title}>
                            <span>Streamline</span>
                            your visit by answering a few questions from
                            Cydoc&apos;s medical AI
                        </div>
                    </div>
                    <div className={style.home__bottom}>
                        <img
                            className={style.isMobile}
                            src={'/images/banner-mobile.png'}
                            alt='Banner'
                        />
                        <img
                            className={style.isDesktop}
                            src={'/images/banner.png'}
                            alt='Banner'
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Home;
