import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './semantic/src/semantic/dist/semantic.min.css';
import { Route } from "react-router";
import { BrowserRouter } from 'react-router-dom';

import CreateNote from "./pages/CreateNote";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

ReactDOM.render(
    <BrowserRouter >
        <Route path="/home" component={HomePage}/>
        <Route path="/login" component={Login}/>
        <Route path="/createnote" component={CreateNote}/>
    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
