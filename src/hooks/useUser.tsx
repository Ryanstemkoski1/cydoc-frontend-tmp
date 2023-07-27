import { useUserInfoContext } from 'providers/UserInfoProvider';

export default () => {
    const { user, updateUserInfo, isManager } = useUserInfoContext();

    return { user, updateUserInfo, isManager };
};
