import { CURRENT_NOTE_ACTION } from '../actions/actionTypes';
import { CurrentNoteActionTypes } from '../actions/currentNoteActions';

export const initialNoteTitle = 'Untitled Note';
export const initialNoteId = '';

export function noteTitleReducer(
    state = initialNoteTitle,
    action: CurrentNoteActionTypes
): string {
    switch (action.type) {
        case CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE:
            return action.payload.newTitle;
        default:
            return state;
    }
}

export function noteIdReducer(
    state = initialNoteId,
    action: CurrentNoteActionTypes
): string {
    switch (action.type) {
        case CURRENT_NOTE_ACTION.UPDATE_NOTE_ID:
            return action.payload.newId;
        default:
            return state;
    }
}
