import { CurrentNoteState } from '@redux/reducers';
import { ChiefComplaintsState } from '@redux/reducers/chiefComplaintsReducer';

export function selectChiefComplaintsState(
    state: CurrentNoteState
): ChiefComplaintsState {
    return state.chiefComplaints;
}

export function selectChiefComplaintsNotes(
    state: CurrentNoteState,
    chiefComplaint: string
): string | number | undefined {
    return state.chiefComplaints[chiefComplaint];
}
