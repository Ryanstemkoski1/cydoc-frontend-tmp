import { WhenResponse, YesNoUncertainResponse } from '@constants/enums';
import { PLAN_ACTION } from './actionTypes';

interface AddConditionAction {
    type: PLAN_ACTION.ADD_CONDITION;
}

export function addCondition(): AddConditionAction {
    return {
        type: PLAN_ACTION.ADD_CONDITION,
    };
}

interface DeleteConditionAction {
    type: PLAN_ACTION.DELETE_CONDITION;
    payload: {
        conditionIndex: string;
    };
}

export function deleteCondition(conditionIndex: string): DeleteConditionAction {
    return {
        type: PLAN_ACTION.DELETE_CONDITION,
        payload: {
            conditionIndex,
        },
    };
}

interface UpdateConditionNameAction {
    type: PLAN_ACTION.UPDATE_CONDITION_NAME;
    payload: {
        conditionIndex: string;
        newName: string;
    };
}

export function updateConditionName(
    conditionIndex: string,
    newName: string
): UpdateConditionNameAction {
    return {
        type: PLAN_ACTION.UPDATE_CONDITION_NAME,
        payload: {
            conditionIndex,
            newName,
        },
    };
}

interface AddDifferentialDiagnosisAction {
    type: PLAN_ACTION.ADD_DIFFERENTIAL_DIAGNOSIS;
    payload: {
        conditionIndex: string;
    };
}

export function addDifferentialDiagnosis(
    conditionIndex: string
): AddDifferentialDiagnosisAction {
    return {
        type: PLAN_ACTION.ADD_DIFFERENTIAL_DIAGNOSIS,
        payload: {
            conditionIndex,
        },
    };
}

interface UpdateDifferentialDiagnosisCommentsAction {
    type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS;
    payload: {
        conditionIndex: string;
        diagnosisIndex: string;
        newComments: string;
    };
}

export function updateDifferentialDiagnosisComments(
    conditionIndex: string,
    diagnosisIndex: string,
    newComments: string
): UpdateDifferentialDiagnosisCommentsAction {
    return {
        type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS,
        payload: {
            conditionIndex,
            diagnosisIndex,
            newComments,
        },
    };
}

interface UpdateDifferentialDiagnosisAction {
    type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS;
    payload: {
        conditionIndex: string;
        diagnosisIndex: string;
        newDiagnosis: string | { diagnosis: string; code: string };
    };
}

export function updateDifferentialDiagnosis(
    conditionIndex: string,
    diagnosisIndex: string,
    newDiagnosis: string | { diagnosis: string; code: string }
): UpdateDifferentialDiagnosisAction {
    return {
        type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS,
        payload: {
            conditionIndex,
            diagnosisIndex,
            newDiagnosis,
        },
    };
}

interface DeleteDifferentialDiagnosisAction {
    type: PLAN_ACTION.DELETE_DIFFERENTIAL_DIAGNOSIS;
    payload: {
        conditionIndex: string;
        diagnosisIndex: string;
    };
}

export function deleteDifferentialDiagnosis(
    conditionIndex: string,
    diagnosisIndex: string
): DeleteDifferentialDiagnosisAction {
    return {
        type: PLAN_ACTION.DELETE_DIFFERENTIAL_DIAGNOSIS,
        payload: {
            conditionIndex,
            diagnosisIndex,
        },
    };
}

interface AddPrescriptionAction {
    type: PLAN_ACTION.ADD_PRESCRIPTION;
    payload: {
        conditionIndex: string;
    };
}

export function addPrescription(conditionIndex: string): AddPrescriptionAction {
    return {
        type: PLAN_ACTION.ADD_PRESCRIPTION,
        payload: {
            conditionIndex,
        },
    };
}

interface UpdatePrescriptionCommentsAction {
    type: PLAN_ACTION.UPDATE_PRESCRIPTION_COMMENTS;
    payload: {
        conditionIndex: string;
        prescriptionIndex: string;
        newComments: string;
    };
}

export function updatePrescriptionComments(
    conditionIndex: string,
    prescriptionIndex: string,
    newComments: string
): UpdatePrescriptionCommentsAction {
    return {
        type: PLAN_ACTION.UPDATE_PRESCRIPTION_COMMENTS,
        payload: {
            conditionIndex,
            prescriptionIndex,
            newComments,
        },
    };
}

interface UpdatePrescriptionDoseAction {
    type: PLAN_ACTION.UPDATE_PRESCRIPTION_DOSE;
    payload: {
        conditionIndex: string;
        prescriptionIndex: string;
        newDose: string;
    };
}

