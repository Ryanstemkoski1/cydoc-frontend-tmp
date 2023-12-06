import { Elements } from '@stripe/react-stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import Routes from 'components/navigation/Routes';
import { AuthProvider } from 'providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeSentry } from '../src/modules/logging';
import './semantic/dist/semantic.min.css';

import React, { useEffect, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
// react's container is never null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

function App() {
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

root.render(<App />);
