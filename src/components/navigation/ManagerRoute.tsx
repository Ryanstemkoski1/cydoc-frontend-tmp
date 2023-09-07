import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { PrivateRoute, PrivateRouteProps } from './PrivateRoute';

export const ManagerRoute = (props: PrivateRouteProps) => {
    const { authLoading, isSignedIn } = useAuth();
    const { isManager, user } = useUser();

    // wait until user info is fetched to determine authorization
    const unauthorizedRole = isSignedIn && user && !isManager;
    const notLoggedIn = !authLoading && !isSignedIn;
    const location = useLocation();
    const atCurrentRoute = location.pathname
        .toLowerCase()
        .includes(props.path?.toString().toLowerCase() || 'no path');

    // V5 of browser router is calling render() once for all routes
    // if this is happening, we should not redirect users
    if (!atCurrentRoute) return null;

    if (notLoggedIn) {
        <Redirect
            to={{
                pathname: '/login',
                state: { from: props.location },
            }}
        />;
    }

    return unauthorizedRole ? (
        <Redirect
            to={{
                pathname: '/not-authorized',
                state: { from: props.location },
            }}
        />
    ) : (
        <PrivateRoute {...props} />
    );
};
