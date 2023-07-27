import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

export interface PrivateRouteProps extends RouteProps {
    component: any;
}
export const PrivateRoute = ({
    component: Component,
    ...rest
}: PrivateRouteProps) => {
    const { isSignedIn, authLoading: loading } = useAuth();
    return (
        <Route
            {...rest}
            render={(props) =>
                loading || isSignedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};
