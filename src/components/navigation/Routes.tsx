import Policy from 'constants/Documents/policy';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
import EditProfile from 'pages/Account/EditProfile';
import ForgotPasswordPage from 'pages/Account/ForgotPassword';
import LoginPage from 'pages/Account/LoginPage';
import ProfileSecurity from 'pages/Account/ProfileSecurity';
import AcidTest from 'pages/AcidTest';
import CreateGraph from 'pages/CreateTemplate/CreateGraph';
import EditGraph from 'pages/CreateTemplate/EditGraph';
import EditTemplate from 'pages/CreateTemplate/EditTemplate';
import EditNote from 'pages/EditNote/EditNote';
import GenerateInpatientPlan from 'pages/GenerateInpatientPlan/GenerateInpatientPlan';
import Home from 'pages/Home/Home';
import LandingPage from 'pages/LandingPage/LandingPage';
import LandingPagePublic from 'pages/LandingPage/LandingPagePublic';
import ManagerDashboard from 'pages/ManagerDashboard/ManagerDashboard';
import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { EditPayment } from 'pages/Account/EditPayment';
import SignUp from 'pages/SignUp';
import NotAuthorized from 'pages/NotAuthorized';
import { ManagerRoute } from './ManagerRoute';
import NavMenu from './NavMenu';

const Routes = (props: { children?: JSX.Element | null }) => {
    return (
        <BrowserRouter>
            <NavMenu attached={'top'} displayNoteName={false} />{' '}
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/sign-up' component={SignUp} />
            <Route exact path='/not-authorized' component={NotAuthorized} />
            <Route
                exact
                path='/forgot-password'
                component={ForgotPasswordPage}
            />
            <PrivateRoute
                exact
                path='/account/edit-payment'
                component={EditPayment}
            />
            <PrivateRoute exact path='/editnote' component={EditNote} />
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
            <PrivateRoute exact path='/acid-test' component={AcidTest} />
            <PrivateRoute exact path='/templates/new' component={CreateGraph} />
            <PrivateRoute exact path='/templates/old' component={EditGraph} />
            <PrivateRoute
                exact
                path='/templates/edit'
                component={EditTemplate}
            />
            <PrivateRoute exact path='/editprofile' component={EditProfile} />
            <PrivateRoute
                exact
                path='/profilesecurity'
                component={ProfileSecurity}
            />
            <ManagerRoute
                exact
                path='/managerdashboard'
                component={ManagerDashboard}
            />
            <Route exact path='/privacypolicy' component={Policy} />
            <Route
                exact
                path='/termsandconditions'
                component={Terms_and_conditions}
            />
            <div className='footer-copyright'>
                Copyright © 2023 Cydoc Corporation. All rights reserved. Patent
                pending. &emsp;•&emsp;
                <a href='/privacypolicy' style={{ color: '#147A9B' }}>
                    Privacy Policy
                </a>
                &emsp; • &emsp;
                <a href='/termsandconditions' style={{ color: '#147A9B' }}>
                    Terms and Conditions
                </a>
            </div>
            {props.children}
        </BrowserRouter>
    );
};
export default Routes;
