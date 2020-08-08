import React from "react";
import { CookiesProvider } from "react-cookie"
import './semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import EditNote 				from "./pages/EditNote/EditNote";
import HomePage 				from "./pages/HomePage/HomePage";
import Login 					from "./pages/Account/Login";
import Register 				from "./pages/Account/Register"
import LandingPage 			from "./pages/LandingPage/LandingPage";
import ThemingLayout 			from "./pages/About/Theming";
import { PrivateRoute } 		from "./components/navigation/PrivateRoute";
import CreateGraph 				from "./pages/CreateTemplate/CreateGraph";
import EditGraph 				from './pages/CreateTemplate/EditGraph'
import { HPIStore } 			from "./contexts/HPIContext";
import { AuthStore } 			from "./contexts/AuthContext";
import { NotesStore } 			from "./contexts/NotesContext";
import { CreateTemplateStore } 	from "./contexts/CreateTemplateContext";
import EditProfile from "./pages/Account/EditProfile";
import "./index.css";

ReactDOM.render(
    <CookiesProvider>
        <AuthStore>
            <NotesStore>
                <HPIStore>
                    <CreateTemplateStore>
                        <div>
                        {/* <div style={{backgroundColor:'#d5dfe1'}}> */}
                            <BrowserRouter>
                                <Route path="/home" component={HomePage} />
                                <Route path="/login" component={Login} />
                                <Route path="/register" component={Register} />
                                <PrivateRoute path="/editnote" component={EditNote} />
                                <PrivateRoute path="/dashboard" component={LandingPage} />
                                <PrivateRoute path="/creategraph" component={CreateGraph} />
                                <PrivateRoute path="/editgraph" component={EditGraph} />
                                <PrivateRoute path="/editprofile" component={EditProfile} />
                                <Route path="/about" component={ThemingLayout} />
                            </BrowserRouter>
                        </div>
                    </CreateTemplateStore>
                </HPIStore>
            </NotesStore>
        </AuthStore>
    </CookiesProvider>, document.getElementById('root'));

