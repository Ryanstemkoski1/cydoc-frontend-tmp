import { YesNoResponse } from 'constants/enums';
import { ROS_ACTION } from '../actions/actionTypes';
import { ROSActionTypes } from '../actions/reviewOfSystemsActions';
import { initialReviewOfSystemsState } from 'constants/reviewOfSystemsInitial';

export interface ReviewOfSystemsState {
    [category: string]: {
        [option: string]: YesNoResponse | '';
    };
}

export function reviewOfSystemsReducer(
    state = initialReviewOfSystemsState,
    action: ROSActionTypes
): ReviewOfSystemsState {
    const { category, option, yesOrNo } = action.payload || {};
    switch (action.type) {
        case ROS_ACTION.TOGGLE_OPTION:
            return {
                ...state,
                [category]: {
                    ...state[category],
                    [option]:
                        yesOrNo === state[category][option] ? '' : yesOrNo,
                },
            };
        default:
            return state;
    }
}
