import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import Header from 'components/Header/Header';
import useQuery from 'hooks/useQuery';
import React from 'react';
import CheckWhite from '../assets/images/check-white.svg';
import style from './AfterSubmissionPage.module.scss';

function AfterSubmissionPage() {
    const query = useQuery();

    const clinicianId = query.get(HPIPatientQueryParams.CLINICIAN_ID);
    const institutionId = query.get(HPIPatientQueryParams.INSTITUTION_ID);

    let resetButtonURL = '/hpi/patient';

    if (clinicianId !== null && institutionId !== null) {
        resetButtonURL = `${resetButtonURL}?${HPIPatientQueryParams.INSTITUTION_ID}=${institutionId}&${HPIPatientQueryParams.CLINICIAN_ID}=${clinicianId}`;
    }

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
                                window.location.replace(resetButtonURL);
                            }}
                        >
                            Reset the form
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AfterSubmissionPage;
