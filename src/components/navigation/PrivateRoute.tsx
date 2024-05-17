// import useAuth from 'hooks/useAuth';
// import React from 'react';
// import { Redirect, Route, RouteProps } from 'react-router-dom';

// export interface PrivateRouteProps extends RouteProps {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     component: any; // we're render anything here
// }
// export const PrivateRoute = ({
//     component: Component,
//     ...rest
// }: PrivateRouteProps) => {
//     const { isSignedIn, authLoading: loading } = useAuth();
//     return (
//         <Route
//             {...rest}
//             render={(props) =>
//                 loading || isSignedIn ? (
//                     <Component {...props} />
//                 ) : (
//                     <Redirect
//                         to={{
//                             pathname: '/login',
//                             state: { from: props.location },
//                         }}
//                     />
//                 )
//             }
//         />
//     );
// };
