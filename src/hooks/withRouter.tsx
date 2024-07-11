/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/dist/client/router';
import {
    BaseContext,
    NextComponentType,
    NextPageContext,
} from 'next/dist/shared/lib/utils';

export type WithRouterProps = {
    router: NextRouter;
};

export type ExcludeRouterProps<P> = Pick<
    P,
    Exclude<keyof P, keyof WithRouterProps>
>;

/**
 * A higher order component that provides the `router` object as a prop.
 * We use this instead of withRouter from 'next/router' because it is
 * not compatible with the 'app' directory routing we use.
 */
export default function withRouter<
    P extends WithRouterProps,
    C extends BaseContext = NextPageContext,
>(
    ComposedComponent: NextComponentType<C, any, P>
): React.ComponentType<ExcludeRouterProps<P>> {
    function WithRouterWrapper(props: any): JSX.Element {
        return <ComposedComponent router={useRouter()} {...props} />;
    }

    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    // This is needed to allow checking for custom getInitialProps in _app
    (WithRouterWrapper as any).origGetInitialProps = (
        ComposedComponent as any
    ).origGetInitialProps;
    if (process.env.NODE_ENV !== 'production') {
        const name =
            ComposedComponent.displayName ||
            ComposedComponent.name ||
            'Unknown';
        WithRouterWrapper.displayName = `withRouter(${name})`;
    }

    return WithRouterWrapper;
}
