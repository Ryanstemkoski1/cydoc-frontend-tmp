import { initialState, chiefComplaintsReducer } from './chiefComplaintsReducer';
import { CHIEF_COMPLAINTS } from 'redux/actions/actionTypes';

describe('initial state', () => {
    it('returns the initial state', () => {
        const action = { type: 'dummy_action' };
        expect(chiefComplaintsReducer(undefined, action)).toEqual(initialState);
    });
});

describe('select chief complaint', () => {
    it('returns state with chief complaint newly selected', () => {
        const payload = {
            disease: 'foo',
        };
        expect(
            chiefComplaintsReducer(initialState, {
                type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                payload,
            })
        ).toMatchSnapshot();
    });
    it('returns state with chief complaint deselected', () => {
        const payload = {
            disease: 'foo',
        };
        expect(
            chiefComplaintsReducer(initialState, {
                type: CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS,
                payload,
            })
        ).toMatchSnapshot();
    });
});
