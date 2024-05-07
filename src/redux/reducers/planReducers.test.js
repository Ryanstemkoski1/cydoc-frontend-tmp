import { planReducer, initialPlanState } from './planReducer';
import { PLAN_ACTION } from '@redux/actions/actionTypes';
import { WhenResponse, YesNoUncertainResponse } from 'constants/enums';
import {
    initialPlan,
    conditionId,
    categoryId,
} from 'pages/EditNote/content/discussionplan/util';

describe('plan reducers', () => {
    describe('general condition reducers', () => {
        it('returns the initial state', () => {
            expect(planReducer(undefined, {})).toEqual(initialPlanState);
        });

        it('adds new condition', () => {
            const newConditions = planReducer(initialPlan, {
                type: PLAN_ACTION.ADD_CONDITION,
            }).conditions;

            expect(Object.keys(newConditions).length).toEqual(2);
            expect(conditionId in newConditions).toBeTruthy();
        });

        it('deletes initial condition', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.DELETE_CONDITION,
                    payload: { conditionIndex: conditionId },
                })
            ).toMatchSnapshot();
        });

        it('updates initial condition name', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_CONDITION_NAME,
                    payload: {
                        conditionIndex: conditionId,
                        newName: 'foo',
                    },
                })
            ).toMatchSnapshot();
        });
    });

    describe('differential diagnoses', () => {
        let payload = {};
        beforeEach(() => {
            payload = {
                conditionIndex: conditionId,
                diagnosisIndex: categoryId,
            };
        });

        it('adds new differential diagnosis', () => {
            const newDifferentialDiagnoses = planReducer(initialPlan, {
                type: PLAN_ACTION.ADD_DIFFERENTIAL_DIAGNOSIS,
                payload,
            }).conditions[conditionId].differentialDiagnoses;

            expect(Object.keys(newDifferentialDiagnoses).length).toEqual(2);
            expect(categoryId in newDifferentialDiagnoses).toBeTruthy();
        });

        it('updates diagnosis', () => {
            payload.newDiagnosis = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates comments', () => {
            payload.newComments = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('deletes differential diagnoses', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.DELETE_DIFFERENTIAL_DIAGNOSIS,
                    payload,
                })
            ).toMatchSnapshot();
        });
    });

    describe('prescriptions', () => {
        let payload = {};
        beforeEach(() => {
            payload = {
                conditionIndex: conditionId,
                prescriptionIndex: categoryId,
            };
        });

        it('adds new prescription', () => {
            const newPrescriptions = planReducer(initialPlan, {
                type: PLAN_ACTION.ADD_PRESCRIPTION,
                payload,
            }).conditions[conditionId].prescriptions;

            expect(Object.keys(newPrescriptions).length).toEqual(2);
            expect(categoryId in newPrescriptions).toBeTruthy();
        });

        it('updates prescription comments', () => {
            payload.newComments = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PRESCRIPTION_COMMENTS,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates prescription dose', () => {
            payload.newDose = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PRESCRIPTION_DOSE,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates prescription type', () => {
            payload.newType = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PRESCRIPTION_TYPE,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates prescription signature', () => {
            payload.newSignature = 'foo';

            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PRESCRIPTION_SIGNATURE,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('deletes prescription', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.DELETE_PRESCRIPTION,
                    payload,
                })
            ).toMatchSnapshot();
        });
    });

    describe('procedure or service', () => {
        let payload = {};
        beforeEach(() => {
            payload = {
                conditionIndex: conditionId,
                procedureIndex: categoryId,
            };
        });

        it('adds new procedure or service', () => {
            const newProcedures = planReducer(initialPlan, {
                type: PLAN_ACTION.ADD_PROCEDURE_OR_SERVICE,
                payload,
            }).conditions[conditionId].proceduresAndServices;

            expect(Object.keys(newProcedures).length).toEqual(2);
            expect(categoryId in newProcedures).toBeTruthy();
        });

        it('updates procedure', () => {
            payload.newProcedure = 'foo';
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates comments', () => {
            payload.newComments = 'foo';
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_COMMENTS,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates when', () => {
            payload.newWhen = WhenResponse.ThisMonth;
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_PROCEDURE_OR_SERVICE_WHEN,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('deletes procedure or services', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.DELETE_PROCEDURE_OR_SERVICE,
                    payload,
                })
            ).toMatchSnapshot();
        });
    });

    describe('referrals', () => {
        let payload = {};
        beforeEach(() => {
            payload = {
                conditionIndex: conditionId,
                referralIndex: categoryId,
            };
        });

        it('adds new procedure or service', () => {
            const newReferrals = planReducer(initialPlan, {
                type: PLAN_ACTION.ADD_REFERRAL,
                payload,
            }).conditions[conditionId].referrals;

            expect(Object.keys(newReferrals).length).toEqual(2);
            expect(categoryId in newReferrals).toBeTruthy();
        });

        it('updates department', () => {
            payload.newDepartment = 'foo';
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_REFERRAL_DEPARTMENT,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates comments', () => {
            payload.newComments = 'foo';
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_REFERRAL_COMMENTS,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('updates when', () => {
            payload.newWhen = WhenResponse.ThisMonth;
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_REFERRAL_WHEN,
                    payload,
                })
            ).toMatchSnapshot();
        });

        it('deletes referral', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.DELETE_REFERRAL,
                    payload,
                })
            ).toMatchSnapshot();
        });
    });

    describe('survey reducers', () => {
        it('updates admit to hospital', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_ADMIT_TO_HOSPITAL,
                    payload: {
                        newAdmitToHospital: YesNoUncertainResponse.Yes,
                    },
                })
            ).toMatchSnapshot();
        });

        it('updates emergency', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_EMERGENCY,
                    payload: {
                        newEmergency: YesNoUncertainResponse.No,
                    },
                })
            ).toMatchSnapshot();
        });

        it('updates sickness', () => {
            expect(
                planReducer(initialPlan, {
                    type: PLAN_ACTION.UPDATE_SICKNESS_LEVEL,
                    payload: {
                        newSicknessLevel: 5,
                    },
                })
            ).toMatchSnapshot();
        });
    });
});
