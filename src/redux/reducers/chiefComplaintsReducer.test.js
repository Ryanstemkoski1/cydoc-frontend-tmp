import {
    initialChiefComplaintsState,
    chiefComplaintsReducer,
} from './chiefComplaintsReducer';
import { CHIEF_COMPLAINTS } from '@redux/actions/actionTypes';

describe('initial state', () => {
    it('returns the initial state', () => {
        const action = { type: 'dummy_action' };
        expect(chiefComplaintsReducer(undefined, action)).toEqual(
            initialChiefComplaintsState
        );
    });
});

describe('select chief complaint', () => {
    const payload = {
        disease: 'foo',
    };
    let nextState = initialChiefComplaintsState;
    it('returns state with chief complaint newly selected', () => {
        nextState = chiefComplaintsReducer(initialChiefComplaintsState, {
            type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty(payload.disease);
    });
    it('returns state with chief complaint deselected', () => {
        nextState = chiefComplaintsReducer(nextState, {
            type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).not.toHaveProperty(payload.disease);
    });
});

describe('set notes chief complaints', () => {
    let payload = {
        disease: 'foo',
    };
    it('returns state with misc notes', () => {
        let nextState = chiefComplaintsReducer(initialChiefComplaintsState, {
            type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
            payload: payload,
        });
        payload.notes = 'foo1';
        nextState = chiefComplaintsReducer(nextState, {
            type: CHIEF_COMPLAINTS.SET_NOTES_CHIEF_COMPLAINTS,
            payload: payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toHaveProperty(payload.disease);
        expect(nextState[payload.disease]).toEqual(payload.notes);
    });
});
