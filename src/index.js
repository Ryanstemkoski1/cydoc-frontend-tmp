import React from "react";
import { CookiesProvider } from "react-cookie"
import './semantic/src/semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import './semantic/src/semantic/dist/semantic.min.css';
import { Route, BrowserRouter } from 'react-router-dom';
import EditNote from "./pages/EditNote/EditNote";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register"
import DashboardPage from "./pages/MyNotes/DashboardPage";
import ThemingLayout from "./pages/About/Theming";
import { PrivateRoute } from "./components/navigation/PrivateRoute";
import CreateGraph from "./pages/CreateTemplate/CreateGraph";
import EditGraph from './pages/CreateTemplate/EditGraph'
import { HPIStore } from "./contexts/HPIContext";
import { AuthStore } from "./contexts/AuthContext";
import { NotesStore } from "./contexts/NotesContext";
import { CreateTemplateStore } from "./contexts/CreateTemplateContext";


ReactDOM.render(
    <CookiesProvider>
        <AuthStore>
            <NotesStore>
                <HPIStore>
                    <CreateTemplateStore>
                        <div style={{ letterSpacing: "1.8px" }}>
                            <BrowserRouter >
                                <Route path="/home" component={HomePage} />
                                <Route path="/login" component={Login} />
                                <Route path="/register" component={Register} />
                                <PrivateRoute path="/editnote" component={EditNote} />
                                <PrivateRoute path="/dashboard" component={DashboardPage} />
                                <PrivateRoute path="/creategraph" component={CreateGraph} />
                                <PrivateRoute path="/editgraph" component={EditGraph} />
                                <Route path="/about" component={ThemingLayout} />
                            </BrowserRouter>
                        </div>
                    </CreateTemplateStore>
                </HPIStore>
            </NotesStore>
        </AuthStore>
    </CookiesProvider>, document.getElementById('root'));

