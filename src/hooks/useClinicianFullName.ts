import useUser from './useUser';

function useClinicianFullName() {
    const { user } = useUser();

    return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`;
}

export default useClinicianFullName;
