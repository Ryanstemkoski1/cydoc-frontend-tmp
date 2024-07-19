'use client';

import React from 'react';
import { AuthProvider } from 'providers/AuthProvider';
import ToastProvider from 'providers/ToastProvider';
import '../semantic/dist/semantic.min.css';
import '../index.scss';

import { NotesStore } from '@contexts/NotesContext';
import { SubscriptionProvider } from 'providers/SubscriptionProvider';
import StoreProvider from '@providers/StoreProvider';
import ContentProvider from '@providers/ContentProvider';

interface Props {
    children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang='en'>
            <head>
                <meta name='theme-color' content='#eaf3f5' />
            </head>
            <body>
                <main id='root'>
                    <AuthProvider>
                        <SubscriptionProvider>
                            <NotesStore>
                                <StoreProvider>
                                    <ToastProvider>
                                        <ContentProvider>
                                            {children}
                                        </ContentProvider>
                                    </ToastProvider>
                                </StoreProvider>
                            </NotesStore>
                        </SubscriptionProvider>
                    </AuthProvider>
                </main>
            </body>
        </html>
    );
}
