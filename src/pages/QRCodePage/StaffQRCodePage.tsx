import React, { forwardRef } from 'react';
import QRCode from 'react-qr-code';
import style from '../../assets/scss/qrcode-print.module.scss';
import Logo from '../../assets/images/logo.svg';
interface Props {
    link: string;
}

function StaffQRCodePage({ link }: Props, ref: any) {
    return (
        <div
            className={`${style.patientQR} flex align-center justify-center`}
            ref={ref}
        >
            <h2>Thank you for choosing</h2>

            <img className={style.patientQR__logo} src={Logo} alt='Cydoc' />

            <h2>
                to streamline your clinic&rsquo;s <br /> appointments with AI.{' '}
            </h2>

            <p>
                To start a Cydoc Smart Patient Intake Form&copy;,
                <br /> scan this QR code with a clinic-owned tablet
                <br /> before handing the tablet to the patient.
            </p>

            <div className={style.patientQR__image}>
                <QRCode value={link} />
            </div>
        </div>
    );
}

export default forwardRef(StaffQRCodePage);
