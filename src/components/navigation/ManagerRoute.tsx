import React from 'react';
import { Redirect } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { PrivateRoute, PrivateRouteProps } from './PrivateRoute';
import { useAuth } from 'hooks/useAuth';

export const ManagerRoute = (props: PrivateRouteProps) => {
    const { isSignedIn } = useAuth();
    const { isManager, user } = useUser();

    // wait until user info is fetched to determine authorization
    const unauthorizedRole = isSignedIn && user && !isManager;

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
