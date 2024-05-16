import { chiefComplaintsActionTypes } from '../actions/chiefComplaintsActions';
import { CHIEF_COMPLAINTS } from '@redux/actions/actionTypes';

export type ChiefComplaintsState = {
    [disease: string]: string | number | undefined;
};

export const initialChiefComplaintsState: ChiefComplaintsState = {};

export function chiefComplaintsReducer(
    state = initialChiefComplaintsState,
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
            out (essentially: a double click is an unclick).
            */
            const { disease } = action.payload;
            if (disease in state) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [disease]: _deleted, ...res } = state;
                return res;
            } else
                return {
                    ...state,
                    [disease]: '',
                };
        }
        case CHIEF_COMPLAINTS.SET_NOTES_CHIEF_COMPLAINTS: {
            const { disease, notes } = action.payload;
            return {
                ...state,
                [disease]: notes,
            };
        }
        default:
            return state;
    }
}
