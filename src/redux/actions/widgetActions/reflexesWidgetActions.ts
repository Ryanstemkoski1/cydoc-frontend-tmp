import { LeftRight } from 'constants/enums';
import { ReflexLocation } from 'redux/reducers/widgetReducers/reflexesWidgetReducer';
import { REFLEXES_WIDGET_ACTION } from '../actionTypes';

export interface AddReflexesWidgetItemAction {
    type: REFLEXES_WIDGET_ACTION.ADD_REFLEXES_WIDGET_ITEM;
    payload: Record<string, never>;
}

export const addReflexesWidgetItem = (): AddReflexesWidgetItemAction => ({
    type: REFLEXES_WIDGET_ACTION.ADD_REFLEXES_WIDGET_ITEM,
    payload: {},
});

export interface UpdateLocationAction {
    type: REFLEXES_WIDGET_ACTION.UPDATE_LOCATION;
    payload: {
        id: string;
        newLocation: ReflexLocation;
    };
}

export const updateLocation = (
    id: string,
    newLocation: ReflexLocation
): UpdateLocationAction => ({
    type: REFLEXES_WIDGET_ACTION.UPDATE_LOCATION,
    payload: {
        id,
        newLocation,
    },
});

export interface UpdateSideAction {
    type: REFLEXES_WIDGET_ACTION.UPDATE_SIDE;
    payload: {
        id: string;
        newSide: LeftRight;
    };
}

export const updateSide = (
    id: string,
    newSide: LeftRight
): UpdateSideAction => ({
    type: REFLEXES_WIDGET_ACTION.UPDATE_SIDE,
    payload: {
        id,
        newSide,
    },
});

export interface UpdateIntensityAction {
    type: REFLEXES_WIDGET_ACTION.UPDATE_INTENSITY;
    payload: {
        id: string;
        newIntensity: 0 | 1 | 2 | 3 | 4;
    };
}

export const updateIntensity = (
    id: string,
    newIntensity: 0 | 1 | 2 | 3 | 4
): UpdateIntensityAction => ({
    type: REFLEXES_WIDGET_ACTION.UPDATE_INTENSITY,
    payload: {
        id,
        newIntensity,
    },
});

export interface DeleteReflexesWidgetItemAction {
    type: REFLEXES_WIDGET_ACTION.DELETE_REFLEXES_WIDGET_ITEM;
    payload: {
        id: string;
    };
}

export const deleteReflexesWidgetItem = (
    id: string
): DeleteReflexesWidgetItemAction => ({
    type: REFLEXES_WIDGET_ACTION.DELETE_REFLEXES_WIDGET_ITEM,
    payload: {
        id,
    },
});

export type ReflexesWidgetActionTypes =
    | AddReflexesWidgetItemAction
    | UpdateLocationAction
    | UpdateSideAction
    | UpdateIntensityAction
    | DeleteReflexesWidgetItemAction;
