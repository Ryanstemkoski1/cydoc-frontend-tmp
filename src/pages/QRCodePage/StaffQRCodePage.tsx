import React from 'react';
import style from '../../assets/scss/qrcode-print.module.scss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PrintTemplate from 'react-print';

interface Props {
    children: React.JSX.Element[] | React.JSX.Element;
}

function StaffQRCodePage({ children }: Props) {
    return (
        <div
            className={`${style.patientQRMain} flex align-center justify-center`}
        >
            <PrintTemplate>
                <div className={`${style.patientQR}`}>
                    <h2>Thank you for choosing</h2>

                    <img
                        className={style.patientQR__logo}
                        src={'/images/logo.svg'} 
                        alt='Cydoc'
                    />

                    <h2>
                        to streamline your clinic&rsquo;s <br /> appointments
                        with AI.{' '}
                    </h2>

                    <p>
                        To start a Cydoc Smart Patient Intake Form&copy;,
                        <br /> scan this QR code with a clinic-owned tablet
                        <br /> before handing the tablet to the patient.
                    </p>

                    <div className={style.patientQR__image}>{children}</div>
                </div>
            </PrintTemplate>
        </div>
    );
}

export default StaffQRCodePage;
