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
// import { STRIPE_KEY } from 'modules/environment';

initializeSentry();

// const stripePromise = loadStripe(STRIPE_KEY);

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
        <AuthProvider>
            <SubscriptionProvider>
                <NotesStore>
                    {/* <HPIStore> */}
                    {/* <Elements stripe={stripePromise}> */}
                    <StoreProvider>
                        <ToastProvider>
                            {/* <Router> */}
                            <html lang='en'>
                                <head>
                                    <meta
                                        name='theme-color'
                                        content='#eaf3f5'
                                    />
                                </head>
                                <body>
                                    <div id='root'>{children}</div>
                                </body>
                            </html>
                            {/* </Router> */}
                        </ToastProvider>
                    </StoreProvider>
                    {/* </Elements> */}
                    {/* </HPIStore> */}
                </NotesStore>
            </SubscriptionProvider>
        </AuthProvider>
    );
}
