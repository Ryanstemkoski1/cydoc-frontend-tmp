import { WhenResponse, YesNoUncertainResponse } from 'constants/enums';
import { PLAN_ACTION } from 'redux/actions/actionTypes';
import { PlanActionTypes } from 'redux/actions/planActions';
import { v4 } from 'uuid';

export interface PlanState {
    conditions: {
        [id: string]: PlanCondition;
    };
    survey: PlanSurvey;
}

export interface PlanSurvey {
    admitToHospital: YesNoUncertainResponse;
    emergency: YesNoUncertainResponse;
    sicknessLevel: number;
}

export interface PlanCondition {
    name: string;
    differentialDiagnoses: {
        [id: string]: PlanDiagnosis;
    };
    prescriptions: {
        [id: string]: PlanPrescription;
    };
    proceduresAndServices: {
        [id: string]: PlanProceduresAndServices;
    };
    referrals: {
        [id: string]: PlanReferrals;
    };
}

export interface PlanDiagnosis {
    comments: string;
    diagnosis: string;
    code: string;
}

export interface PlanPrescription {
    comments: string;
    dose: string;
    type: string;
    signature: string;
}

export interface PlanProceduresAndServices {
    comments: string;
    procedure: string;
    when: WhenResponse;
}

export interface PlanReferrals {
    comments: string;
    department: string;
    when: WhenResponse;
}

export const initialPlanState: PlanState = {
    conditions: {
        [v4()]: {
            name: '',
            differentialDiagnoses: {
                [v4()]: {
                    comments: '',
                    diagnosis: '',
                    code: '',
                },
            },
            prescriptions: {
                [v4()]: {
                    comments: '',
                    dose: '',
                    type: '',
                    signature: '',
                },
            },
            proceduresAndServices: {
                [v4()]: {
                    comments: '',
                    procedure: '',
                    when: WhenResponse.None,
                },
            },
            referrals: {
                [v4()]: {
                    comments: '',
                    department: '',
                    when: WhenResponse.None,
                },
            },
        },
    },
    survey: {
        admitToHospital: YesNoUncertainResponse.None,
        emergency: YesNoUncertainResponse.None,
        sicknessLevel: 0,
    },
};

