import {
    flattenConditionCategory,
    // selectPlanCondition,
} from '../planSelectors';
// import {
//     initialPlan,
//     conditionId,
// } from 'screens/EditNote/content/discussionplan/util';
// import { initialPlanState } from '../../reducers/planReducer';

describe('plan selectors', () => {
    it('flattenConditionCategory includes id along with original keys', () => {
        const diagnosis = {
            diagnosis: 'foo',
            comments: 'bar',
        };
        const id = '000';

        expect(flattenConditionCategory([id, diagnosis])).toEqual({
            id,
            ...diagnosis,
        });
    });

    // // TODO: Fix below tests
    // it('selectPlanCondition correctly flattens all objects', () => {
    //     const state = { plan: initialPlan };
    //     expect(selectPlanCondition(state, conditionId)).toMatchSnapshot();
    // });

    // it('selectPlanCondition uses values from initialPlan if id is invalid', () => {
    //     const id = Object.keys(initialPlanState.conditions)[0];
    //     const state = { plan: initialPlanState };
    //     const invalidId = 'FAKEEE ID';

    //     const initialCondition = initialPlanState.conditions[id];
    //     const diagnosisId = Object.keys(
    //         initialCondition.differentialDiagnoses
    //     )[0];
    //     const prescriptionId = Object.keys(initialCondition.prescriptions)[0];
    //     const procedureId = Object.keys(
    //         initialCondition.proceduresAndServices
    //     )[0];
    //     const referralId = Object.keys(initialCondition.referrals)[0];

    //     // everything but the id should come from the initialPlanState
    //     expect(selectPlanCondition(state, invalidId)).toEqual({
    //         ...initialCondition,
    //         id: invalidId,
    //         differentialDiagnoses: [
    //             {
    //                 id: diagnosisId,
    //                 ...initialCondition.differentialDiagnoses[diagnosisId],
    //             },
    //         ],
    //         prescriptions: [
    //             {
    //                 id: prescriptionId,
    //                 ...initialCondition.prescriptions[prescriptionId],
    //             },
    //         ],
    //         proceduresAndServices: [
    //             {
    //                 id: procedureId,
    //                 ...initialCondition.proceduresAndServices[procedureId],
    //             },
    //         ],
    //         referrals: [
    //             { id: referralId, ...initialCondition.referrals[referralId] },
    //         ],
    //     });
    // });
});
