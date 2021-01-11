import React from "react";
import { CookiesProvider } from "react-cookie"
import './semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import EditNote 				from "./pages/EditNote/EditNote";
import Login 					from "./pages/Account/Login";
import Register 				from "./pages/Account/Register"
import LandingPage 			    from "./pages/LandingPage/LandingPage";
import LandingPageOld 			    from "./pages/LandingPage/LandingPage-old";

import Home 			from "./pages/Home/Home";
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
                            <BrowserRouter>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Register} />
                                <PrivateRoute exact path="/editnote" component={EditNote} />
                                <PrivateRoute exact path="/dashboard" component={LandingPage} />
                                <PrivateRoute exact path="/creategraph" component={CreateGraph} />
                                <PrivateRoute exact path="/editgraph" component={EditGraph} />
                                <PrivateRoute exact path="/editprofile" component={EditProfile} />
                            </BrowserRouter>
                        </div>
                    </CreateTemplateStore>
                </HPIStore>
            </NotesStore>
        </AuthStore>
    </CookiesProvider>, document.getElementById('root'));
