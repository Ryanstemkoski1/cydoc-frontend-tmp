'use client';

import React from 'react';
import style from './AfterSubmissionPage.module.scss';
import { useRouter } from 'next/navigation';

export default function AfterSubmissionAdvancePage() {
    const router = useRouter();

    let resetButtonURL = `/hpi/doctor`;

    return (
        <div className='centering'>
            <div
                className={`${style.successBlock} flex-wrap align-center justify-center`}
            >
                <div className={style.successBlock__box}>
                    <picture className='flex align-center justify-center'>
                        <img src={'/images/check-white.svg'} alt='Check' />
                    </picture>
                    <h5>Success!</h5>
                    <p>
                        {`Your questionnaire has successfully`}
                        <br />
                        {`been submitted`}
                    </p>

                    <button
                        className='button'
                        onClick={() => router.replace(resetButtonURL)}
                    >
                        Go back to the Generated Notes
                    </button>
                </div>
            </div>
        </div>
    );
}
