import React from 'react';
import type { Metadata } from 'next';

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from 'providers/AuthProvider';
import ToastProvider from 'providers/ToastProvider';
import { initializeSentry } from '@modules/logging';
import '../semantic/dist/semantic.min.css';
import '../index.scss';

// import { BrowserRouter as Router } from 'react-router-dom';
// import { HPIStore } from '@contexts/HPIContext';
import { NotesStore } from '@contexts/NotesContext';
import { SubscriptionProvider } from 'providers/SubscriptionProvider';
import StoreProvider from '@providers/StoreProvider';
import { SubscriptionBanner } from '@components/Molecules/SubscriptionBanner';
import { SubscriptionModal } from '@components/Molecules/SubscriptionModal';
import NavMenu from '@components/navigation/NavMenu';
import GlobalLoader from '@components/GlobalLoader/GlobalLoader';
// import { STRIPE_KEY } from 'modules/environment';

initializeSentry();

// const stripePromise = loadStripe(STRIPE_KEY);

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
                                {/* <HPIStore> */}
                                {/* <Elements stripe={stripePromise}> */}
                                <StoreProvider>
                                    <ToastProvider>
                                        {/* <Router> */}

                                        <div className='layout'>
                                            <GlobalLoader />
                                            <SubscriptionBanner />
                                            <SubscriptionModal />
                                            <NavMenu
                                                attached={'top'}
                                                displayNoteName={true}
                                            />
                                            {children}
                                            {/* </Router> */}
                                        </div>
                                    </ToastProvider>
                                </StoreProvider>
                                {/* </Elements> */}
                                {/* </HPIStore> */}
                            </NotesStore>
                        </SubscriptionProvider>
                    </AuthProvider>
                </main>
            </body>
        </html>
    );
}
