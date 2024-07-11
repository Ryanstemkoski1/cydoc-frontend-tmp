// import Footer from 'components/Footer/Footer';
// import GlobalLoader from 'components/GlobalLoader/GlobalLoader';
// import Policy from 'constants/Documents/policy';
// import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
// import useAuth from 'hooks/useAuth';
// import EditProfile from 'screens/Account/EditProfile';
// import ForgotPasswordPage from 'screens/Account/ForgotPassword';
// import LoginPage from 'screens/Account/LoginPage';
// import ProfileSecurity from 'screens/Account/ProfileSecurity';
// import AcidTest from 'screens/AcidTest';
// import AfterSubmissionPage from 'screens/AfterSubmissionPage';
// import CreateGraph from 'screens/CreateTemplate/CreateGraph';
// import EditGraph from 'screens/CreateTemplate/EditGraph';
// import EditTemplate from 'screens/CreateTemplate/EditTemplate';
// import EditNote from 'screens/EditNote/EditNote';
// import FormPreferencesPage from 'screens/FormPreferences/FormPreferencesPage';
// import GenerateInpatientPlan from 'screens/GenerateInpatientPlan/GenerateInpatientPlan';
// import Home from 'screens/Home/Home';
// import ManagerDashboard from 'screens/ManagerDashboard/ManagerDashboard';
// import NotAuthorized from 'screens/NotAuthorized';
// import QRCodePage from 'screens/QRCodePage/QRCodePage';
// import SignUp from '@screens/Account/SignUp';
// import ViewProduct from 'screens/ViewProduct/ViewProduct';
// import React, { Suspense, lazy, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { Redirect, Route, Switch } from 'react-router';
// import { selectLoadingStatus } from '@redux/reducers/loadingStatusReducer';
// import { ManagerRoute } from './ManagerRoute';
// import NavMenu from './NavMenu';
// import { PrivateRoute } from './PrivateRoute';
// import BrowseNotes from 'screens/BrowseNotes/BrowseNotes';
// import { ProductType, ViewType } from 'constants/enums/route.enums';
// import { SubscriptionPage } from 'screens/Subscription/SubscriptionPage';
// import { SubscriptionCancel } from 'screens/Subscription/CancelSubscription';
// import { SubscriptionBanner } from 'components/Molecules/SubscriptionBanner';
// import { SubscriptionModal } from 'components/Molecules/SubscriptionModal';
// import useUser from 'hooks/useUser';
// import { usePathname } from 'next/navigation';

// const HPILazyLoad = lazy(() => import('screens/HPI/Hpi'));

// const Routes = (props: { children?: JSX.Element | null }) => {
//     const pathname = usePathname();
//     const isHomePage = pathname === '/';
//     const loadingStatus = useSelector(selectLoadingStatus);
//     const { authLoading } = useAuth();
//     const { loading: userLoading } = useUser();

//     const HPI = useCallback(() => {
//         return (
//             <Suspense fallback={<GlobalLoader />}>
//                 <HPILazyLoad />
//             </Suspense>
//         );
//     }, []);

//     return (
//         <div className='layout'>
//             {(authLoading || loadingStatus || userLoading) && <GlobalLoader />}
//             <SubscriptionBanner />
//             <SubscriptionModal />
//             <NavMenu attached={'top'} displayNoteName={true} />{' '}
//             <div className='layout__content'>
//                 <Switch>
//                     <Route exact path='/' component={Home} />
//                     <Route exact path='/sign-up' component={SignUp} />
//                     <Route exact path='/login' component={LoginPage} />
//                     <Route
//                         exact
//                         path='/not-authorized'
//                         component={NotAuthorized}
//                     />
//                     <Route
//                         exact
//                         path='/forgot-password'
//                         component={ForgotPasswordPage}
//                     />
//                     <PrivateRoute exact path='/editnote' component={EditNote} />
//                     <PrivateRoute exact path='/qrcode' component={QRCodePage} />
//                     <PrivateRoute
//                         exact
//                         path={`/${ProductType.HPI}/${ViewType.DOCTOR}`}
//                         component={BrowseNotes}
//                     />
//                     <Route
//                         exact
//                         path={`/${ProductType.HPI}/${ViewType.PATIENT}`}
//                         component={HPI}
//                     />
//                     <Route
//                         exact
//                         path='/generateinpatientplan'
//                         component={GenerateInpatientPlan}
//                     />
//                     <Route exact path='/acid-test' component={AcidTest} />
//                     <PrivateRoute
//                         exact
//                         path='/templates/new'
//                         component={CreateGraph}
//                     />
//                     <PrivateRoute
//                         exact
//                         path='/templates/old'
//                         component={EditGraph}
//                     />
//                     <PrivateRoute
//                         exact
//                         path='/templates/edit'
//                         component={EditTemplate}
//                     />
//                     <PrivateRoute
//                         exact
//                         path='/editprofile'
//                         component={EditProfile}
//                     />
//                     <PrivateRoute
//                         exact
//                         path='/profilesecurity'
//                         component={ProfileSecurity}
//                     />
//                     <ManagerRoute
//                         exact
//                         path='/manager-dashboard'
//                         component={ManagerDashboard}
//                     />
//                     <ManagerRoute
//                         exact
//                         path='/form-preferences'
//                         component={FormPreferencesPage}
//                     />
//                     <ManagerRoute
//                         exact
//                         path='/subscription'
//                         component={SubscriptionPage}
//                     />
//                     <ManagerRoute
//                         exact
//                         path='/subscription/cancel'
//                         component={SubscriptionCancel}
//                     />
//                     <Route exact path='/view/product' component={ViewProduct} />
//                     <Route exact path='/privacypolicy' component={Policy} />
//                     <Route
//                         exact
//                         path='/termsandconditions'
//                         component={Terms_and_conditions}
//                     />
//                     <Route
//                         exact
//                         path={'/submission-successful'}
//                         component={AfterSubmissionPage}
//                     />
//                     <Route
//                         exact
//                         path='*'
//                         component={() => <Redirect to='/' />}
//                     />
//                 </Switch>
//             </div>
//             {!isHomePage && <Footer />}
//             {props.children}
//         </div>
//     );
// };
// export default Routes;
