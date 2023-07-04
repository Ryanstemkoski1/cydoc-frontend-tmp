import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { Provider } from 'react-redux';
// import LabTestInput from '../LaboratoryTest';
import { currentNoteStore } from 'redux/store';
// import { ExpectedResponseDict } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new Adapter() });

const connectRealStore = () => {
    const store = currentNoteStore;
    // const node = {
    //     uid: 'uid',
    //     medID: 'node',
    //     category: 'category',
    //     text:
    //         'NAME[BNP] SNOMED[390917008] COMPONENTS_AND_UNITS[BNP HASUNITS picogram/milliliter]',
    //     responseType: 'LABORATORY-TEST',
    //     response: ExpectedResponseDict.LABORATORY_TEST,
    //     bodySystem: 'bodySystem',
    //     noteSection: 'noteSection',
    //     DoctorView: 'DoctorView',
    //     PatientView: 'PatientView',
    //     doctorCreated: 'doctorCreated',
    //     blankYes: 'blankYes',
    //     blankNo: 'blankNo',
    //     blankTemplate: 'blankTemplate',
    // };
    // const edges = [
    //     {
    //         from: 'foo1',
    //         to: 'foo2',
    //         fromQuestionOrder: -1,
    //         toQuestionOrder: -1,
    //     },
    // ];
    // TODO: Use processKnowledgeGraph as addNode was replaced
    // store.dispatch(addNode('node', node, edges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {/* <LabTestInput node={'node'} hpi={store.getState().hpi} /> */}
            </Provider>
        ),
    };
};

describe('LabTest', () => {
    const { wrapper } = connectRealStore();
    test('renders', () => expect(wrapper).toBeTruthy());
    // // TODO: Fix below tests
    // test('unit input updates string value', () => {
    //     const foo = 'foo';
    //     expect(
    //         wrapper.find('input[id="lab-test"]').prop('value')
    //     ).toBeUndefined();
    //     wrapper.find('input[id="lab-test"]').simulate('change', {
    //         target: { value: foo },
    //     });
    //     wrapper.update();
    //     expect(wrapper.find('input[id="lab-test"]').prop('value')).toEqual(foo);
    // });

    // test('unit input updates number value', () => {
    //     wrapper.find('input[id="lab-test"]').simulate('change', {
    //         target: { value: 8 },
    //     });
    //     wrapper.update();
    //     expect(wrapper.find('input[id="lab-test"]').prop('value')).toEqual(8);
    // });

    // test('unit option buttons work', () => {
    //     const numButtons = wrapper.find('.unit-option').length;
    //     for (let i = 0; i < numButtons; i++) {
    //         expect(
    //             wrapper.find('.unit-option').at(i).prop('color')
    //         ).toBeUndefined();
    //         wrapper.find('.unit-option').at(i).simulate('click');
    //         wrapper.update();
    //         expect(wrapper.find('.unit-option').at(i).prop('color')).toEqual(
    //             'grey'
    //         );
    //     }
    // });
});
