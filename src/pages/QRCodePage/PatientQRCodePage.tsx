import useUser from 'hooks/useUser';
import React from 'react';
import PrintTemplate from 'react-print';
import Logo from '../../assets/images/logo.svg';
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
            <PrintTemplate>
                <div className={`${style.patientQR}`}>
                    <h2>
                        <span>{user?.institutionName ?? ''}</span>
                        has partnered with
                    </h2>

                    <img
                        className={style.patientQR__logo}
                        src={Logo}
                        alt='Cydoc'
                    />

                    <h2>to streamline your visit.</h2>
                    <p>
                        To complete your check-in using Cydoc&lsquo;s Medical AI
                        Assistant, <br /> please scan this QR code now:
                    </p>
                    <div className={style.patientQR__image}>{children}</div>
                </div>
            </PrintTemplate>
        </div>
    );
}

export default PatientQRCodePage;
