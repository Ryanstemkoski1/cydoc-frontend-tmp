import { PRODUCT_DEFINITION_ACTION } from './actionTypes';
import {
    ProductDefinitions,
    ProductName,
} from '@constants/ProductDefinitions/ProductDefinitionType';
import { SmartPatientIntakeForm } from '@constants/ProductDefinitions/smartPatientIntakeForm';
import { AdvancedReportGeneration } from '@constants/ProductDefinitions/advancedReportGeneration';

export interface SetProductDefinitionAction {
    type: typeof PRODUCT_DEFINITION_ACTION.SET_PRODUCT_DEFINITION;
    payload: ProductDefinitions;
}

export const setProductDefinitionAction = (productName: string) => {
    let definitions: ProductDefinitions;

    switch (productName) {
        case ProductName.SMART_PATIENT_INTAKE_FORM:
            definitions = SmartPatientIntakeForm;
            break;
        case ProductName.ADVANCED_REPORT_GENERATION:
            definitions = AdvancedReportGeneration;
            break;
        default:
            definitions = SmartPatientIntakeForm;
    }

    return {
        type: PRODUCT_DEFINITION_ACTION.SET_PRODUCT_DEFINITION,
        payload: definitions,
    };
};
