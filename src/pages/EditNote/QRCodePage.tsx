import Header from 'components/Header/Header';
import QRCodeComponent from 'components/QRCode';
import React from 'react';

function QRCodePage() {
    return (
        <div>
            <Header />
            <QRCodeComponent showDownloadButton={true} />
        </div>
    );
}

export default QRCodePage;
