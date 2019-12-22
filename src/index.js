import React from "react";
import { Provider } from "react-redux";
import store from "./js/store/index";
import './semantic/src/semantic/dist/semantic.min.css';
import ReactDOM from 'react-dom';
import './semantic/src/semantic/dist/semantic.min.css';
import { Route, BrowserRouter } from 'react-router-dom';
import EditNote from "./js/pages/EditNote";
import HomePage from "./js/pages/HomePage";
import Login from "./js/pages/Login";
import DashboardPage from "./js/pages/DashboardPage";
import ThemingLayout from "./js/pages/Theming";
import NewNote from "./js/pages/NewNote";
import {PrivateRoute} from "./js/components/PrivateRoute";
import CreateGraph from "./js/pages/CreateGraph";
import EditGraph from './js/pages/EditGraph'
import {HPIStore} from "./js/contexts/HPIContext";


ReactDOM.render(
    <Provider store={store}>
        <HPIStore>
            <div style={{letterSpacing: "1.8px"}}>
                <BrowserRouter >
                    <Route path="/home" component={HomePage}/>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute path="/createnote" component={NewNote}/>
                    <PrivateRoute path="/editnote" component={EditNote}/>
                    <PrivateRoute path="/dashboard" component={DashboardPage}/>
                    <PrivateRoute path={"/creategraph"} component={CreateGraph} />
                    <PrivateRoute path={"/editgraph"} component={EditGraph} />
                    <Route path="/about" component={ThemingLayout}/>
                </BrowserRouter>
            </div>
        </HPIStore>
        
    </Provider>, document.getElementById('root'));

