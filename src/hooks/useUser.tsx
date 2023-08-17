import { useUserInfoContext } from 'providers/UserInfoProvider';

export default () => {
    return { ...useUserInfoContext() };
};
