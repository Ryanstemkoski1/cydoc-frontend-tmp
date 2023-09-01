import { stagingClient } from 'constants/api';
import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toImg from 'react-svg-to-image';
import { Loader } from 'semantic-ui-react';
import style from './QRCode.module.scss';

interface QRCodeProps {
    showDownloadButton?: boolean;
}

function QRCodeComponent({ showDownloadButton = true }: QRCodeProps) {
    const [link, setLink] = useState<string>('');

    const fetchQRCodeLink = useCallback(async () => {
        const clinicianId = localStorage.getItem(
            HPIPatientQueryParams.CLINICIAN_ID
        );
        const institutionId = localStorage.getItem(
            HPIPatientQueryParams.INSTITUTION_ID
        );

        const response = await stagingClient.get(
            `/hpi-qr?${HPIPatientQueryParams.INSTITUTION_ID}=${institutionId}&${HPIPatientQueryParams.CLINICIAN_ID}=${clinicianId}`
        );

        const link = response.data.link as string | null;

        if (link) setLink(link);
    }, []);

    useEffect(() => {
        fetchQRCodeLink();
    }, []);

    const handleClick = (event: any) => {
        toImg('#qrcode', 'qrcode-value');
    };

    return (
        <div className={`flex align-center justify-center ${style.qrCode}`}>
            {!link && <Loader active />}

            {link && (
                <div className='qrcode-container'>
                    <QRCode value={link} id='qrcode' />
                </div>
            )}

            {showDownloadButton && link && (
                <button className='button' onClick={handleClick}>
                    Download Image
                </button>
            )}
        </div>
    );
}

export default QRCodeComponent;
