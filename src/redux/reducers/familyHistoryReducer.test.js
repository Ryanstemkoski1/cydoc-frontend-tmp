import { createStore } from 'redux';
import {
    familyHistoryReducer,
    initialFamilyHistoryState,
} from './familyHistoryReducer';
import {
    addFamilyMember,
    addFhPopOptions,
    deleteCondition,
    deleteFamilyMember,
    toggleCauseOfDeathOption,
    toggleConditionOption,
    toggleLivingOption,
    updateComments,
    updateCondition,
    updateMember,
} from '../actions/familyHistoryActions';
import { FamilyOption } from 'constants/familyHistoryRelations';
import { YesNoResponse } from 'constants/enums';

describe('family history reducer', () => {
    let store;

    beforeEach(() => {
        store = createStore(familyHistoryReducer, initialFamilyHistoryState);
    });

    describe('initial state', () => {
        it('returns the inital state correctly', () => {
            expect(store.getState()).toEqual(initialFamilyHistoryState);
        });
    });

    describe('actions', () => {
        const conditionIndex = '0';
        const conditionName = 'test';
        let familyMemberIndex;

        beforeEach(() => {
            store.dispatch(addFhPopOptions(conditionIndex, conditionName));

            familyMemberIndex = Object.keys(
                store.getState()[conditionIndex]['familyMembers']
            )[0];
        });

        it('adds condition correctly', () => {
            expect(store.getState()).toEqual({
                [conditionIndex]: {
                    condition: conditionName,
                    hasAfflictedFamilyMember: '',
                    familyMembers: {
                        [familyMemberIndex]: {
                            member: '',
                            causeOfDeath: '',
                            living: '',
                            comments: '',
                        },
                    },
                },
            });
        });

        it('updates condition name correctly', () => {
            const conditionName = 'newName';

            store.dispatch(updateCondition(conditionIndex, conditionName));
            expect(store.getState()[conditionIndex]['condition']).toEqual(
                conditionName
            );
        });

        it('toggles hasAfflictedFamilyMember correctly', () => {
            const hasAfflicted = YesNoResponse.Yes;

            store.dispatch(toggleConditionOption(conditionIndex, hasAfflicted));
            expect(
                store.getState()[conditionIndex]['hasAfflictedFamilyMember']
            ).toEqual(hasAfflicted);
        });

        it('adds and deletes family members correctly', () => {
            store.dispatch(addFamilyMember(conditionIndex));
            expect(
                Object.keys(store.getState()[conditionIndex]['familyMembers'])
                    .length
            ).toEqual(2);

            store.dispatch(
                deleteFamilyMember(conditionIndex, familyMemberIndex)
            );
            expect(
                Object.keys(store.getState()[conditionIndex]['familyMembers'])
                    .length
            ).toEqual(1);
        });

        it('updates family member name correctly', () => {
            const member = FamilyOption.Mother;

            store.dispatch(
                updateMember(conditionIndex, familyMemberIndex, member)
            );
            expect(
                store.getState()[conditionIndex]['familyMembers'][
                    familyMemberIndex
                ]['member']
            ).toEqual(member);
        });

        it('toggles family member cause of death correctly', () => {
            const causeOfDeath = YesNoResponse.Yes;

            store.dispatch(
                toggleCauseOfDeathOption(
                    conditionIndex,
                    familyMemberIndex,
                    causeOfDeath
                )
            );
            expect(
                store.getState()[conditionIndex]['familyMembers'][
                    familyMemberIndex
                ]['causeOfDeath']
            ).toEqual(causeOfDeath);
        });

        it('toggles family member living correctly', () => {
            const living = YesNoResponse.Yes;

            store.dispatch(
                toggleLivingOption(conditionIndex, familyMemberIndex, living)
            );
            expect(
                store.getState()[conditionIndex]['familyMembers'][
                    familyMemberIndex
                ]['living']
            ).toEqual(living);
        });

        it('updates comments correctly', () => {
            const newComments = 'comments';
            store.dispatch(
                updateComments(conditionIndex, familyMemberIndex, newComments)
            );
            expect(
                store.getState()[conditionIndex]['familyMembers'][
                    familyMemberIndex
                ]['comments']
            ).toEqual(newComments);
        });

        it('deletes condition correctly', () => {
            store.dispatch(deleteCondition(conditionIndex));
            expect(store.getState()).toEqual(initialFamilyHistoryState);
        });
    });
});
