import useUser from 'hooks/useUser';
import React from 'react';
import PrintTemplate from 'react-print';
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
                    <p>Please scan this QR code now to</p>
                    <h2>
                        complete your mandatory pre-appointment questionnaire
                        for
                    </h2>
                    <h1>
                        <span>{user?.institutionName ?? ''}</span>
                    </h1>

                    <div className={style.patientQR__image}>{children}</div>
                    <div className={style.patientQR__info}>
                        <p>
                            This required questionnaire takes only 3 minutes to
                            complete and helps streamline your appointment.
                        </p>
                    </div>
                </div>
            </PrintTemplate>
        </div>
    );
}

export default PatientQRCodePage;
