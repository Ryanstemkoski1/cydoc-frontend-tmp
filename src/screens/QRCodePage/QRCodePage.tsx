'use client';

import useUser from 'hooks/useUser';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import PatientQRCodePage from './PatientQRCodePage';
import style from './QRCodePage.module.scss';
import StaffQRCodePage from './StaffQRCodePage';

type QRCodeType = 'patient' | 'staff' | '';

function printDocument() {
    setTimeout(() => {
        window.print();
    }, 100);
}

function QRCodePage() {
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

    const handleCopyLinkButtonClick = () => {
        if (!user) return;
        navigator.clipboard.writeText(link);
        toast.success('Copied to Clipboard!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: false,
            closeOnClick: true,
            theme: 'light',
        });
    };

    const [link, setLink] = useState<string>('');

    useEffect(() => {
        setLink(
            `${window.location.origin}/hpi/patient?institution_id=${user?.institutionId}`
        );
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
                                Cydoc&lsquo;s Smart Patient Intake Form© uses
                                AI to interview a patient before a visit and
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
                                            <img
                                                src={
                                                    '/images/qr-code-icon1.svg'
                                                }
                                                alt='icon1'
                                            />
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
                                            <img
                                                src={
                                                    '/images/qr-code-icon2.svg'
                                                }
                                                alt='icon2'
                                            />
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
                                            <img
                                                src={
                                                    '/images/qr-code-icon3.svg'
                                                }
                                                alt='icon3'
                                            />
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
                                <div className={style.QRCodePage__item}>
                                    <div className={style.QRCodePage__card}>
                                        <picture>
                                            <img
                                                src={
                                                    '/images/qr-code-icon4.svg'
                                                }
                                                alt='icon4'
                                            />
                                        </picture>

                                        <a
                                            target='_blank'
                                            rel='noreferrer'
                                            className={style.QRCodePage__link}
                                            href={link}
                                        >
                                            {link}
                                        </a>

                                        <p>
                                            This link is unique to your clinic.
                                            Anyone who clicks on this link can
                                            submit a Cydoc form. Share this link
                                            with your patients on your clinic
                                            website, within existing patient
                                            reminder text messages, or via an
                                            email.
                                        </p>
                                        <button
                                            className='button sm'
                                            onClick={handleCopyLinkButtonClick}
                                        >
                                            Copy Link
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
