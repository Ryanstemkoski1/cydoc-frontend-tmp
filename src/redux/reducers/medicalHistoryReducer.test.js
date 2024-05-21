import { createStore } from 'redux';
import {
    initialMedicalHistoryState,
    medicalHistoryReducer,
} from './medicalHistoryReducer';
import {
    addPmhPopOptions,
    deleteCondition,
    toggleOption,
    updateComments,
    updateConditionName,
    updateConditionResolved,
    updateEndYear,
    updateStartYear,
} from '../actions/medicalHistoryActions';
import { YesNoResponse } from '../../constants/enums';

describe('medical history reducer', () => {
    let store;

    beforeEach(() => {
        store = createStore(medicalHistoryReducer, initialMedicalHistoryState);
    });

    describe('initial state', () => {
        it('returns the initial state correctly', () => {
            expect(store.getState()).toEqual(initialMedicalHistoryState);
        });
    });

    describe('actions', () => {
        const conditionIndex = '0';
        const conditionName = 'test';

        beforeEach(() => {
            store.dispatch(addPmhPopOptions(conditionIndex, conditionName));
        });

        it('adds procedure correctly', () => {
            expect(store.getState()).toEqual({
                [conditionIndex]: {
                    condition: conditionName,
                    hasBeenAfflicted: '',
                    startYear: -1,
                    hasConditionResolved: '',
                    endYear: -1,
                    comments: '',
                },
            });
        });

        it('updates condition name correctly', () => {
            const conditionName = 'newName';

            store.dispatch(updateConditionName(conditionIndex, conditionName));
            expect(store.getState()[conditionIndex]['condition']).toEqual(
                conditionName
            );
        });

        it('toggles hasBeenAfflicted correctly', () => {
            const wasAfflicted = YesNoResponse.Yes;

            store.dispatch(toggleOption(conditionIndex, wasAfflicted));
            expect(
                store.getState()[conditionIndex]['hasBeenAfflicted']
            ).toEqual(wasAfflicted);
        });

        it('updates start year correctly', () => {
            const startYear = 2000;

            store.dispatch(updateStartYear(conditionIndex, startYear));
            expect(store.getState()[conditionIndex]['startYear']).toEqual(
                startYear
            );
        });

        it('updates hasConditionResolved correctly', () => {
            const resolved = YesNoResponse.Yes;

            store.dispatch(updateConditionResolved(conditionIndex, resolved));
            expect(
                store.getState()[conditionIndex]['hasConditionResolved']
            ).toEqual(resolved);
        });

        it('updates end year correctly', () => {
            const endYear = 2020;

            store.dispatch(updateEndYear(conditionIndex, endYear));
            expect(store.getState()[conditionIndex]['endYear']).toEqual(
                endYear
            );
        });

        it('updates comments correctly', () => {
            const newComments = 'comments';

            store.dispatch(updateComments(conditionIndex, newComments));
            expect(store.getState()[conditionIndex]['comments']).toEqual(
                newComments
            );
        });

        it('deletes condition correctly', () => {
            store.dispatch(deleteCondition(conditionIndex));
            expect(store.getState()).toEqual(initialMedicalHistoryState);
        });
    });
});
