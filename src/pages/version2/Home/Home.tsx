import Header from 'components/Header/Header';
import React from 'react';
import { useHistory } from 'react-router';
import BannerMobile from '../../../assets/images/banner-mobile.png';
import Banner from '../../../assets/images/banner.png';
import style from './Home.module.scss';

const Home = () => {
    function navigateToHpiView() {
        const path = '/hpi/patient';
        history.push(path);
    }

    const history = useHistory();
    return (
        <>
            <Header />
            <div className='centering'>
                <div className={`${style.home} flex`}>
                    <div className={style.home__top}>
                        <div className={style.home__title}>
                            <span>Streamline</span>
                            your visit by answering a few questions from
                            Cydoc&apos;s medical AI
                        </div>

                        <div
                            className={style.home__button}
                            onClick={navigateToHpiView}
                        >
                            Click here to begin your visit
                        </div>
                    </div>
                    <div className={style.home__bottom}>
                        <img
                            className={style.isMobile}
                            src={BannerMobile}
                            alt='Banner'
                        />
                        <img
                            className={style.isDesktop}
                            src={Banner}
                            alt='Banner'
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Home;
