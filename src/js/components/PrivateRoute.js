import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'

export const PrivateRoute = ({ component: Component, ...rest }) => {
    let context = useContext(AuthContext)
    return (
        <Route {...rest} render={props => (
            context.token
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />
    )
};