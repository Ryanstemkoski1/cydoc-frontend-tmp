import {
    ApiResponse,
    AppointmentTemplate,
    AppointmentTemplateStep,
    GetMembersResponse,
    Institution,
} from '@cydoc-ai/types';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import { CognitoUser } from 'auth/cognito';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import invariant from 'tiny-invariant';
import { deleteFromApi, getFromApi, postToApi, putToApi } from './api';
import { AppointmentTemplatePostBody } from '@cydoc-ai/types/dist/api';

export const getInstitutionMembers = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<GetMembersResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<GetMembersResponse>(
        `/institution/${institutionId}/members`,
        'getInstitutionMembers',
        cognitoUser
    );
};

export const getInstitution = (institutionId: string): Promise<any> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi(
        `/institution/${institutionId}/public`,
        'getInstitution',
        null // no authentication on get institution
    );
};

export async function validateDiseaseForm(
    config: InstitutionConfig
): Promise<boolean> {
    const responseData = (await knowledgeGraphAPI).data;
    const knowledgegraphDiseaseForm = Object.entries(
        responseData.parentNodes
    ).map(
        ([key, value]) =>
            ({
                diseaseKey: Object.keys(value as object)?.[0],
                diseaseName: key,
            }) as DiseaseForm
    );
    const { diseaseForm } = config;

    const result = diseaseForm.every((item) =>
        knowledgegraphDiseaseForm.find(
            (kgItem) =>
                kgItem.diseaseKey === item.diseaseKey &&
                kgItem.diseaseName === item.diseaseName
        )
    );

    return result;
}

export interface InstitutionConfigResponse {
    config: InstitutionConfig;
}

export const getInstitutionConfig = async (
    institutionId: string
): Promise<InstitutionConfigResponse | ApiResponse> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    return getFromApi<InstitutionConfigResponse>(
        `/institution-config/${institutionId}`,
        'getInstitutionConfig',
        null // no authentication on get institution
    );
};

export const updateInstitutionConfig = async (
    updatedInstitutionConfig: InstitutionConfig,
    cognitoUser: CognitoUser | null
): Promise<InstitutionConfigResponse | ApiResponse> => {
    const { showChiefComplaints, showDefaultForm, diseaseForm, institutionId } =
        updatedInstitutionConfig;

    return postToApi<InstitutionConfigResponse>(
        `/institution-config/${institutionId}`,
        'updateInstitutionConfig',
        {
            showChiefComplaints,
            showDefaultForm,
            diseaseForm,
        },
        cognitoUser
    );
};

export const getHpiQrCode = async (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<string> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const response = await getFromApi<{ data: { link: string | null } }>(
        `/institution/${institutionId}/hpi-qr`,
        'getInstitution',
        cognitoUser
    );

    // TODO: add christine's endpoints to shared types library
    // @ts-expect-error we need to add christine's endpoint types to shared lib
    return response?.data?.link;
};

export const getInstitutionAppointmentTemplates = async (
    institutionId: string,
    cognitoUser: CognitoUser
): Promise<AppointmentTemplate[]> => {
    invariant(institutionId, '[getInstitution] missing institutionId');

    const resp = await getFromApi<AppointmentTemplate[]>(
        `/institution/${institutionId}/templates`,
        'getInstitutionAppointmentTemplates',
        cognitoUser
    );

    return resp as AppointmentTemplate[];
};

export const postInstitutionAppointmentTemplate = async (
    payload: AppointmentTemplatePostBody,
    institutionId: string,
    cognitoUser: CognitoUser
) => {
    const resp = await postToApi<AppointmentTemplate>(
        `/institution/${institutionId}/templates`,
        'postInstitutionAppointmentTemplate',
        payload,
        cognitoUser
    );
    return resp;
};

export const updateInstitutionAppointmentTemplate = async (
    payload: AppointmentTemplatePostBody,
    institutionId: string,
    templateId: string,
    cognitoUser: CognitoUser
) => {
    const resp = await putToApi<AppointmentTemplate>(
        `/institution/${institutionId}/templates/${templateId}`,
        'updateInstitutionAppointmentTemplate',
        payload,
        cognitoUser
    );
    return resp;
};

export const deleteInstitutionAppointmentTemplate = async (
    institutionId: string,
    templateId: string,
    cognitoUser: CognitoUser
) => {
    const resp = await deleteFromApi<AppointmentTemplate>(
        `/institution/${institutionId}/templates/${templateId}`,
        'deleteInstitutionAppointmentTemplate',
        cognitoUser
    );
    return resp;
};
