import { REFLEXES_WIDGET_ACTION } from '@redux/actions/actionTypes';
import { ReflexesWidgetActionTypes } from '@redux/actions/widgetActions/reflexesWidgetActions';
import { v4 } from 'uuid';
import { LeftRight } from '@constants/enums';

export interface ReflexesWidgetState {
    [id: string]: ReflexesWidgetItemState;
}

export interface ReflexesWidgetItemState {
    location: ReflexLocation | '';
    side: LeftRight | '';
    intensity: 0 | 1 | 2 | 3 | 4 | -1;
}

export enum ReflexLocation {
    Biceps = 'biceps',
    Brachioradialis = 'brachioradialis',
    Triceps = 'triceps',
    Patellar = 'patellar',
    AnkleJerk = 'ankle jerk',
    Plantar = 'plantar',
}

const initialState: ReflexesWidgetState = {};

export function reflexesWidgetReducer(
    state = initialState,
    action: ReflexesWidgetActionTypes
): ReflexesWidgetState {
    switch (action.type) {
        case REFLEXES_WIDGET_ACTION.ADD_REFLEXES_WIDGET_ITEM: {
            return {
                ...state,
                [v4()]: {
                    location: '',
                    side: '',
                    intensity: -1,
                },
            };
        }
        case REFLEXES_WIDGET_ACTION.UPDATE_LOCATION: {
            const { id, newLocation } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    location:
                        newLocation === state[id].location ? '' : newLocation,
                },
            };
        }
        case REFLEXES_WIDGET_ACTION.UPDATE_SIDE: {
            const { id, newSide } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    side: newSide === state[id].side ? '' : newSide,
                },
            };
        }
        case REFLEXES_WIDGET_ACTION.UPDATE_INTENSITY: {
            const { id, newIntensity } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    intensity:
                        newIntensity === state[id].intensity
                            ? -1
                            : newIntensity,
                },
            };
        }
        case REFLEXES_WIDGET_ACTION.DELETE_REFLEXES_WIDGET_ITEM: {
            const { id } = action.payload;
            /* eslint-disable-next-line */
            const { [id]: _deleted, ...newState } = state;
            return newState;
        }
        default:
            return state;
    }
}
