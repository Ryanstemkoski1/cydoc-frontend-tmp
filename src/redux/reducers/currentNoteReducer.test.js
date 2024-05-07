import {
    noteIdReducer,
    noteTitleReducer,
    initialNoteId,
    initialNoteTitle,
} from './currentNoteReducer';
import { CURRENT_NOTE_ACTION } from '@redux/actions/actionTypes';

describe('general note reducers', () => {
    it('returns the initial id', () => {
        expect(noteIdReducer(undefined, {})).toEqual(initialNoteId);
    });

    it('returns the initial title', () => {
        expect(noteTitleReducer(undefined, {})).toEqual(initialNoteTitle);
    });

    it('updates note id', () => {
        const newId = 'foo';
        expect(
            noteTitleReducer(initialNoteId, {
                type: CURRENT_NOTE_ACTION.UPDATE_NOTE_ID,
                payload: { newId },
            })
        ).toMatchSnapshot();
    });

    it('updates note title', () => {
        const newTitle = 'foo';
        expect(
            noteTitleReducer(initialNoteTitle, {
                type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE,
                payload: { newTitle },
            })
        ).toMatchSnapshot();
    });
});
