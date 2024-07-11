import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import PhysicalExamContent from '../PhysicalExamContent';
import PhysicalExamGroup from '../PhysicalExamGroup';
import { initialPhysicalExamState } from '../../../../../redux/reducers/physicalExamReducer';
import { PHYSICAL_EXAM_ACTION } from '../../../../../redux/actions/actionTypes';
import { Button } from 'semantic-ui-react';
import LRButton from '../../../../../components/tools/LRButtonRedux.js';
import SelectAllButton from '../SelectAllButton';
import { deleteNote } from '../../../../../redux/actions/currentNoteActions';
import PhysicalExamRow from '../PhysicalExamRow';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const mockStore = configureStore([]);

const connectStore = () => {
    const store = mockStore({ physicalExam: initialPhysicalExamState });
    return {
        store,
        wrapper: render(
            <Provider store={store}>
                {/* Placeholder */}
                {null}
                {/* <PhysicalExamContent
                    nextFormClick={vi.fn()}
                    previousFormClick={vi.fn()}
                /> */}
            </Provider>
        ),
    };
};

describe.todo('PhysicalExamContent', () => {
    // beforeEach(() => {
    //     const { store } = connectStore();
    //     store.clearActions();
    // });
    // test('render', () => {
    //     const { wrapper } = connectStore();
    //     expect(wrapper).toBeTruthy();
    //     const rows = wrapper.find(PhysicalExamGroup);
    //     expect(rows).toHaveLength(16);
    // });
    // test('update vitals', () => {
    //     const { wrapper, store } = connectStore();
    //     (
    //         wrapper.container.querySelectorAll(
    //             'input[type="number"]'
    //         )[0] as HTMLInputElement
    //     ).value = '0';
    //     // .find('input[type="number"]')
    //     // .first()
    //     // .simulate('change', {
    //     //     target: { value: 0 },
    //     // });
    //     const expectedAction = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.UPDATE_VITALS,
    //             payload: {
    //                 vitalsField: 'systolicBloodPressure',
    //                 newValue: 0,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
    // test('update comments', () => {
    //     const { wrapper, store } = connectStore();
    //     wrapper
    //         .find('textarea')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'foo' },
    //         });
    //     const expectedAction = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.UPDATE_COMMENTS,
    //             payload: {
    //                 section: 'General',
    //                 newComments: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
    // test('handle toggle', () => {
    //     const { wrapper, store } = connectStore();
    //     wrapper.find(Button).at(1).simulate('click');
    //     const expectedAction = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_FINDING,
    //             payload: {
    //                 section: 'General',
    //                 finding: 'well-appearing',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
    // test('handle leftright toggle center redux', () => {
    //     const { wrapper, store } = connectStore();
    //     wrapper.find(LRButton).find(Button).at(0).simulate('click');
    //     const expectedAction = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_LEFT_RIGHT_FINDING,
    //             payload: {
    //                 section: 'Eyes',
    //                 finding: 'sclera anicteric',
    //                 buttonClicked: 'center',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
    // test.todo('handle leftright toggle center', () => {
    //     const { wrapper, store } = connectStore();
    //     store.dispatch(deleteNote());
    //     expect(
    //         wrapper.find(LRButton).find(Button).at(0).prop('color')
    //     ).toBeNull();
    //     wrapper.find(LRButton).find(Button).at(0).simulate('click');
    //     wrapper.update();
    //     //now that button has expanded, center is 1
    //     expect(wrapper.find(LRButton).find(Button).at(1).prop('color')).toBe(
    //         'green'
    //     );
    //     //make sure it is the center button
    //     expect(wrapper.find(LRButton).find(Button).at(1).prop('content')).toBe(
    //         'sclera anicteric'
    //     );
    //     //only center is green
    //     expect(wrapper.find('.left.attached').first().hasClass('green')).toBe(
    //         false
    //     );
    //     expect(wrapper.find('.right.attached').first().hasClass('green')).toBe(
    //         false
    //     );
    //     //deselect
    //     wrapper.find(LRButton).find(Button).at(1).simulate('click');
    //     wrapper.update();
    //     expect(
    //         wrapper.find(LRButton).find(Button).at(0).prop('color')
    //     ).toBeNull();
    //     expect(wrapper.find(LRButton).find(Button).at(0).prop('content')).toBe(
    //         'sclera anicteric'
    //     );
    //     store.dispatch(deleteNote());
    // });
    // test.todo('handle leftright toggle left', () => {
    //     const { wrapper, store } = connectStore();
    //     store.dispatch(deleteNote());
    //     expect(
    //         wrapper.find(LRButton).find(Button).at(0).prop('color')
    //     ).toBeNull();
    //     wrapper.find(LRButton).find(Button).at(0).simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('.left.attached').first().hasClass('green')).toBe(
    //         false
    //     );
    //     wrapper.find('.left.attached').first().simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('.left.attached').first().hasClass('green')).toBe(
    //         true
    //     );
    //     store.dispatch(deleteNote());
    // });
    // test.todo('handle leftright toggle right', () => {
    //     const { wrapper, store } = connectStore();
    //     store.dispatch(deleteNote());
    //     expect(
    //         wrapper.find(LRButton).find(Button).at(0).prop('color')
    //     ).toBeNull();
    //     wrapper.find(LRButton).find(Button).at(0).simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('.right.attached').first().hasClass('green')).toBe(
    //         false
    //     );
    //     wrapper.find('.right.attached').first().simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('.right.attached').first().hasClass('green')).toBe(
    //         true
    //     );
    //     store.dispatch(deleteNote());
    // });
    // test('select all redux regular buttons only', () => {
    //     const { wrapper, store } = connectStore();
    //     //no LR
    //     wrapper.find(SelectAllButton).at(0).simulate('click');
    //     const expectedAction = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'General',
    //                 finding: 'well-appearing',
    //                 response: true,
    //             },
    //         },
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'General',
    //                 finding: 'well-nourished',
    //                 response: true,
    //             },
    //         },
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'General',
    //                 finding: 'no acute distress',
    //                 response: true,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    //     store.clearActions();
    //     //deselect
    //     wrapper.find(SelectAllButton).at(0).simulate('click');
    //     expect(store.getActions()).toEqual(expectedAction);
    //     store.clearActions();
    // });
    // test('select all LRToggle (doubles as test for LRToggle redux)', () => {
    //     //LR
    //     const { wrapper, store } = connectStore();
    //     wrapper.find(SelectAllButton).at(2).simulate('click');
    //     const expectedAction2 = [
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'Eyes',
    //                 finding: 'sclera anicteric',
    //                 response: true,
    //             },
    //         },
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'Eyes',
    //                 finding: 'no redness',
    //                 response: true,
    //             },
    //         },
    //         {
    //             type: PHYSICAL_EXAM_ACTION.TOGGLE_CHOOSE_BOOLEAN_VALUE,
    //             payload: {
    //                 section: 'Eyes',
    //                 finding: 'no discharge',
    //                 response: true,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction2);
    //     store.clearActions();
    //     //deselect selectAll
    //     wrapper.find(SelectAllButton).at(2).simulate('click');
    //     expect(store.getActions()).toEqual(expectedAction2);
    // });
    // test.todo('select all and deselecting all shows in build', () => {
    //     const { wrapper } = connectStore();
    //     const rowButtons = wrapper
    //         .find(PhysicalExamRow)
    //         .first()
    //         .find("button[group='General']");
    //     expect(rowButtons).toHaveLength(3);
    //     rowButtons.forEach((button) =>
    //         expect(button.hasClass('green')).toEqual(false)
    //     );
    //     wrapper.find(SelectAllButton).at(0).simulate('click');
    //     //must reselect
    //     const selectedButtons = wrapper
    //         .find(PhysicalExamRow)
    //         .first()
    //         .find("button[group='General']");
    //     selectedButtons.forEach((button) =>
    //         expect(button.hasClass('green')).toEqual(true)
    //     );
    //     //must reselect
    //     wrapper.find(SelectAllButton).at(0).simulate('click');
    //     const deSelectedButtons = wrapper
    //         .find(PhysicalExamRow)
    //         .first()
    //         .find("button[group='General']");
    //     deSelectedButtons.forEach((button) =>
    //         expect(button.hasClass('green')).toEqual(false)
    //     );
    // });
    // // TODO: Fix below tests
    // test('dropdown selection brings up/deletes label and correspoding button', () => {
    //     const { wrapper, store } = connectStore();
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(0);
    //     expect(wrapper.find(Dropdown).first().find('.label')).toHaveLength(0);
    //     wrapper
    //         .find(Dropdown)
    //         .find('div[role="option"]')
    //         .first()
    //         .simulate('click', {
    //             nativeEvent: { stopImmediatePropagation: _.noop },
    //         });
    //     wrapper.update();
    //     expect(wrapper.find(Dropdown).first().find('.label')).toHaveLength(1);
    //     expect(
    //         wrapper.find(Dropdown).first().find('.label').prop('value')
    //     ).toBe('arcus senilis');
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(1);
    //     //delete button and label
    //     wrapper
    //         .find(Dropdown)
    //         .first()
    //         .find('.label')
    //         .find('.delete')
    //         .simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find(Dropdown).first().find('.label')).toHaveLength(0);
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(0);
    //     store.dispatch(deleteNote());
    // });
    // test('dropdown selection buttons toggling works', () => {
    //     const { wrapper, store } = connectStore();
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(0);
    //     //select in dropdown, get button
    //     wrapper
    //         .find(Dropdown)
    //         .find('div[role="option"]')
    //         .first()
    //         .simulate('click', {
    //             nativeEvent: { stopImmediatePropagation: _.noop },
    //         });
    //     wrapper.update();
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(1);
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //             .prop('color')
    //     ).toBe('red');
    //     //deselect
    //     wrapper
    //         .find(LRButton)
    //         .filterWhere((button) => button.prop('content') == 'arcus senilis')
    //         .find('button')
    //         .simulate('click');
    //     wrapper.update();
    //     expect(
    //         wrapper
    //             .find(LRButton)
    //             .filterWhere(
    //                 (button) => button.prop('content') == 'arcus senilis'
    //             )
    //     ).toHaveLength(0);
    //     store.dispatch(deleteNote());
    // });
});
