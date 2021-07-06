import { chiefComplaintsActionTypes } from '../actions/chiefComplaintsActions';
import { DoctorView } from 'constants/hpiEnums';
import { CHIEF_COMPLAINTS } from 'redux/actions/actionTypes';

export type ChiefComplaintsState = DoctorView[];

export const initialState: ChiefComplaintsState = [];

export function chiefComplaintsReducer(
    state = initialState,
    action: chiefComplaintsActionTypes
): ChiefComplaintsState {
    switch (action.type) {
        case CHIEF_COMPLAINTS.SELECT_CHIEF_COMPLAINTS: {
            const { disease } = action.payload;
            if (state.includes(disease)) {
                const newState = state.filter((value) => value != disease);
                return newState;
            }
            return [...state, disease];
        }

        default:
            return state;
    }
}
