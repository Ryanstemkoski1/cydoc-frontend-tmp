import React from 'react';
import { CookiesProvider } from 'react-cookie';
import './semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import EditNote from './pages/EditNote/EditNote';
import Login from './pages/Account/Login';
import ForgotPasswordEmail from './pages/Account/ForgotPasswordEmail';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import { PrivateRoute } from './components/navigation/PrivateRoute';
import CreateGraph from './pages/CreateTemplate/CreateGraph';
import EditGraph from './pages/CreateTemplate/EditGraph';
import EditTemplate from './pages/CreateTemplate/EditTemplate';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard';
import { HPIStore } from './contexts/HPIContext';
import { AuthStore } from './contexts/AuthContext';
import { NotesStore } from './contexts/NotesContext';
import { HPITemplateStore } from './contexts/HPITemplateContext';
import EditProfile from './pages/Account/EditProfile';
import ProfileSecurity from './pages/Account/ProfileSecurity';
import './index.css';

ReactDOM.render(
    <CookiesProvider>
        <AuthStore>
            <NotesStore>
                <HPIStore>
                    <HPITemplateStore>
                        <div>
                            <BrowserRouter>
                                <Route exact path='/' component={Home} />
                                <Route exact path='/login' component={Login} />
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
                                    path='/dashboard'
                                    component={LandingPage}
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
                            </BrowserRouter>
                        </div>
                    </HPITemplateStore>
                </HPIStore>
            </NotesStore>
        </AuthStore>
    </CookiesProvider>,
    document.getElementById('root')
);
