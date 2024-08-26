import { ProductName } from '@constants/ProductDefinitions/ProductDefinitionType';
import { setProductDefinitionAction } from '@redux/actions/productDefinitionAction';
import { useDispatch } from 'react-redux';

const useProductDefinition = () => {
    const dispatch = useDispatch();
    let productType = ProductName.SMART_PATIENT_INTAKE_FORM;

    try {
        const storedVal = localStorage.getItem('productType') || '';
        if (storedVal) {
            productType = storedVal as ProductName;
        }
    } catch (error) {}

    dispatch(setProductDefinitionAction(productType as ProductName));
};

export default useProductDefinition;
