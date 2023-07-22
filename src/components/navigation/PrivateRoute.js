import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { mfaCompleted } = useAuth();
    return (
        <Route
            {...rest}
            render={(props) =>
                mfaCompleted ? (
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
