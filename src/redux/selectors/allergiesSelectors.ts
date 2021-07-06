import { CurrentNoteState } from '../reducers';
import { AllergiesState, AllergiesItem } from '../reducers/allergiesReducer';

export function selectAllergiesState(state: CurrentNoteState): AllergiesState {
    return state.allergies;
}

export function selectAllergies(state: CurrentNoteState): AllergiesItem[] {
    const allergiesState = state.allergies;
    return Object.values(allergiesState);
}

export function selectAllergiesItem(
    state: CurrentNoteState,
    index: keyof AllergiesState
): AllergiesItem {
    const allergiesState = state.allergies;
    return allergiesState[index];
}
