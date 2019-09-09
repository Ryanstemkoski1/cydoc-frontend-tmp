import React from 'react';
import ReactDOM from 'react-dom';

import './semantic/src/semantic/dist/semantic.min.css';
import { Route, BrowserRouter } from 'react-router-dom';

import CreateNote from "./pages/CreateNote";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import ThemingLayout from "./pages/Theming";

ReactDOM.render(
    <div style={{letterSpacing: "1.8px"}}>
        <BrowserRouter >
            <Route path="/home" component={HomePage}/>
            <Route path="/login" component={Login}/>
            <Route path="/createnote" component={CreateNote}/>
            <Route path="/dashboard" component={DashboardPage}/>
            <Route path="/about" component={ThemingLayout}/>
        </BrowserRouter>
    </div>, document.getElementById('root'));

