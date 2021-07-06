import { CurrentNoteState } from '../reducers';
import {
    SurgicalHistoryState,
    SurgicalHistoryItem,
} from '../reducers/surgicalHistoryReducer';

export function selectSurgicalHistoryState(
    state: CurrentNoteState
): SurgicalHistoryState {
    return state.surgicalHistory;
}

export function selectSurgicalHistoryProcedures(
    state: CurrentNoteState
): SurgicalHistoryItem[] {
    const surgicalHistoryState = state.surgicalHistory;
    return Object.values(surgicalHistoryState);
}

export function selectSurgicalHistoryItem(
    state: CurrentNoteState,
    index: keyof SurgicalHistoryState
): SurgicalHistoryItem {
    const surgicalHistoryState = state.surgicalHistory;
    return surgicalHistoryState[index];
}
