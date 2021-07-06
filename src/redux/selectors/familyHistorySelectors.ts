import { YesNoResponse } from 'constants/enums';
import { CurrentNoteState } from '../reducers';
import {
    FamilyHistoryState,
    FamilyHistoryMember,
    FamilyHistoryCondition,
} from '../reducers/familyHistoryReducer';

export interface FamilyHistoryConditionFlat {
    condition: string;
    hasAfflictedFamilyMember: YesNoResponse;
    familyMembers: FamilyHistoryMember[];
}

export function selectFamilyHistoryState(
    state: CurrentNoteState
): FamilyHistoryState {
    return state.familyHistory;
}

export function selectFamilyHistoryConditions(
    state: CurrentNoteState
): FamilyHistoryConditionFlat[] {
    const familyHistoryState = state.familyHistory;
    return Object.values(familyHistoryState).map((conditionValue) => {
        return {
            ...conditionValue,
            familyMembers: Object.values(conditionValue.familyMembers),
        };
    });
}

export function selectFamilyHistoryCondition(
    state: CurrentNoteState,
    conditionIndex: string
): FamilyHistoryCondition {
    const familyHistoryState = state.familyHistory;
    return familyHistoryState[conditionIndex];
}

export function selectFamilyHistoryMember(
    state: CurrentNoteState,
    conditionIndex: string,
    familyIndex: string
): FamilyHistoryMember {
    const familyHistoryState = state.familyHistory;
    const familyHistoryCondition = familyHistoryState[conditionIndex];
    const familyHistoryMembers = familyHistoryCondition.familyMembers;
    return familyHistoryMembers[familyIndex];
}
