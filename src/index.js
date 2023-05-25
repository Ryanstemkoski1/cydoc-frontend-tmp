import React from 'react';
import { CookiesProvider } from 'react-cookie';
import './semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import EditNote from './pages/EditNote/EditNote';
import Login from './pages/Account/Login';
import ForgotPasswordEmail from './pages/Account/ForgotPasswordEmail';
import LandingPage from './pages/LandingPage/LandingPage';
import LandingPagePublic from 'pages/LandingPage/LandingPagePublic';
import Home from './pages/Home/Home';
import { PrivateRoute } from './components/navigation/PrivateRoute';
import CreateGraph from './pages/CreateTemplate/CreateGraph';
import EditGraph from './pages/CreateTemplate/EditGraph';
import EditTemplate from './pages/CreateTemplate/EditTemplate';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard';
import GenerateInpatientPlan from 'pages/GenerateInpatientPlan/GenerateInpatientPlan';
import { HPIStore } from './contexts/HPIContext';
import { AuthStore } from './contexts/AuthContext';
import { NotesStore } from './contexts/NotesContext';
import { HPITemplateStore } from './contexts/HPITemplateContext';
import EditProfile from './pages/Account/EditProfile';
import ProfileSecurity from './pages/Account/ProfileSecurity';
import './index.css';
import { Provider } from 'react-redux';
import { currentNoteStore } from './redux/store';
import Policy from './constants/Documents/policy';
import Terms_and_conditions from './constants/Documents/terms_and_conditions';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { isLivemode } from './auth/livemode';
import AcidTest from 'pages/AcidTest';

const getStripePublishableKey = () => {
    if (isLivemode()) {
        return 'pk_live_51I8WjzI5qo8H3FXU0K1gpndArcjAxLcGR3GWHyCaFsSxB6XckVoWeTH8rzkajlpdgQN1OTiWd4vEhnjKboqyks0g000p9or7In';
    } else {
        return 'pk_test_51I8WjzI5qo8H3FXUmqt1mnPq9onbLPQz3KhqYIpYHlMGP3y5KqKX2lcC7ky80DUIG6V7kFrWQpFe5UgnmE4AL0l900eCenDWSX';
    }
};

const stripePromise = loadStripe(getStripePublishableKey());

ReactDOM.render(
    <CookiesProvider>
        <AuthStore>
            <NotesStore>
                <HPIStore>
                    <HPITemplateStore>
                        <Elements stripe={stripePromise}>
                            <Provider store={currentNoteStore}>
                                <div>
                                    <BrowserRouter>
                                        <Route
                                            exact
                                            path='/'
                                            component={Home}
                                        />
                                        <Route
                                            exact
                                            path='/login'
                                            component={Login}
                                        />
                                        <Route
                                            exact
                                            path='/forgotpasswordemail'
                                            component={ForgotPasswordEmail}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/editnote'
                                            component={EditNote}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/secretdashboard'
                                            component={LandingPage}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/dashboard'
                                            component={LandingPagePublic}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/generateinpatientplan'
                                            component={GenerateInpatientPlan}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/acid-test'
                                            component={AcidTest}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/templates/new'
                                            component={CreateGraph}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/templates/old'
                                            component={EditGraph}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/templates/edit'
                                            component={EditTemplate}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/editprofile'
                                            component={EditProfile}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/profilesecurity'
                                            component={ProfileSecurity}
                                        />
                                        <PrivateRoute
                                            exact
                                            path='/managerdashboard'
                                            component={ManagerDashboard}
                                        />
                                        <Route
                                            exact
                                            path='/privacypolicy'
                                            component={Policy}
                                        />
                                        <Route
                                            exact
                                            path='/termsandconditions'
                                            component={Terms_and_conditions}
                                        />
                                        <div className='footer-copyright'>
                                            Copyright © 2023 Cydoc Corporation.
                                            All rights reserved. Patent pending.
                                            &emsp;•&emsp;
                                            <a
                                                href='/privacypolicy'
                                                style={{ color: '#147A9B' }}
                                            >
                                                Privacy Policy
                                            </a>
                                            &emsp; • &emsp;
                                            <a
                                                href='/termsandconditions'
                                                style={{ color: '#147A9B' }}
                                            >
                                                Terms and Conditions
                                            </a>
                                        </div>
                                    </BrowserRouter>
                                </div>
                            </Provider>
                        </Elements>
                    </HPITemplateStore>
                </HPIStore>
            </NotesStore>
        </AuthStore>
    </CookiesProvider>,
    document.getElementById('root')
);
