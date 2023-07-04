import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AbdomenExamButtons from './AbdomenExamButtons';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { AbdomenWidgetState } from 'redux/reducers/widgetReducers/abdomenWidgetReducer';
import { ABDOMEN_WIDGET_ACTION } from 'redux/actions/actionTypes';
import { currentNoteStore } from 'redux/store';

const section = 'rightUpperQuadrant';
const field = 'tenderness';
const mockStore = configureStore([]);

const mountWithMockStore = (
    initStore = {
        physicalExam: initialPhysicalExamState,
    },
    abdomenQuadrant: keyof AbdomenWidgetState = section,
    { ...props } = {}
) => {
    const store = mockStore(initStore);
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <AbdomenExamButtons
                    abdomenQuadrant={abdomenQuadrant}
                    {...props}
                />
            </Provider>
        ),
    };
};

const mountWithRealStore = (
    abdomenQuadrant: keyof AbdomenWidgetState = section,
    { ...props } = {}
) => {
    return mount(
        <Provider store={currentNoteStore}>
            <AbdomenExamButtons abdomenQuadrant={abdomenQuadrant} {...props} />
        </Provider>
    );
};

describe('AbdomenExamButtons', () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        ({ wrapper } = mountWithMockStore());
    });

    it('renders without crashing', () => {
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});

describe('AbdomenExamButtons with mock store', () => {
    it('dispatches correct action when clicking an option', () => {
        const { store, wrapper } = mountWithMockStore();
        wrapper.findWhere((node) => node.key() === field).simulate('click');

        const expectedActions = [
            {
                type: ABDOMEN_WIDGET_ACTION.TOGGLE_ABDOMEN_WIDGET_SECTION,
                payload: {
                    section,
                    field,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('AbdomenExamButtons with real store', () => {
    let wrapper: ReactWrapper;
    const findButton = (key: string) =>
        wrapper.findWhere((node) => node.key() === key);

    beforeEach(() => {
        wrapper = mountWithRealStore();
    });

    it('changes button color after being clicked', () => {
        expect(findButton(field).prop('color')).toBe(undefined);

        findButton(field).simulate('click');
        expect(findButton(field).prop('color')).toBe('red');

        findButton(field).simulate('click');
        expect(findButton(field).prop('color')).toBe(undefined);
    });
});
