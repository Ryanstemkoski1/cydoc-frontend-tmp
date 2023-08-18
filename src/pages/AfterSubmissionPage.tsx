import Header from 'components/Header/Header';
import React from 'react';
import { useHistory } from 'react-router';
import CheckWhite from '../assets/images/check-white.svg';
import style from './AfterSubmissionPage.module.scss';

function AfterSubmissionPage() {
    const history = useHistory();
    return (
        <>
            <Header />
            <div className='centering'>
                <div
                    className={`${style.successBlock} flex-wrap align-center justify-center`}
                >
                    <div className={style.successBlock__box}>
                        <picture className='flex align-center justify-center'>
                            <img src={CheckWhite} alt='Check' />
                        </picture>
                        <h5>Success!</h5>
                        <p>
                            Your questionnaire has successfully {'\n'} been
                            submitted
                        </p>
                        <button
                            className='button'
                            onClick={() => {
                                history.replace('/');
                            }}
                        >
                            Go to home page
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AfterSubmissionPage;
