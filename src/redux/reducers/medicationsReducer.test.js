import {
    medicationsReducer,
    initialMedicationsState,
} from './medicationsReducer';
import { MEDICATIONS_ACTION } from 'redux/actions/actionTypes';
import { YesNoResponse } from 'constants/enums';

const initialMedications = {
    uuid1: {
        drugName: '',
        startYear: -1,
        isCurrentlyTaking: YesNoResponse.None,
        endYear: -1,
        schedule: '',
        dose: '',
        reasonForTaking: '',
        sideEffects: [],
        comments: '',
    },
};

describe('medications reducers', () => {
    it('returns the initial state', () => {
        expect(medicationsReducer(undefined, {})).toEqual(
            initialMedicationsState
        );
    });
    it('updates drug name', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_DRUG_NAME,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newDrugName: 'newDrugName',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates start year', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_START_YEAR,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newStartYear: 2019,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates currently taking', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_CURRENTLY_TAKING,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    optionSelected: YesNoResponse.No,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates end year', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_END_YEAR,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newEndYear: 2020,
                },
            })
        ).toMatchSnapshot();
    });
    it('updates schedule', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_SCHEDULE,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newSchedule: 'newSchedule',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates dose', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_DOSE,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newDose: 'newDose',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates reason for taking', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_REASON_FOR_TAKING,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newReasonForTaking: 'newReasonForTaking',
                },
            })
        ).toMatchSnapshot();
    });
    it('updates side effects', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_SIDE_EFFECTS,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newSideEffects: ['newSideEffect'],
                },
            })
        ).toMatchSnapshot();
    });
    it('updates comments', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.UPDATE_COMMENTS,
                payload: {
                    index: Object.keys(initialMedications)[0],
                    newComments: 'newComments',
                },
            })
        ).toMatchSnapshot();
    });
    it('deletes medication entry', () => {
        expect(
            medicationsReducer(initialMedications, {
                type: MEDICATIONS_ACTION.DELETE_MEDICATION,
                payload: {
                    index: 'uuid1',
                },
            })
        ).toMatchSnapshot();
    });
    it('creates new entry with given condition id', () => {
        const nextState = medicationsReducer(initialMedications, {
            type: MEDICATIONS_ACTION.ADD_MEDS_POP_OPTION,
            payload: {
                medIndex: 'foo',
                medName: 'foo',
            },
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty('foo');
        expect(nextState['foo'].drugName).toEqual('foo');
    });
});
