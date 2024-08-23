import { ProductName } from '@constants/ProductDefinitions/ProductDefinitionType';
import { setProductDefinitionAction } from '@redux/actions/productDefinitionAction';
import { useDispatch } from 'react-redux';

const useProductDefinition = () => {
    const dispatch = useDispatch();

    const productType = localStorage.getItem('productType');

    if (!productType) {
        dispatch(
            setProductDefinitionAction(ProductName.SMART_PATIENT_INTAKE_FORM)
        );
    } else {
        dispatch(setProductDefinitionAction(productType as ProductName));
    }
};

export default useProductDefinition;
