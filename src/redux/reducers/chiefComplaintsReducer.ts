import { chiefComplaintsActionTypes } from '../actions/chiefComplaintsActions';
import { CHIEF_COMPLAINTS } from 'redux/actions/actionTypes';

export type ChiefComplaintsState = string[];

export const initialState: ChiefComplaintsState = [];

export function chiefComplaintsReducer(
    state = initialState,
    action: chiefComplaintsActionTypes
): ChiefComplaintsState {
    switch (action.type) {
        case CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS: {
            /*
            The chief complaints correspond to the disease picker
            in the front page. If a disease is chosen by the user
            and is not present in the current state, it is added 
            to the state. If a disease is chosen by the user and
            is already present in the current state, it is filtered
            out (essentially: a double click is an unclick).s
            */
            const { disease } = action.payload;
            return state.includes(disease)
                ? state.filter((value) => value != disease)
                : [...state, disease];
        }
        default:
            return state;
    }
}
