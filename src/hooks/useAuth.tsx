import { useAuthInfoContext } from 'providers/AuthProvider';

// Access auth context values and functions
export default () => {
    const ctx = useAuthInfoContext();

    return ctx;
};
