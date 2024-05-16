'use client';

import useUser from 'hooks/useUser';
import React from 'react';
// import PrintTemplate from 'react-print';
import style from '../../assets/scss/qrcode-print.module.scss';

interface Props {
    children: React.JSX.Element[] | React.JSX.Element;
}

function PatientQRCodePage({ children }: Props) {
    const { user } = useUser();

    return (
        <div
            className={`${style.patientQRMain} flex align-center justify-center`}
        >
            {/* FIXME: react-print not compatible with NextJS */}
            {/* <PrintTemplate> */}
            <div className={`${style.patientQR} ${style.isAlterNative}`}>
                <p>PRE-APPOINTMENT HEALTH QUESTIONNAIRE</p>
                <h2>
                    Please scan this QR code now to
                    <br /> complete your mandatory pre-appointment
                    <br /> health questionnaire for
                </h2>
                <h1>
                    <span>{user?.institutionName ?? ''}</span>
                </h1>

                <div className={style.patientQR__image}>{children}</div>
                <div className={style.patientQR__info}>
                    This required health questionnaire takes only 3 minutes to
                    complete and helps streamline your appointment.
                </div>

                <div className={style.patientQR__powerd}>
                    <strong>Powered by </strong>
                    <img
                        className={style.patientQR__logo}
                        src={'/images/logo.svg'}
                        alt='Cydoc'
                    />
                </div>
            </div>
            {/* </PrintTemplate> */}
        </div>
    );
}

export default PatientQRCodePage;