export function updatePrescriptionDose(
    conditionIndex: string,
    prescriptionIndex: string,
    newDose: string
): UpdatePrescriptionDoseAction {
    return {
        type: PLAN_ACTION.UPDATE_PRESCRIPTION_DOSE,
        payload: {
            conditionIndex,
            prescriptionIndex,
            newDose,
        },
    };
}

interface UpdatePrescriptionTypeAction {
    type: PLAN_ACTION.UPDATE_PRESCRIPTION_TYPE;
    payload: {
        conditionIndex: string;
        prescriptionIndex: string;
        newType: string;
    };
}

export function updatePrescriptionType(
    conditionIndex: string,
    prescriptionIndex: string,
    newType: string
): UpdatePrescriptionTypeAction {
    return {
        type: PLAN_ACTION.UPDATE_PRESCRIPTION_TYPE,
        payload: {
            conditionIndex,
            prescriptionIndex,
            newType,
        },
    };
}

interface UpdatePrescriptionSignatureAction {
    type: PLAN_ACTION.UPDATE_PRESCRIPTION_SIGNATURE;
    payload: {
        conditionIndex: string;
        prescriptionIndex: string;
        newSignature: string;
    };
}

export function updatePrescriptionSignature(
    conditionIndex: string,
    prescriptionIndex: string,
    newSignature: string
): UpdatePrescriptionSignatureAction {
    return {
        type: PLAN_ACTION.UPDATE_PRESCRIPTION_SIGNATURE,
        payload: {
            conditionIndex,
            prescriptionIndex,
            newSignature,
        },
    };
}

interface DeletePrescriptionAction {
    type: PLAN_ACTION.DELETE_PRESCRIPTION;
    payload: {
        conditionIndex: string;
        prescriptionIndex: string;
    };
}

export function deletePrescription(
    conditionIndex: string,
    prescriptionIndex: string
): DeletePrescriptionAction {
    return {
        type: PLAN_ACTION.DELETE_PRESCRIPTION,
        payload: {
            conditionIndex,
            prescriptionIndex,
        },
    };
}

interface AddProcedureOrServiceAction {
    type: PLAN_ACTION.ADD_PROCEDURE_OR_SERVICE;
    payload: {
        conditionIndex: string;
    };
}

export function addProcedureOrService(
    conditionIndex: string
): AddProcedureOrServiceAction {
    return {
        type: PLAN_ACTION.ADD_PROCEDURE_OR_SERVICE,
        payload: {
            conditionIndex,
        },
    };
}

interface UpdateProcedureOrServiceAction {
    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE;
    payload: {
        conditionIndex: string;
        procedureIndex: string;
        newProcedure: string;
    };
}

export function updateProcedureOrService(
    conditionIndex: string,
    procedureIndex: string,
    newProcedure: string
): UpdateProcedureOrServiceAction {
    return {
        type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE,
        payload: {
            conditionIndex,
            procedureIndex,
            newProcedure,
        },
    };
}

interface UpdateProcedureOrServiceComments {
    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_COMMENTS;
    payload: {
        conditionIndex: string;
        procedureIndex: string;
        newComments: string;
    };
}

export function updateProcedureOrServiceComments(
    conditionIndex: string,
    procedureIndex: string,
    newComments: string
): UpdateProcedureOrServiceComments {
    return {
        type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_COMMENTS,
        payload: {
            conditionIndex,
            procedureIndex,
            newComments,
        },
    };
}

interface UpdateProcedureOrServiceWhenAction {
    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_WHEN;
    payload: {
        conditionIndex: string;
        procedureIndex: string;
        newWhen: WhenResponse;
    };
}

export function updateProcedureOrServiceWhen(
    conditionIndex: string,
    procedureIndex: string,
    newWhen: WhenResponse
): UpdateProcedureOrServiceWhenAction {
    return {
        type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_WHEN,
        payload: {
            conditionIndex,
            procedureIndex,
            newWhen,
        },
    };
}

interface DeleteProcedureOrServiceAction {
    type: PLAN_ACTION.DELETE_PROCEDURE_OR_SERVICE;
    payload: {
        conditionIndex: string;
        procedureIndex: string;
    };
}

export function deleteProcedureOrService(
    conditionIndex: string,
    procedureIndex: string
): DeleteProcedureOrServiceAction {
    return {
        type: PLAN_ACTION.DELETE_PROCEDURE_OR_SERVICE,
        payload: {
            conditionIndex,
            procedureIndex,
        },
    };
}

interface AddReferralAction {
    type: PLAN_ACTION.ADD_REFERRAL;
    payload: {
        conditionIndex: string;
    };
}

export function addReferral(conditionIndex: string): AddReferralAction {
    return {
        type: PLAN_ACTION.ADD_REFERRAL,
        payload: {
            conditionIndex,
        },
    };
}

