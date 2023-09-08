import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import useQuery from 'hooks/useQuery';
import React from 'react';
import CheckWhite from '../assets/images/check-white.svg';
import style from './AfterSubmissionPage.module.scss';

function AfterSubmissionPage() {
    const query = useQuery();

    const clinician_id = query.get(HPIPatientQueryParams.CLINICIAN_ID);
    const institution_id = query.get(HPIPatientQueryParams.INSTITUTION_ID);

    if (!institution_id) {
        window.location.replace('/');
    }

    let resetButtonURL = `/hpi/patient?${HPIPatientQueryParams.INSTITUTION_ID}=${institution_id}`;

    if (clinician_id) {
        resetButtonURL += `&${HPIPatientQueryParams.CLINICIAN_ID}=${clinician_id}`;
    }

    return (
        <>
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
