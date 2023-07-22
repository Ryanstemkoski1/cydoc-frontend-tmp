import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

export const PrivateRoute = ({ component: Component, ...rest }) => {
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
