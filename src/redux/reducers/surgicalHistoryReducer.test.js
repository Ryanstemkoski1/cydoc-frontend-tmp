import { createStore } from 'redux';
import {
    surgicalHistoryReducer,
    initialSurgicalHistoryState,
} from './surgicalHistoryReducer';
import {
    addPshPopOptions,
    deleteProcedure,
    toggleHasSurgicalHistory,
    toggleOption,
    updateComments,
    updateProcedure,
    updateYear,
} from '@redux/actions/surgicalHistoryActions';
import { YesNoResponse } from 'constants/enums';

describe('surgical history reducers', () => {
    let store;

    beforeEach(() => {
        store = createStore(
            surgicalHistoryReducer,
            initialSurgicalHistoryState
        );
    });

    describe('initial state', () => {
        it('returns the initial state correctly', () => {
            expect(store.getState()).toEqual(initialSurgicalHistoryState);
        });
    });

    describe('actions', () => {
        const conditionIndex = '0';
        const conditionName = 'test';

        beforeEach(() => {
            store.dispatch(toggleHasSurgicalHistory(true));
            store.dispatch(addPshPopOptions(conditionIndex, conditionName));
        });

        it('sets hasSurgicalHistory correctly', () => {
            store.dispatch(toggleHasSurgicalHistory(false));
            expect(store.getState()['hasSurgicalHistory']).toEqual(false);
        });

        it('adds procedure correctly', () => {
            expect(store.getState()).toEqual({
                hasSurgicalHistory: true,
                elements: {
                    [conditionIndex]: {
                        comments: '',
                        hasHadSurgery: '',
                        procedure: conditionName,
                        year: -1,
                    },
                },
            });
        });

        it('updates procedure name correctly', () => {
            const proceduceName = 'newName';

            store.dispatch(updateProcedure(conditionIndex, proceduceName));
            expect(
                store.getState()['elements'][conditionIndex]['procedure']
            ).toEqual(proceduceName);
        });

        it('toggles YesNo response correctly', () => {
            const hadProcedure = YesNoResponse.Yes;

            store.dispatch(toggleOption(conditionIndex, hadProcedure));
            expect(
                store.getState()['elements'][conditionIndex]['hasHadSurgery']
            ).toEqual(hadProcedure);
        });

        it('updates procedure year correctly', () => {
            const procedureYear = 2000;

            store.dispatch(updateYear(conditionIndex, procedureYear));
            expect(
                store.getState()['elements'][conditionIndex]['year']
            ).toEqual(procedureYear);
        });

        it('updates procedure comments correctly', () => {
            const procedureComment = 'comment';

            store.dispatch(updateComments(conditionIndex, procedureComment));
            expect(
                store.getState()['elements'][conditionIndex]['comments']
            ).toEqual(procedureComment);
        });

        it('deletes procedure correctly', () => {
            store.dispatch(deleteProcedure(conditionIndex));
            store.dispatch(toggleHasSurgicalHistory(null));

            const expectedState = {
                hasSurgicalHistory: null,
                elements: {},
            };

            expect(store.getState()).toStrictEqual(expectedState);
        });
    });
});
