import { DbUser } from 'types/users';
import { getFromApi } from './api';
import { ApiResponse } from 'types/api';
import invariant from 'tiny-invariant';
import { Institution } from 'types/intitutions';

export const getInstitutionMembers = (
    institutionId: number
): Promise<DbUser[] | ApiResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<DbUser[]>(
        `/institution/${institutionId}/members`,
        'getDbUser'
    );
};

export const getInstitution = (
    institutionId: number
): Promise<Institution | ApiResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<Institution>(
        `/institution/${institutionId}`,
        'getDbUser'
    );
};
