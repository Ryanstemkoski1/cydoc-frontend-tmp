import { UserInfoProviderContext } from 'providers/UserInfoProvider';
import { useContext } from 'react';
import invariant from 'tiny-invariant';

const useUser = () => {
    const ctx = useContext(UserInfoProviderContext);

    invariant(
        ctx,
        'UserInfoProviderContext called outside of UserInfo Context'
    );

    return ctx;
};

export default useUser;
