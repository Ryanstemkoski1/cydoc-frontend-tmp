import useClinicianFullName from 'hooks/useClinicianFullName';
import React, { forwardRef } from 'react';
import QRCode from 'react-qr-code';
import Logo from '../../assets/images/logo.svg';
import style from '../../assets/scss/qrcode-print.module.scss';

interface Props {
    link: string;
}

function PatientQRCodePage({ link }: Props, ref: any) {
    const clinicianFullName = useClinicianFullName();

    return (
        <div
            className={`${style.patientQR} flex align-center justify-center`}
            ref={ref}
        >
            <h2>
                {clinicianFullName} <br />
                has partnered with
            </h2>

            <img className={style.patientQR__logo} src={Logo} alt='Cydoc' />

            <h2>to streamline your visit.</h2>
            <p>
                To complete your check-in using Cydoc&lsquo;s Medical AI
                Assistant, <br /> please scan this QR code now:
            </p>
            <div className={style.patientQR__image}>
                <QRCode value={link} />
            </div>
        </div>
    );
}

export default forwardRef(PatientQRCodePage);
