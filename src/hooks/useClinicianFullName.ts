import { Context } from 'components/navigation/NoteNameMenuItem';
import AuthContext from 'contexts/AuthContext';
import { useContext } from 'react';

function useClinicianFullName() {
    const { user } = useContext(AuthContext) as Context;

    return `${user?.firstName ?? ''} ${user?.middleName ?? ''} ${
        user?.lastName ?? ''
    }`;
}

export default useClinicianFullName;
