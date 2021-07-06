import { PULSES_WIDGET_ACTION } from 'redux/actions/actionTypes';
import { PulsesWidgetActionTypes } from 'redux/actions/widgetActions/pulsesWidgetActions';
import { LeftRight } from 'constants/enums';
import { v4 } from 'uuid';

export interface PulsesWidgetState {
    [id: string]: PulsesWidgetItemState;
}

export interface PulsesWidgetItemState {
    location: PulseLocation | '';
    side: LeftRight | '';
    intensity: 0 | 1 | 2 | 3 | 4 | -1;
}

export enum PulseLocation {
    Brachial = 'brachial',
    Radial = 'radial',
    Ulnar = 'ulnar',
    DorsalisPedis = 'dorsalis pedis',
}

const initialState: PulsesWidgetState = {};

export function pulsesWidgetReducer(
    state = initialState,
    action: PulsesWidgetActionTypes
): PulsesWidgetState {
    switch (action.type) {
        case PULSES_WIDGET_ACTION.ADD_PULSES_WIDGET_ITEM: {
            return {
                ...state,
                [v4()]: {
                    location: '',
                    side: '',
                    intensity: -1,
                },
            };
        }
        case PULSES_WIDGET_ACTION.UPDATE_LOCATION: {
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
        case PULSES_WIDGET_ACTION.UPDATE_SIDE: {
            const { id, newSide } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    side: newSide === state[id].side ? '' : newSide,
                },
            };
        }
        case PULSES_WIDGET_ACTION.UPDATE_INTENSITY: {
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
        case PULSES_WIDGET_ACTION.DELETE_PULSES_WIDGET_ITEM: {
            const { id } = action.payload;
            /* eslint-disable-next-line */
            const { [id]: _deleted, ...newState } = state;
            return newState;
        }
        default:
            return state;
    }
}
