import { ACTIVE_ITEM_ACTION } from '@redux/actions/actionTypes';
import { activeItemActionTypes } from '@redux/actions/activeItemActions';

export const initialActiveItemState = { activeItem: 'CC' };

export function activeItemReducer(
    state = initialActiveItemState,
    action: activeItemActionTypes
) {
    switch (action.type) {
        case ACTIVE_ITEM_ACTION.ACTIVE_ITEM: {
            return { activeItem: action.payload.updatedItem };
        }
        default:
            return state;
    }
}
