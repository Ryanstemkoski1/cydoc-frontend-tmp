import { CurrentNoteState } from 'redux/reducers';

export function selectNoteId(state: CurrentNoteState): string | null {
    return state._id;
}

export function selectNoteTitle(state: CurrentNoteState): string {
    return state.title;
}
