import React from 'react';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import './semantic/dist/semantic.min.css';
import { HPIStore } from './contexts/HPIContext';
import { AuthStore } from './contexts/AuthContext';
import { NotesStore } from './contexts/NotesContext';
import { HPITemplateStore } from './contexts/HPITemplateContext';
import './index.css';
import { Provider } from 'react-redux';
import { currentNoteStore } from './redux/store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { isLivemode } from './auth/livemode';
import Routes from 'components/navigation/Routes';
import { initializeSentry } from 'modules/logging';

initializeSentry();

const container = document.getElementById('root');
// react's container is never null
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

const getStripePublishableKey = () => {
    if (isLivemode()) {
        return 'pk_live_51I8WjzI5qo8H3FXU0K1gpndArcjAxLcGR3GWHyCaFsSxB6XckVoWeTH8rzkajlpdgQN1OTiWd4vEhnjKboqyks0g000p9or7In';
    } else {
        return 'pk_test_51I8WjzI5qo8H3FXUmqt1mnPq9onbLPQz3KhqYIpYHlMGP3y5KqKX2lcC7ky80DUIG6V7kFrWQpFe5UgnmE4AL0l900eCenDWSX';
    }
};

const stripePromise = loadStripe(getStripePublishableKey());

function App() {
    return (
        <CookiesProvider>
            <AuthStore>
                <NotesStore>
                    <HPIStore>
                        <HPITemplateStore>
                            <Elements stripe={stripePromise}>
                                <Provider store={currentNoteStore}>
                                    <Routes />
                                </Provider>
                            </Elements>
                        </HPITemplateStore>
                    </HPIStore>
                </NotesStore>
            </AuthStore>
        </CookiesProvider>
    );
}

root.render(<App />);
