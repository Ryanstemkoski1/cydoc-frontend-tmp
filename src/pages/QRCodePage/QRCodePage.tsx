import useUser from 'hooks/useUser';
import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import QRIcon1 from '../../assets/images/qr-code-icon1.svg';
import QRIcon2 from '../../assets/images/qr-code-icon2.svg';
import QRIcon3 from '../../assets/images/qr-code-icon3.svg';
import PatientQRCodePage from './PatientQRCodePage';
import style from './QRCodePage.module.scss';
import StaffQRCodePage from './StaffQRCodePage';
import useAuth from 'hooks/useAuth';
import { getHpiQrCode } from 'modules/institution-api';

type QRCodeType = 'patient' | 'staff' | '';

function printDocument() {
    setTimeout(() => {
        window.print();
    }, 100);
}

function QRCodePage() {
    const { cognitoUser } = useAuth();
    const [showQRCodePage, setShowQRCodePage] = useState<QRCodeType>('');
    const { user } = useUser();

    const handlePatientPrint = () => {
        if (!user) return;
        setShowQRCodePage('patient');
        printDocument();
    };

    const handleStaffPrint = () => {
        if (!user) return;
        setShowQRCodePage('staff');
        printDocument();
    };

    const [link, setLink] = useState<string>('');

    const fetchQRCodeLink = useCallback(async () => {
        const institutionId = user?.institutionId;

        if (!institutionId) {
            return;
        }

        try {
            const link = await getHpiQrCode(institutionId, cognitoUser);

            if (link) setLink(link);
        } catch (_error: any) {}
    }, [cognitoUser, user?.institutionId]);

    useEffect(() => {
        fetchQRCodeLink();
    }, [user]);

    const qrCode = <QRCode value={link} />;

    return (
        <>
            <div id='react-no-print'>
                <div className='centering'>
                    <div className={style.QRCodePage}>
                        <div className={style.QRCodePage__header}>
                            <h2>QR Code</h2>
                        </div>
                        <div className={style.QRCodePage__content}>
                            <p>
                                Cydoc&lsquo;s Smart Patient Intake Form© uses AI
                                to interview a patient before a visit and
                                generate a medical note. Cydoc enables
                                streamlined visits and less time spent on
                                documentation.
                            </p>

                            <p>
                                Cydoc relies on a QR code to work. This QR code
                                is unique to your clinic. Anyone with access to
                                this QR code can complete a Cydoc Smart Patient
                                Intake Form&copy;.
                            </p>

                            <p>
                                To get started, click the{' '}
                                <strong>“Print Now”</strong> button to enable
                                the workflows of your choice. For best use of
                                Cydoc, we recommend enabling at least 2
                                workflows.
                            </p>

                            <div
                                className={`${style.QRCodePage__wrap} flex-wrap`}
                            >
                                <div className={style.QRCodePage__item}>
                                    <div className={style.QRCodePage__card}>
                                        <picture>
                                            <img src={QRIcon1} alt='icon1' />
                                        </picture>

                                        <p>
                                            This patient-facing poster is
                                            displayed at the front desk or on
                                            the wall of the waiting room. Front
                                            desk staff ask the patient to scan
                                            the QR code directly off the poster
                                            using the patient&lsquo;s
                                            smartphone.
                                        </p>
                                        <button
                                            className='button sm'
                                            onClick={handlePatientPrint}
                                        >
                                            Print Now
                                        </button>
                                    </div>
                                </div>
                                <div className={style.QRCodePage__item}>
                                    <div className={style.QRCodePage__card}>
                                        <picture>
                                            <img src={QRIcon2} alt='icon2' />
                                        </picture>

                                        <p>
                                            This patient-facing page is included
                                            in a patient&lsquo;s paper intake
                                            packet. A patient scans the QR code
                                            directly off this page with his/her
                                            smartphone.
                                        </p>
                                        <button
                                            className='button sm'
                                            onClick={handlePatientPrint}
                                        >
                                            Print Now
                                        </button>
                                    </div>
                                </div>
                                <div className={style.QRCodePage__item}>
                                    <div className={style.QRCodePage__card}>
                                        <picture>
                                            <img src={QRIcon3} alt='icon3' />
                                        </picture>

                                        <p>
                                            This staff-facing poster is
                                            displayed to staff at the front
                                            desk. A staff member scans the QR
                                            code with a clinic-owned tablet
                                            before handing the tablet to the
                                            patient.
                                        </p>
                                        <button
                                            className='button sm'
                                            onClick={handleStaffPrint}
                                        >
                                            Print Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id='print-mount' className={style.QRCodePage__printWrapper}>
                {showQRCodePage === 'patient' && (
                    <PatientQRCodePage>{qrCode}</PatientQRCodePage>
                )}
                {showQRCodePage === 'staff' && (
                    <StaffQRCodePage>{qrCode}</StaffQRCodePage>
                )}
            </div>
        </>
    );
}

export default QRCodePage;
