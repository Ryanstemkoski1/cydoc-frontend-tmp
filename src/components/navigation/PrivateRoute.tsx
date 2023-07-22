import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

interface Props extends RouteProps {
    component: any;
}
export const PrivateRoute = ({ component: Component, ...rest }: Props) => {
    const { isSignedIn } = useAuth();
    return (
        <Route
            {...rest}
            render={(props) =>
                isSignedIn ? (
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
