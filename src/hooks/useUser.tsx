import { UserInfoProviderContext } from 'providers/UserInfoProvider';
import { useContext } from 'react';
import invariant from 'tiny-invariant';

export default () => {
    const ctx = useContext(UserInfoProviderContext);

    invariant(
        ctx,
        'UserInfoProviderContext called outside of UserInfo Context'
    );

    return ctx;
};