interface UpdateReferralDepartmentAction {
    type: PLAN_ACTION.UPDATE_REFERRAL_DEPARTMENT;
    payload: {
        conditionIndex: string;
        referralIndex: string;
        newDepartment: string;
    };
}

export function updateReferralDepartment(
    conditionIndex: string,
    referralIndex: string,
    newDepartment: string
): UpdateReferralDepartmentAction {
    return {
        type: PLAN_ACTION.UPDATE_REFERRAL_DEPARTMENT,
        payload: {
            conditionIndex,
            referralIndex,
            newDepartment,
        },
    };
}

interface UpdateReferralCommentsAction {
    type: PLAN_ACTION.UPDATE_REFERRAL_COMMENTS;
    payload: {
        conditionIndex: string;
        referralIndex: string;
        newComments: string;
    };
}

export function updateReferralComments(
    conditionIndex: string,
    referralIndex: string,
    newComments: string
): UpdateReferralCommentsAction {
    return {
        type: PLAN_ACTION.UPDATE_REFERRAL_COMMENTS,
        payload: {
            conditionIndex,
            referralIndex,
            newComments,
        },
    };
}

interface UpdateReferralWhenAction {
    type: PLAN_ACTION.UPDATE_REFERRAL_WHEN;
    payload: {
        conditionIndex: string;
        referralIndex: string;
        newWhen: WhenResponse;
    };
}

export function updateReferralWhen(
    conditionIndex: string,
    referralIndex: string,
    newWhen: WhenResponse
): UpdateReferralWhenAction {
    return {
        type: PLAN_ACTION.UPDATE_REFERRAL_WHEN,
        payload: {
            conditionIndex,
            referralIndex,
            newWhen,
        },
    };
}

interface DeleteReferralAction {
    type: PLAN_ACTION.DELETE_REFERRAL;
    payload: {
        conditionIndex: string;
        referralIndex: string;
    };
}

export function deleteReferral(
    conditionIndex: string,
    referralIndex: string
): DeleteReferralAction {
    return {
        type: PLAN_ACTION.DELETE_REFERRAL,
        payload: {
            conditionIndex,
            referralIndex,
        },
    };
}

interface UpdateAdmitToHospitalAction {
    type: PLAN_ACTION.UPDATE_ADMIT_TO_HOSPITAL;
    payload: {
        newAdmitToHospital: YesNoUncertainResponse;
    };
}

export function updateAdmitToHospital(
    newAdmitToHospital: YesNoUncertainResponse
): UpdateAdmitToHospitalAction {
    return {
        type: PLAN_ACTION.UPDATE_ADMIT_TO_HOSPITAL,
        payload: {
            newAdmitToHospital,
        },
    };
}

interface UpdateEmergencyAction {
    type: PLAN_ACTION.UPDATE_EMERGENCY;
    payload: {
        newEmergency: YesNoUncertainResponse;
    };
}

export function updateEmergency(
    newEmergency: YesNoUncertainResponse
): UpdateEmergencyAction {
    return {
        type: PLAN_ACTION.UPDATE_EMERGENCY,
        payload: {
            newEmergency,
        },
    };
}

interface UpdateSicknessLevelAction {
    type: PLAN_ACTION.UPDATE_SICKNESS_LEVEL;
    payload: {
        newSicknessLevel: number;
    };
}

export function updateSickness(
    newSicknessLevel: number
): UpdateSicknessLevelAction {
    return {
        type: PLAN_ACTION.UPDATE_SICKNESS_LEVEL,
        payload: {
            newSicknessLevel,
        },
    };
}

export type PlanActionTypes =
    | AddConditionAction
    | DeleteConditionAction
    | UpdateConditionNameAction
    | AddDifferentialDiagnosisAction
    | UpdateDifferentialDiagnosisCommentsAction
    | UpdateDifferentialDiagnosisAction
    | DeleteDifferentialDiagnosisAction
    | AddPrescriptionAction
    | UpdatePrescriptionCommentsAction
    | UpdatePrescriptionDoseAction
    | UpdatePrescriptionTypeAction
    | UpdatePrescriptionSignatureAction
    | DeletePrescriptionAction
    | AddProcedureOrServiceAction
    | UpdateProcedureOrServiceAction
    | UpdateProcedureOrServiceComments
    | UpdateProcedureOrServiceWhenAction
    | DeleteProcedureOrServiceAction
    | AddReferralAction
    | UpdateReferralDepartmentAction
    | UpdateReferralCommentsAction
    | UpdateReferralWhenAction
    | DeleteReferralAction
    | UpdateAdmitToHospitalAction
    | UpdateEmergencyAction
    | UpdateSicknessLevelAction;
