import { UnknownAction } from 'redux';
import { ACTIVE_ITEM_ACTION } from './actionTypes';

export interface UpdateActiveItemAction extends UnknownAction {
    type: ACTIVE_ITEM_ACTION.ACTIVE_ITEM;
    payload: {
        updatedItem: string;
    };
}

export function updateActiveItem(updatedItem: string): UpdateActiveItemAction {
    return {
        type: ACTIVE_ITEM_ACTION.ACTIVE_ITEM,
        payload: {
            updatedItem,
        },
    };
}

export type activeItemActionTypes = UpdateActiveItemAction;
