import { CurrentNoteState } from '../reducers';
import {
    SurgicalHistoryState,
    SurgicalHistoryItem,
    SurgicalHistoryElements,
} from '../reducers/surgicalHistoryReducer';

export function selectSurgicalHistoryState(
    state: CurrentNoteState
): SurgicalHistoryState {
    return state.surgicalHistory;
}

export function selectHasSurgicalHistoryState(
    state: CurrentNoteState
): boolean | null {
    return state.surgicalHistory.hasSurgicalHistory;
}

export function selectSurgicalHistoryProcedures(
    state: CurrentNoteState
): SurgicalHistoryElements {
    const surgicalHistoryState = state.surgicalHistory.elements;
    return surgicalHistoryState;
}

export function selectSurgicalHistoryItem(
    state: CurrentNoteState,
    index: keyof SurgicalHistoryElements
): SurgicalHistoryItem {
    const surgicalHistoryState = state.surgicalHistory;
    return surgicalHistoryState.elements[index];
}
