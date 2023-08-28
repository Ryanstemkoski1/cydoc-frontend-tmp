import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import Header from 'components/Header/Header';
import { stagingClient } from 'constants/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { setLoadingStatus } from 'redux/actions/loadingStatusActions';
import PatientQRCodePage from './PatientQRCodePage';
import StaffQRCodePage from './StaffQRCodePage';
import style from './QRCodePage.module.scss';
import QRIcon1 from '../../assets/images/qr-code-icon1.svg';
import QRIcon2 from '../../assets/images/qr-code-icon2.svg';
import QRIcon3 from '../../assets/images/qr-code-icon3.svg';

function QRCodePage() {
    const PatientQRCodePageRef = useRef<HTMLDivElement | null>();
    const StaffQRCodePageRef = useRef<HTMLDivElement | null>();
    const dispatch = useDispatch();

    const handlePatientPrint = useReactToPrint({
        content: () => PatientQRCodePageRef.current as HTMLDivElement,
    });

    const handleStaffPrint = useReactToPrint({
        content: () => StaffQRCodePageRef.current as HTMLDivElement,
    });

    const [link, setLink] = useState<string>('');

    const fetchQRCodeLink = useCallback(async () => {
        dispatch(setLoadingStatus(true));

        const clinicianId = localStorage.getItem(
            HPIPatientQueryParams.CLINICIAN_ID
        );
        const institutionId = localStorage.getItem(
            HPIPatientQueryParams.INSTITUTION_ID
        );

        try {
            const response = await stagingClient.get(
                `/hpi-qr?${HPIPatientQueryParams.INSTITUTION_ID}=${institutionId}&${HPIPatientQueryParams.CLINICIAN_ID}=${clinicianId}`
            );

            const link = response.data.link as string | null;

            if (link) setLink(link);
        } finally {
            dispatch(setLoadingStatus(false));
        }
    }, []);

    useEffect(() => {
        fetchQRCodeLink();
    }, []);

    return (
        <>
            <Header />
            <div className='centering'>
                <div className={style.QRCodePage}>
                    <div className={style.QRCodePage__header}>
                        <h2>QR Code</h2>
                    </div>
                    <div className={style.QRCodePage__content}>
                        <p>
                            Cydoc&lsquo;s Smart Patient Intake Form© uses AI to
                            interview a patient before a visit and generate a
                            medical note. Cydoc enables streamlined visits and
                            less time spent on documentation.
                        </p>

                        <p>
                            Cydoc relies on a QR code to work. This QR code is
                            unique to your clinic. Anyone with access to this QR
                            code can complete a Cydoc Smart Patient Intake
                            Form&copy;.
                        </p>

                        <p>
                            To get started, click the{' '}
                            <strong>“Print Now”</strong> button to enable the
                            workflows of your choice. For best use of Cydoc, we
                            recommend enabling at least 2 workflows.
                        </p>

                        <div className={`${style.QRCodePage__wrap} flex-wrap`}>
                            <div className={style.QRCodePage__item}>
                                <div className={style.QRCodePage__card}>
                                    <picture>
                                        <img src={QRIcon1} alt='icon1' />
                                    </picture>

                                    <p>
                                        This patient-facing poster is displayed
                                        at the front desk or on the wall of the
                                        waiting room. Front desk staff ask the
                                        patient to scan the QR code directly off
                                        the poster using the patient&lsquo;s
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
                                        This patient-facing page is included in
                                        a patient&lsquo;s paper intake packet. A
                                        patient scans the QR code directly off
                                        this page with his/her smartphone.
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
                                        This staff-facing poster is displayed to
                                        staff at the front desk. A staff member
                                        scans the QR code with a clinic-owned
                                        tablet before handing the tablet to the
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
                        <div style={{ display: 'none' }}>
                            <PatientQRCodePage
                                ref={PatientQRCodePageRef}
                                link={link}
                            />
                            <StaffQRCodePage
                                ref={StaffQRCodePageRef}
                                link={link}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default QRCodePage;
