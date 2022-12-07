import { CurrentNoteState } from '../reducers';
import { CURRENT_NOTE_ACTION } from './actionTypes';

export interface LoadNoteAction {
    type: CURRENT_NOTE_ACTION.LOAD_NOTE;
    payload: CurrentNoteState;
}

export const loadNote = (note: CurrentNoteState): LoadNoteAction => ({
    type: CURRENT_NOTE_ACTION.LOAD_NOTE,
    payload: note,
});

export interface DeleteNoteAction {
    type: CURRENT_NOTE_ACTION.DELETE_NOTE;
    payload: Record<string, never>;
}

export const deleteNote = (): DeleteNoteAction => ({
    type: CURRENT_NOTE_ACTION.DELETE_NOTE,
    payload: {},
});

export interface UpdateNoteTitleAction {
    type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE;
    payload: { newTitle: string };
}

export const updateNoteTitle = (newTitle: string): UpdateNoteTitleAction => ({
    type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE,
    payload: { newTitle },
});

export interface UpdateNoteIdAction {
    type: CURRENT_NOTE_ACTION.UPDATE_NOTE_ID;
    payload: { newId: string };
}

export const updateNoteId = (newId: string): UpdateNoteIdAction => ({
    type: CURRENT_NOTE_ACTION.UPDATE_NOTE_ID,
    payload: { newId },
});

export type CurrentNoteActionTypes =
    | LoadNoteAction
    | DeleteNoteAction
    | UpdateNoteTitleAction
    | UpdateNoteIdAction;
