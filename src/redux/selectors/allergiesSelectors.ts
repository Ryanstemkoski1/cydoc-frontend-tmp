import { CurrentNoteState } from '../reducers';
import {
    AllergiesState,
    AllergiesItem,
    AllergiesElements,
} from '../reducers/allergiesReducer';

export function selectAllergiesState(state: CurrentNoteState): AllergiesState {
    return state.allergies;
}

export function selectHasAllergiesState(
    state: CurrentNoteState
): boolean | null {
    return state.allergies.hasAllergies;
}

export function selectAllergies(state: CurrentNoteState): AllergiesElements {
    const allergiesState = state.allergies.elements;
    return allergiesState;
}

export function selectAllergiesItem(
    state: CurrentNoteState,
    index: keyof AllergiesElements
): AllergiesItem {
    const allergiesState = state.allergies.elements;
    return allergiesState[index];
}
