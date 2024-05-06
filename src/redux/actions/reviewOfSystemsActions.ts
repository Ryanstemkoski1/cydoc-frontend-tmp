import { YesNoResponse } from 'constants/enums';
import { ROS_ACTION } from './actionTypes';

export interface ToggleROSOptionAction {
    type: ROS_ACTION.TOGGLE_OPTION;
    payload: {
        category: string;
        option: string;
        yesOrNo: YesNoResponse;
    };
}

export const toggleROSOption = (
    category: string,
    option: string,
    yesOrNo: YesNoResponse
): ToggleROSOptionAction => ({
    type: ROS_ACTION.TOGGLE_OPTION,
    payload: {
        category,
        option,
        yesOrNo,
    },
});

export type ROSActionTypes = ToggleROSOptionAction;
