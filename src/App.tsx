import { Elements } from '@stripe/react-stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import Routes from 'components/navigation/Routes';
import { AuthProvider } from 'providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeSentry } from './modules/logging';
import './semantic/dist/semantic.min.css';

import React, { useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { HPIStore } from './contexts/HPIContext';
import { HPITemplateStore } from './contexts/HPITemplateContext';
import { NotesStore } from './contexts/NotesContext';
import './index.scss';
import { currentNoteStore } from './redux/store';
import './semantic/dist/semantic.min.css';
import { SubscriptionProvider } from 'providers/SubscriptionProvider';
import { STRIPE_KEY } from 'modules/environment';

initializeSentry();

// TODO: move to new nextjs client.tsx

export function App() {
    const [stripePromise, setStripePromise] =
        useState<Promise<Stripe | null> | null>(null);

    // load stripe only once
    useEffect(() => {
        setStripePromise(loadStripe(STRIPE_KEY));
    }, []);

    return (
        <CookiesProvider>
            <AuthProvider>
                <SubscriptionProvider>
                    <NotesStore>
                        <HPIStore>
                            <HPITemplateStore>
                                <Elements stripe={stripePromise}>
                                    <Provider store={currentNoteStore}>
                                        <ToastContainer
                                            theme='colored'
                                            position='bottom-right'
                                        />
                                        <Router>
                                            <Routes />
                                        </Router>
                                    </Provider>
                                </Elements>
                            </HPITemplateStore>
                        </HPIStore>
                    </NotesStore>
                </SubscriptionProvider>
            </AuthProvider>
        </CookiesProvider>
    );
}
