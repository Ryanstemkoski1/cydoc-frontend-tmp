import Footer from 'components/Footer/Footer';
import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
import Policy from 'constants/Documents/policy';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
import EditProfile from 'pages/Account/EditProfile';
import ForgotPasswordEmail from 'pages/Account/ForgotPasswordEmail';
import Login from 'pages/Account/Login';
import ProfileSecurity from 'pages/Account/ProfileSecurity';
import AcidTest from 'pages/AcidTest';
import AfterSubmissionPage from 'pages/AfterSubmissionPage';
import CreateGraph from 'pages/CreateTemplate/CreateGraph';
import EditGraph from 'pages/CreateTemplate/EditGraph';
import EditTemplate from 'pages/CreateTemplate/EditTemplate';
import EditNote from 'pages/EditNote/EditNote';
import QRCodePage from 'pages/EditNote/QRCodePage';
import GenerateInpatientPlan from 'pages/GenerateInpatientPlan/GenerateInpatientPlan';
import HPI from 'pages/HPI/Hpi';
import LandingPage from 'pages/LandingPage/LandingPage';
import LandingPagePublic from 'pages/LandingPage/LandingPagePublic';
import ManagerDashboard from 'pages/ManagerDashboard/ManagerDashboard';
import Home from 'pages/version2/Home/Home';
import ViewProduct from 'pages/version2/ViewProduct/ViewProduct';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { CurrentNoteState } from 'redux/reducers';
import { PrivateRoute } from './PrivateRoute';

const Routes = (props: { children?: JSX.Element | null }) => {
    const isHomePage = useLocation().pathname === '/';
    const loadingStatus = useSelector(
        (state: CurrentNoteState) => state.loadingStatus
    );

    return (
        <div className='layout'>
            {loadingStatus && <GlobalLoader />}
            <div className='layout__content'>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route
                        exact
                        path='/forgotpasswordemail'
                        component={ForgotPasswordEmail}
                    />
                    <PrivateRoute exact path='/editnote' component={EditNote} />
                    <PrivateRoute exact path='/qrcode' component={QRCodePage} />
                    <Route exact path='/hpi/:view' component={HPI} />
                    <Route
                        exact
                        path='/hpi/'
                        component={(props: any) => (
                            <Redirect to='/hpi/patient' {...props} />
                        )}
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
                    <Route exact path='/view/product' component={ViewProduct} />
                    <Route exact path='/privacypolicy' component={Policy} />
                    <Route
                        exact
                        path='/termsandconditions'
                        component={Terms_and_conditions}
                    />
                    <Route
                        exact
                        path={'/submission-successful'}
                        component={AfterSubmissionPage}
                    />
                    <Route
                        exact
                        path='*'
                        component={() => <Redirect to='/' />}
                    />
                </Switch>
            </div>
            {!isHomePage && <Footer />}
            {props.children}
        </div>
    );
};
export default Routes;
