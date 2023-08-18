import { localhostClient } from 'constants/api';
import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toImg from 'react-svg-to-image';
import { CurrentNoteState } from 'redux/reducers';
import { Loader } from 'semantic-ui-react';
import style from './QRCode.module.scss';

interface QRCodeProps {
    showDownloadButton?: boolean;
}

function QRCodeComponent({ showDownloadButton = true }: QRCodeProps) {
    const [link, setLink] = useState<string>('');

    const { institution_id, clinician_id } = useSelector(
        (state: CurrentNoteState) => ({
            institution_id: state.clinicianDetail.institution_id,
            clinician_id: state.clinicianDetail.id,
        })
    );

    const fetchQRCodeLink = useCallback(async () => {
        const response = await localhostClient.get(
            `/hpi-qr?institution_id=${17}&clinician_id=${4}`
        );

        const link = response.data.link as string | null;

        if (link) setLink(link);
    }, []);

    useEffect(() => {
        fetchQRCodeLink();
    }, [institution_id, clinician_id]);

    const handleClick = (event: any) => {
        toImg('#qrcode', 'qrcode-value');
        // .then((data: any) => {
        //     // eslint-disable-next-line no-console
        //     console.log(data);
        // });
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