export function planReducer(
    state = initialPlanState,
    action: PlanActionTypes
): PlanState {
    switch (action.type) {
        case PLAN_ACTION.ADD_CONDITION: {
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [v4()]: {
                        name: '',
                        differentialDiagnoses: {
                            [v4()]: {
                                comments: '',
                                diagnosis: '',
                                code: '',
                            },
                        },
                        prescriptions: {
                            [v4()]: {
                                comments: '',
                                dose: '',
                                type: '',
                                signature: '',
                            },
                        },
                        proceduresAndServices: {
                            [v4()]: {
                                comments: '',
                                procedure: '',
                                when: WhenResponse.None,
                            },
                        },
                        referrals: {
                            [v4()]: {
                                comments: '',
                                department: '',
                                when: WhenResponse.None,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.DELETE_CONDITION: {
            const { conditionIndex } = action.payload;
            const { [conditionIndex]: deleted, ...newConditions } =
                state.conditions;
            return {
                ...state,
                conditions: newConditions,
            };
        }
        case PLAN_ACTION.UPDATE_CONDITION_NAME: {
            const { conditionIndex, newName } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        name: newName,
                    },
                },
            };
        }
        case PLAN_ACTION.ADD_DIFFERENTIAL_DIAGNOSIS: {
            const { conditionIndex } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        differentialDiagnoses: {
                            ...state.conditions[conditionIndex]
                                .differentialDiagnoses,
                            [v4()]: {
                                comments: '',
                                diagnosis: '',
                                code: '',
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS: {
            const { conditionIndex, diagnosisIndex, newComments } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        differentialDiagnoses: {
                            ...state.conditions[conditionIndex]
                                .differentialDiagnoses,
                            [diagnosisIndex]: {
                                ...state.conditions[conditionIndex]
                                    .differentialDiagnoses[diagnosisIndex],
                                comments: newComments,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS: {
            const { conditionIndex, diagnosisIndex, newDiagnosis } =
                action.payload;
            // newDiagnosis can either be a string or object
            // old code system (used in MedicationsPanel) only sends string, icd-10 system sends object
            const diagnosis =
                typeof newDiagnosis == 'string'
                    ? newDiagnosis
                    : newDiagnosis.diagnosis;
            const code =
                typeof newDiagnosis == 'string' ? '' : newDiagnosis.code;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        differentialDiagnoses: {
                            ...state.conditions[conditionIndex]
                                .differentialDiagnoses,
                            [diagnosisIndex]: {
                                ...state.conditions[conditionIndex]
                                    .differentialDiagnoses[diagnosisIndex],
                                diagnosis: diagnosis,
                                code: code,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.DELETE_DIFFERENTIAL_DIAGNOSIS: {
            const { conditionIndex, diagnosisIndex } = action.payload;
            const { [diagnosisIndex]: deleted, ...newDiagnoses } =
                state.conditions[conditionIndex].differentialDiagnoses;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        differentialDiagnoses: newDiagnoses,
                    },
                },
            };
        }
        case PLAN_ACTION.ADD_PRESCRIPTION: {
            const { conditionIndex } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: {
                            ...state.conditions[conditionIndex].prescriptions,
                            [v4()]: {
                                comments: '',
                                dose: '',
                                type: '',
                                signature: '',
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PRESCRIPTION_COMMENTS: {
            const { conditionIndex, prescriptionIndex, newComments } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: {
                            ...state.conditions[conditionIndex].prescriptions,
                            [prescriptionIndex]: {
                                ...state.conditions[conditionIndex]
                                    .prescriptions[prescriptionIndex],
                                comments: newComments,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PRESCRIPTION_DOSE: {
            const { conditionIndex, prescriptionIndex, newDose } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: {
                            ...state.conditions[conditionIndex].prescriptions,
                            [prescriptionIndex]: {
                                ...state.conditions[conditionIndex]
                                    .prescriptions[prescriptionIndex],
                                dose: newDose,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PRESCRIPTION_TYPE: {
            const { conditionIndex, prescriptionIndex, newType } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: {
                            ...state.conditions[conditionIndex].prescriptions,
                            [prescriptionIndex]: {
                                ...state.conditions[conditionIndex]
                                    .prescriptions[prescriptionIndex],
                                type: newType,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PRESCRIPTION_SIGNATURE: {
            const { conditionIndex, prescriptionIndex, newSignature } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: {
                            ...state.conditions[conditionIndex].prescriptions,
                            [prescriptionIndex]: {
                                ...state.conditions[conditionIndex]
                                    .prescriptions[prescriptionIndex],
                                signature: newSignature,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.DELETE_PRESCRIPTION: {
            const { conditionIndex, prescriptionIndex } = action.payload;
            const { [prescriptionIndex]: deleted, ...newPrescriptions } =
                state.conditions[conditionIndex].prescriptions;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        prescriptions: newPrescriptions,
                    },
                },
            };
        }
        case PLAN_ACTION.ADD_PROCEDURE_OR_SERVICE: {
            const { conditionIndex } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        proceduresAndServices: {
                            ...state.conditions[conditionIndex]
                                .proceduresAndServices,
                            [v4()]: {
                                comments: '',
                                procedure: '',
                                when: WhenResponse.None,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE: {
            const { conditionIndex, procedureIndex, newProcedure } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        proceduresAndServices: {
                            ...state.conditions[conditionIndex]
                                .proceduresAndServices,
                            [procedureIndex]: {
                                ...state.conditions[conditionIndex]
                                    .proceduresAndServices[procedureIndex],
                                procedure: newProcedure,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_COMMENTS: {
            const { conditionIndex, procedureIndex, newComments } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        proceduresAndServices: {
                            ...state.conditions[conditionIndex]
                                .proceduresAndServices,
                            [procedureIndex]: {
                                ...state.conditions[conditionIndex]
                                    .proceduresAndServices[procedureIndex],
                                comments: newComments,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_WHEN: {
            const { conditionIndex, procedureIndex, newWhen } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        proceduresAndServices: {
                            ...state.conditions[conditionIndex]
                                .proceduresAndServices,
                            [procedureIndex]: {
                                ...state.conditions[conditionIndex]
                                    .proceduresAndServices[procedureIndex],
                                when: newWhen,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.DELETE_PROCEDURE_OR_SERVICE: {
            const { conditionIndex, procedureIndex } = action.payload;
            const { [procedureIndex]: deleted, ...newProcedures } =
                state.conditions[conditionIndex].proceduresAndServices;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        proceduresAndServices: newProcedures,
                    },
                },
            };
        }
        case PLAN_ACTION.ADD_REFERRAL: {
            const { conditionIndex } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        referrals: {
                            ...state.conditions[conditionIndex].referrals,
                            [v4()]: {
                                comments: '',
                                department: '',
                                when: WhenResponse.None,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_REFERRAL_DEPARTMENT: {
            const { conditionIndex, referralIndex, newDepartment } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        referrals: {
                            ...state.conditions[conditionIndex].referrals,
                            [referralIndex]: {
                                ...state.conditions[conditionIndex].referrals[
                                    referralIndex
                                ],
                                department: newDepartment,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_REFERRAL_COMMENTS: {
            const { conditionIndex, referralIndex, newComments } =
                action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        referrals: {
                            ...state.conditions[conditionIndex].referrals,
                            [referralIndex]: {
                                ...state.conditions[conditionIndex].referrals[
                                    referralIndex
                                ],
                                comments: newComments,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_REFERRAL_WHEN: {
            const { conditionIndex, referralIndex, newWhen } = action.payload;
            return {
                ...state,
                conditions: {
                    ...state.conditions,
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        referrals: {
                            ...state.conditions[conditionIndex].referrals,
                            [referralIndex]: {
                                ...state.conditions[conditionIndex].referrals[
                                    referralIndex
                                ],
                                when: newWhen,
                            },
                        },
                    },
                },
            };
        }
        case PLAN_ACTION.DELETE_REFERRAL: {
            const { conditionIndex, referralIndex } = action.payload;
            const { [referralIndex]: deleted, ...newReferrals } =
                state.conditions[conditionIndex].referrals;
            return {
                ...state,
                conditions: {
                    [conditionIndex]: {
                        ...state.conditions[conditionIndex],
                        referrals: newReferrals,
                    },
                },
            };
        }
        case PLAN_ACTION.UPDATE_ADMIT_TO_HOSPITAL: {
            const { newAdmitToHospital } = action.payload;
            return {
                ...state,
                survey: {
                    ...state.survey,
                    admitToHospital: newAdmitToHospital,
                },
            };
        }
        case PLAN_ACTION.UPDATE_EMERGENCY: {
            const { newEmergency } = action.payload;
            return {
                ...state,
                survey: {
                    ...state.survey,
                    emergency: newEmergency,
                },
            };
        }
        case PLAN_ACTION.UPDATE_SICKNESS_LEVEL: {
            const { newSicknessLevel } = action.payload;
            return {
                ...state,
                survey: {
                    ...state.survey,
                    sicknessLevel: newSicknessLevel,
                },
            };
        }
        default: {
            return state;
        }
    }
}
