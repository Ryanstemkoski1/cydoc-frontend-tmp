import { ProductDefinitions } from '@constants/ProductDefinitions/ProductDefinitionType';
import { PRODUCT_DEFINITION_ACTION } from '@redux/actions/actionTypes';
import { SetProductDefinitionAction } from '@redux/actions/productDefinitionAction';

interface ProductDefinitionState {
    definitions: ProductDefinitions | null;
}

export const initialProductDefinitionState: ProductDefinitionState = {
    definitions: null,
};

type ProductDefinitionAction = SetProductDefinitionAction;

export const productDefinitionReducer = (
    state = initialProductDefinitionState,
    action: ProductDefinitionAction
): ProductDefinitionState => {
    switch (action.type) {
        case PRODUCT_DEFINITION_ACTION.SET_PRODUCT_DEFINITION:
            return {
                ...state,
                definitions: action.payload,
            };
        default:
            return state;
    }
};
