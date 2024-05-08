import useAuth from 'hooks/useAuth';
import useUser from 'hooks/useUser';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { usePathname } from 'next/navigation';
import { PrivateRoute, PrivateRouteProps } from './PrivateRoute';

// TODO: refactor to use Next.js router and redirect
export const ManagerRoute = (props: PrivateRouteProps) => {
    const { authLoading, isSignedIn } = useAuth();
    const { isManager, user } = useUser();

    // wait until user info is fetched to determine authorization
    const unauthorizedRole = isSignedIn && user && !isManager;
    const notLoggedIn = !authLoading && !isSignedIn;
    const pathname = usePathname();
    const atCurrentRoute = pathname
        ? pathname
              .toLowerCase()
              .includes(props.path?.toString().toLowerCase() || 'no path')
        : false;

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
