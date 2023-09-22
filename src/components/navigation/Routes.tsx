import Footer from 'components/Footer/Footer';
import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
import Policy from 'constants/Documents/policy';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
import useAuth from 'hooks/useAuth';
import { EditPayment } from 'pages/Account/EditPayment';
import EditProfile from 'pages/Account/EditProfile';
import ForgotPasswordPage from 'pages/Account/ForgotPassword';
import LoginPage from 'pages/Account/LoginPage';
import ProfileSecurity from 'pages/Account/ProfileSecurity';
import AcidTest from 'pages/AcidTest';
import AfterSubmissionPage from 'pages/AfterSubmissionPage';
import CreateGraph from 'pages/CreateTemplate/CreateGraph';
import EditGraph from 'pages/CreateTemplate/EditGraph';
import EditTemplate from 'pages/CreateTemplate/EditTemplate';
import EditNote from 'pages/EditNote/EditNote';
import GenerateInpatientPlan from 'pages/GenerateInpatientPlan/GenerateInpatientPlan';
import Home from 'pages/Home/Home';
import LandingPage from 'pages/LandingPage/LandingPage';
import LandingPagePublic from 'pages/LandingPage/LandingPagePublic';
import ManagerDashboard from 'pages/ManagerDashboard/ManagerDashboard';
import NotAuthorized from 'pages/NotAuthorized';
import QRCodePage from 'pages/QRCodePage/QRCodePage';
import SignUp from 'pages/SignUp';
import ViewProduct from 'pages/ViewProduct/ViewProduct';
import React, { Suspense, lazy, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router';
import { CurrentNoteState } from 'redux/reducers';
import { ManagerRoute } from './ManagerRoute';
import NavMenu from './NavMenu';
import { PrivateRoute } from './PrivateRoute';
import BrowseNotes from 'pages/BrowseNotes/BrowseNotes';
import { ProductType, ViewType } from 'assets/enums/route.enums';

const HPILazyLoad = lazy(() => import('pages/HPI/Hpi'));

const Routes = (props: { children?: JSX.Element | null }) => {
    const isHomePage = useLocation().pathname === '/';
    const loadingStatus = useSelector(
        (state: CurrentNoteState) => state.loadingStatus
    );
    const { authLoading } = useAuth();

    const HPI = useCallback(() => {
        return (
            <Suspense fallback={<GlobalLoader />}>
                <HPILazyLoad />
            </Suspense>
        );
    }, []);

    return (
        <div className='layout'>
            {(authLoading || loadingStatus) && <GlobalLoader />}
            <NavMenu attached={'top'} displayNoteName={true} />{' '}
            <div className='layout__content'>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/sign-up' component={SignUp} />
                    <Route exact path='/login' component={LoginPage} />
                    <Route
                        exact
                        path='/not-authorized'
                        component={NotAuthorized}
                    />
                    <Route
                        exact
                        path='/forgot-password'
                        component={ForgotPasswordPage}
                    />
                    <PrivateRoute exact path='/editnote' component={EditNote} />
                    <PrivateRoute exact path='/qrcode' component={QRCodePage} />
                    <PrivateRoute
                        exact
                        path={`/${ProductType.HPI}/${ViewType.DOCTOR}`}
                        component={BrowseNotes}
                    />
                    <Route
                        exact
                        path={`/${ProductType.HPI}/${ViewType.PATIENT}`}
                        component={HPI}
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
                        path='/account/edit-payment'
                        component={EditPayment}
                    />
                    <ManagerRoute
                        exact
                        path='/manager-dashboard'
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
