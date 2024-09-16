import {
    ApiResponse,
    AppointmentTemplate,
    DbUser,
    GetMembersResponse,
    Institution,
} from '@cydoc-ai/types';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';
import { InstitutionConfig } from '@cydoc-ai/types/dist/institutions';
import { CognitoUser, getAuthToken } from 'auth/cognito';
import { hpiHeaders as knowledgeGraphAPI } from '@screens/EditNote/content/hpi/knowledgegraph/API';
import invariant from 'tiny-invariant';
import { deleteFromApi, getFromApi, postToApi, putToApi } from './api';
import { AppointmentTemplatePostBody } from '@cydoc-ai/types/dist/api';
import { API_URL } from './environment';
import { ProductType } from '@constants/FormPreferencesConstant';

export const getInstitutionMembers = (
    institutionId: string,
    cognitoUser: CognitoUser | null
): Promise<DbUser[] | ApiResponse> => {
    invariant(institutionId, '[getInstitutionMembers] missing institutionId');

    return getFromApi<DbUser[]>(
        `/institution/${institutionId}/clinicians`,
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

    const graphResponse = await knowledgeGraphAPI;
    const allDiseaseForms = Object.entries(graphResponse.data.parentNodes).map(
        ([key, value]) =>
            ({
                id: '',
                diseaseKey: Object.keys(value as object)?.[0],
                diseaseName: key,
                isDeleted: false,
            }) as DiseaseForm
    );

    const institution = (await getFromApi<Institution>(
        `/institution/${institutionId}/public`,
        'getInstitution',
        null // no authentication on get institution
    )) as Institution;
    const { intakeProductSettings, intakePinnedForms = [] } = institution;
    invariant(intakeProductSettings, 'Intake product settings is required');

    const config: InstitutionConfig = {
        id: intakeProductSettings.id,
        name: institution.name,
        institutionId: institution.id,
        showChiefComplaints: intakeProductSettings.showChiefComplaints,
        showDefaultForm: intakeProductSettings.showDefaultForms,
        product: institution.product as ProductType,
        diseaseForm: intakePinnedForms.map((item) => {
            const form = allDiseaseForms.find(
                (form) => form.diseaseKey === item.formCategory
            );
            return {
                id: item.id,
                diseaseKey: item.formCategory,
                diseaseName: form?.diseaseName || '',
                isDeleted: false,
            };
        }),
    };

    return {
        config,
    };
};

export const updateInstitutionConfig = async (
    updatedInstitutionConfig: InstitutionConfig,
    product: string,
    cognitoUser: CognitoUser | null
): Promise<{ status: string } | ApiResponse> => {
    const { showChiefComplaints, showDefaultForm, diseaseForm, institutionId } =
        updatedInstitutionConfig;

    const response = await putToApi<{ status: string } | ApiResponse>(
        `/institution/${institutionId}`,
        'updateInstitutionConfig',
        {
            product: product,
            intakeProductSettings: {
                showChiefComplaints: showChiefComplaints,
                showDefaultForms: showDefaultForm,
            },
            intakePinnedForms: diseaseForm
                .filter((form) => !form.isDeleted)
                .map((item) => {
                    return {
                        formCategory: item.diseaseKey,
                    };
                }),
        },
        cognitoUser
    );
    return response;
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

export const uploadInstitutionLogo = async (
    institutionId: string,
    form: FormData,
    cognitoUser: CognitoUser
) => {
    const token = await getAuthToken(cognitoUser);
    const resp = await fetch(`${API_URL}/institution/${institutionId}/logo`, {
        method: 'POST',
        headers: {
            Authorization: token || '',
        },
        body: form,
    });
    return resp.json();
};
