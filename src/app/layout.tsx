import React from 'react';
import type { Metadata } from 'next';

import { AuthProvider } from 'providers/AuthProvider';
import ToastProvider from 'providers/ToastProvider';
import '../semantic/dist/semantic.min.css';
import '../index.scss';

import { NotesStore } from '@contexts/NotesContext';
import { SubscriptionProvider } from 'providers/SubscriptionProvider';
import StoreProvider from '@providers/StoreProvider';
import { SubscriptionBanner } from '@components/Molecules/SubscriptionBanner';
import { SubscriptionModal } from '@components/Molecules/SubscriptionModal';
import GlobalLoader from '@components/GlobalLoader/GlobalLoader';
import Footer from '@components/Footer/Footer';
import DrawerMenu from '@components/DrawerMenu/DrawerMenu';
import NavBlock from '@components/navigation/NavBlock/NavBlock';

export const metadata: Metadata = {
    title: 'Cydoc',
    description: 'Cydoc',
};

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
                                        <div className='layout'>
                                            <GlobalLoader />
                                            <SubscriptionBanner />
                                            <SubscriptionModal />
                                            <div className='main'>
                                                <DrawerMenu />
                                                <div className='content'>
                                                    <NavBlock />
                                                    {children}
                                                    <Footer />
                                                </div>
                                            </div>
                                        </div>
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
