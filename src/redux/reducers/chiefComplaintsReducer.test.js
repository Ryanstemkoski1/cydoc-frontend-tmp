import { initialState, chiefComplaintsReducer } from './chiefComplaintsReducer';
import { CHIEF_COMPLAINTS } from 'redux/actions/actionTypes';

describe('initial state', () => {
    it('returns the initial state', () => {
        const action = { type: 'dummy_action' };
        expect(chiefComplaintsReducer(undefined, action)).toEqual(initialState);
    });
});

describe('select chief complaint', () => {
    let payload = { disease: 'foo' };
    let nextState = initialState;
    it('returns state with chief complaint newly selected', () => {
        nextState = chiefComplaintsReducer(nextState, {
            type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).toContain(payload.disease);
    });
    it('returns state with chief complaint deselected', () => {
        nextState = chiefComplaintsReducer(nextState, {
            type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
            payload,
        });
        expect(nextState).toMatchSnapshot();
        expect(nextState).not.toContain(payload.disease);
    });
});
