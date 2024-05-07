import { LeftRight } from 'constants/enums';
import { PulseLocation } from '@redux/reducers/widgetReducers/pulsesWidgetReducer';
import { PULSES_WIDGET_ACTION } from '../actionTypes';

export interface AddPulsesWidgetItemAction {
    type: PULSES_WIDGET_ACTION.ADD_PULSES_WIDGET_ITEM;
    payload: Record<string, never>;
}

export const addPulsesWidgetItem = (): AddPulsesWidgetItemAction => ({
    type: PULSES_WIDGET_ACTION.ADD_PULSES_WIDGET_ITEM,
    payload: {},
});

export interface UpdateLocationAction {
    type: PULSES_WIDGET_ACTION.UPDATE_LOCATION;
    payload: {
        id: string;
        newLocation: PulseLocation;
    };
}

export const updateLocation = (
    id: string,
    newLocation: PulseLocation
): UpdateLocationAction => ({
    type: PULSES_WIDGET_ACTION.UPDATE_LOCATION,
    payload: {
        id,
        newLocation,
    },
});

export interface UpdateSideAction {
    type: PULSES_WIDGET_ACTION.UPDATE_SIDE;
    payload: {
        id: string;
        newSide: LeftRight;
    };
}

export const updateSide = (
    id: string,
    newSide: LeftRight
): UpdateSideAction => ({
    type: PULSES_WIDGET_ACTION.UPDATE_SIDE,
    payload: {
        id,
        newSide,
    },
});

export interface UpdateIntensityAction {
    type: PULSES_WIDGET_ACTION.UPDATE_INTENSITY;
    payload: {
        id: string;
        newIntensity: 0 | 1 | 2 | 3 | 4 | -1;
    };
}

export const updateIntensity = (
    id: string,
    newIntensity: 0 | 1 | 2 | 3 | 4 | -1
): UpdateIntensityAction => ({
    type: PULSES_WIDGET_ACTION.UPDATE_INTENSITY,
    payload: {
        id,
        newIntensity,
    },
});

export interface DeletePulsesWidgetItemAction {
    type: PULSES_WIDGET_ACTION.DELETE_PULSES_WIDGET_ITEM;
    payload: {
        id: string;
    };
}

export const deletePulsesWidgetItem = (
    id: string
): DeletePulsesWidgetItemAction => ({
    type: PULSES_WIDGET_ACTION.DELETE_PULSES_WIDGET_ITEM,
    payload: {
        id,
    },
});

export type PulsesWidgetActionTypes =
    | AddPulsesWidgetItemAction
    | UpdateLocationAction
    | UpdateSideAction
    | UpdateIntensityAction
    | DeletePulsesWidgetItemAction;
