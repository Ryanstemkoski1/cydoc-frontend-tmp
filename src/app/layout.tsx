// TODO: try deleting this and see if it's necessary, if not, remove it cause it's not int he docs
import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cydoc',
    description: 'Cydoc',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <head>
                <meta name='theme-color' content='#eaf3f5' />
            </head>
            <body>
                <div id='root'>{children}</div>
            </body>
        </html>
    );
}
