import QRCodeComponent from 'components/QRCode';
import NavMenu from 'components/navigation/NavMenu';
import React from 'react';

function QRCodePage() {
    return (
        <div>
            <NavMenu
                className='edit-note-nav-menu'
                displayNoteName={true}
                attached={'top'}
            />
            <QRCodeComponent showDownloadButton={true} />
        </div>
    );
}

export default QRCodePage;
