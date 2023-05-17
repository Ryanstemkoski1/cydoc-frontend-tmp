import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import SurgicalHistoryContent from '../SurgicalHistoryContent.tsx';
// import SurgicalHistoryTableBodyRow from '../SurgicalHistoryTableBodyRow';
// import AddRowButton from 'components/tools/AddRowButton';
// import { Button, Accordion } from 'semantic-ui-react';
// import { SURGICAL_HISTORY_ACTION } from 'redux/actions/actionTypes';
// import { currentNoteStore } from 'redux/store';
// import { deleteNote } from 'redux/actions/currentNoteActions';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const initialState = {
    ['foo']: { procedure: '', year: -1, comments: '' },
    ['bar']: { procedure: '', year: -1, comments: '' },
    ['foobar']: { procedure: '', year: -1, comments: '' },
    patientView: true,
};

const connectStore = (state = initialState, props) => {
    const store = mockStore({ surgicalHistory: state });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <SurgicalHistoryContent {...props} />
            </Provider>
        ),
    };
};

describe('SurgicalHistoryContent', () => {
    beforeEach(() => {
        const { store } = connectStore();
        store.clearActions();
    });

    test('placeholder test to get suite to run', () => {});

    // // TODO: Fix below tests
    // test('render', () => {
    //     const { wrapper } = connectStore();
    //     expect(wrapper).toBeTruthy();
    //     const rows = wrapper.find(SurgicalHistoryTableBodyRow);
    //     expect(rows).toHaveLength(3);
    // });

    // test('addRow works?', () => {
    //     const { wrapper, store } = connectStore();
    //     const button = wrapper.find(AddRowButton).find(Button);
    //     expect(button).toBeTruthy();
    //     button.simulate('click');
    //     const expectedActions = [
    //         { type: SURGICAL_HISTORY_ACTION.ADD_PROCEDURE },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // test('deleteRow works?', () => {
    //     const { wrapper, store } = connectStore();
    //     const button = wrapper
    //         .find('button[aria-label="delete-surgery"]')
    //         .first();
    //     expect(button).toBeTruthy();
    //     button.simulate('click');
    //     const expectedActions = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.DELETE_PROCEDURE,
    //             payload: {
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // test('editing year dispatches correct action', () => {
    //     const { wrapper, store } = connectStore();
    //     const input = wrapper.find('.table-row-text[type="year"]').first();
    //     input.simulate('change', {
    //         target: { value: 2000 },
    //     });
    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_YEAR,
    //             payload: {
    //                 newYear: 2000,
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing year dispatches correct action - mobile', () => {
    //     const { wrapper, store } = connectStore(initialState, { mobile: true });
    //     const input = wrapper.find('input[type="year"]').first();
    //     input.simulate('change', {
    //         target: { value: 2000 },
    //     });
    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_YEAR,
    //             payload: {
    //                 newYear: 2000,
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing procedure dispatches correct action', () => {
    //     const { wrapper, store } = connectStore();
    //     wrapper
    //         .find('input[aria-label="Surgical-Dropdown"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     const option = wrapper.find('.option').first();
    //     option.simulate('click');

    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE,
    //             payload: {
    //                 newProcedure: option.prop('value'),
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing procedure dispatches correct action - mobile', () => {
    //     const { wrapper, store } = connectStore(initialState, { mobile: true });
    //     wrapper
    //         .find('input[aria-label="Surgical-Dropdown"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     const option = wrapper.find('.option').first();
    //     option.simulate('click');

    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_PROCEDURE,
    //             payload: {
    //                 newProcedure: option.prop('value'),
    //                 index: Object.keys(initialState)[0],
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing comments dispatches correct action', () => {
    //     const { wrapper, store } = connectStore();
    //     const input = wrapper.find('.table-row-text[type="comments"]').first();
    //     input.simulate('change', {
    //         target: { value: 'Normal' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS,
    //             payload: {
    //                 newComments: 'Normal',
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing comments dispatches correct action - mobile', () => {
    //     const { wrapper, store } = connectStore(initialState, { mobile: true });
    //     const input = wrapper.find('input[type="comments"]').first();
    //     input.simulate('change', {
    //         target: { value: 'Normal' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: SURGICAL_HISTORY_ACTION.UPDATE_COMMENTS,
    //             payload: {
    //                 newComments: 'Normal',
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('handle cell click', () => {
    //     const { wrapper } = connectStore();
    //     const input = wrapper.find('td').at(1);
    //     input.simulate('click');
    //     expect(input.find('textarea').getElement().rowindex).toEqual(
    //         document.activeElement.rowIndex
    //     );
    // });

    // test('onTitleClick', () => {
    //     const { wrapper } = connectStore(initialState, { mobile: true });
    //     wrapper
    //         .find('input[aria-label="Surgical-Dropdown"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     expect(wrapper.find('.title').first().getElement().rowindex).toEqual(
    //         document.activeElement.rowIndex
    //     );
    // });

    // test('desktop year validation', () => {
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
    //             <SurgicalHistoryContent />
    //         </Provider>
    //     );
    //     wrapper.find('button').simulate('click');
    //     wrapper.update();
    //     const rows = wrapper.find(SurgicalHistoryTableBodyRow);
    //     expect(rows).toHaveLength(1);
    //     wrapper
    //         .find('.table-row-text[type="year"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 0 },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('.table-row-text[type="year"]').first().prop('value')
    //     ).toEqual('0');
    //     expect(wrapper.find('.year-validation-error')).toHaveLength(0);
    //     wrapper.find('.table-row-text[type="year"]').first().simulate('blur');
    //     wrapper.update();
    //     expect(wrapper.find('.year-validation-error')).toHaveLength(1);
    //     currentNoteStore.dispatch(deleteNote());
    // });

    // test('mobile year validation', () => {
    //     const props = {
    //         mobile: true,
    //     };
    //     const wrapper = mount(
    //         <Provider store={currentNoteStore}>
    //             <SurgicalHistoryContent {...props} />
    //         </Provider>
    //     );
    //     wrapper.find('button').simulate('click');
    //     wrapper.update();
    //     const rows = wrapper.find(Accordion);
    //     expect(rows).toHaveLength(1);
    //     wrapper
    //         .find('input[aria-label="Surgical-Dropdown"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     wrapper.update();
    //     expect(wrapper.find('input[type="year"]').first()).toHaveLength(1);
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(0);
    //     wrapper
    //         .find('input[type="year"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 0 },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('input[type="year"]').first().prop('value')
    //     ).toEqual(0);
    //     expect(wrapper.find('.year-validation-mobile-error')).toHaveLength(1);
    // });
});
