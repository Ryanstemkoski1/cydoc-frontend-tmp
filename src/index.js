import React from "react";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie"
import store from "./js/store/index";
import './semantic/src/semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import './semantic/src/semantic/dist/semantic.min.css';
import { Route, BrowserRouter } from 'react-router-dom';
import EditNote from "./js/pages/EditNote";
import HomePage from "./js/pages/HomePage";
import Login from "./js/pages/Login";
import Register from "./js/pages/Register"
import DashboardPage from "./js/pages/DashboardPage";
import ThemingLayout from "./js/pages/Theming";
import NewNote from "./js/pages/NewNote";
import {PrivateRoute} from "./js/components/PrivateRoute";
import CreateGraph from "./js/pages/CreateGraph";
import EditGraph from './js/pages/EditGraph'
import {HPIStore} from "./js/contexts/HPIContext";
import {AuthStore} from "./js/contexts/AuthContext";
import { NotesStore } from "./js/contexts/NotesContext";
import { CreateTemplateStore } from "./js/contexts/CreateTemplateContext";


ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <AuthStore>
                <NotesStore>
                    <HPIStore>
                        <CreateTemplateStore>
                            <div style={{letterSpacing: "1.8px"}}>
                                <BrowserRouter >
                                    <Route path="/home" component={HomePage}/>
                                    <Route path="/login" component={Login}/>
                                    <Route path="/register" component={Register}/>
                                    <PrivateRoute path="/createnote" component={NewNote}/>
                                    <PrivateRoute path="/editnote" component={EditNote}/>
                                    <PrivateRoute path="/dashboard" component={DashboardPage}/>
                                    <PrivateRoute path="/creategraph" component={CreateGraph} />
                                    <PrivateRoute path="/editgraph" component={EditGraph} />
                                    <Route path="/about" component={ThemingLayout}/>
                                </BrowserRouter>
                            </div>
                        </CreateTemplateStore>
                    </HPIStore>
                </NotesStore>
            </AuthStore>
        </CookiesProvider>
    </Provider>, document.getElementById('root'));

