import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import { createCurrentNoteStore } from 'redux/store';
import { REFLEXES_WIDGET_ACTION } from 'redux/actions/actionTypes';
import ReflexesWidgetItem from './ReflexesWidgetItem';
import { LeftRight } from 'constants/enums';
import { selectReflexesWidgetState } from 'redux/selectors/widgetSelectors/reflexesWidgetSelectors';
import { addReflexesWidgetItem } from 'redux/actions/widgetActions/reflexesWidgetActions';

const fakeId = 'yasa';
const location = 'biceps';
const secondLocation = 'triceps';
const intensityLabel = '0 no response';
const secondIntensityLabel = '4+ clonus';
const mockStore = configureStore([]);

const mountWithMockStore = (
    id = fakeId,
    initStore = {
        physicalExam: {
            ...initialPhysicalExamState,
            widgets: {
                ...initialPhysicalExamState.widgets,
                reflexes: {
                    [id]: {
                        location: '',
                        side: '',
                        intensity: -1,
                    },
                },
            },
        },
    },
    { ...props } = {}
) => {
    const store = mockStore(initStore);
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <ReflexesWidgetItem id={id} {...props} />
            </Provider>
        ),
    };
};

const mountWithRealStore = ({ ...props } = {}) => {
    const store = createCurrentNoteStore();
    store.dispatch(addReflexesWidgetItem());
    const id = Object.keys(selectReflexesWidgetState(store.getState()))[0];
    return mount(
        <Provider store={store}>
            <ReflexesWidgetItem id={id} {...props} />
        </Provider>
    );
};

describe('ReflexesWidgetItem', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithMockStore(fakeId);
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithMockStore(fakeId);
        expect(wrapper).toMatchSnapshot();
    });
});

describe('ReflexesWidgetItem with mock store', () => {
    it('dispatches correct action when toggling location', () => {
        const { store, wrapper } = mountWithMockStore(fakeId);
        wrapper.findWhere((node) => node.key() === location).simulate('click');

        const expectedActions = [
            {
                type: REFLEXES_WIDGET_ACTION.UPDATE_LOCATION,
                payload: {
                    id: fakeId,
                    newLocation: location,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when toggling side', () => {
        const { store, wrapper } = mountWithMockStore(fakeId);
        wrapper.findWhere((node) => node.key() === 'right').simulate('click');

        const expectedActions = [
            {
                type: REFLEXES_WIDGET_ACTION.UPDATE_SIDE,
                payload: {
                    id: fakeId,
                    newSide: LeftRight.Right,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when toggling intensity', () => {
        const { store, wrapper } = mountWithMockStore(fakeId);
        wrapper
            .findWhere((node) => node.key() === intensityLabel)
            .simulate('click');

        const expectedActions = [
            {
                type: REFLEXES_WIDGET_ACTION.UPDATE_INTENSITY,
                payload: {
                    id: fakeId,
                    newIntensity: 0,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when delete button is clicked', () => {
        const { store, wrapper } = mountWithMockStore(fakeId);
        wrapper.find('Button[icon="x"]').simulate('click');

        const expectedActions = [
            {
                type: REFLEXES_WIDGET_ACTION.DELETE_REFLEXES_WIDGET_ITEM,
                payload: {
                    id: fakeId,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('ReflexesWidgetItem with real store', () => {
    it('toggles off previous button when toggling new button', () => {
        const wrapper = mountWithRealStore();

        expect(
            wrapper.findWhere((node) => node.key() === location).prop('color')
        ).toBe(undefined);
        expect(
            wrapper
                .findWhere((node) => node.key() === secondLocation)
                .prop('color')
        ).toBe(undefined);

        wrapper.findWhere((node) => node.key() === location).simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === location).prop('color')
        ).toBe('red');

        wrapper
            .findWhere((node) => node.key() === secondLocation)
            .simulate('click');
        expect(
            wrapper
                .findWhere((node) => node.key() === secondLocation)
                .prop('color')
        ).toBe('red');
        expect(
            wrapper.findWhere((node) => node.key() === location).prop('color')
        ).toBe(undefined);

        expect(
            wrapper.findWhere((node) => node.key() === 'right').prop('color')
        ).toBe(undefined);
        expect(
            wrapper.findWhere((node) => node.key() === 'left').prop('color')
        ).toBe(undefined);

        wrapper.findWhere((node) => node.key() === 'right').simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === 'right').prop('color')
        ).toBe('red');

        wrapper.findWhere((node) => node.key() === 'left').simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === 'left').prop('color')
        ).toBe('red');
        expect(
            wrapper.findWhere((node) => node.key() === 'right').prop('color')
        ).toBe(undefined);

        expect(
            wrapper
                .findWhere((node) => node.key() === intensityLabel)
                .prop('color')
        ).toBe(undefined);
        expect(
            wrapper
                .findWhere((node) => node.key() === secondIntensityLabel)
                .prop('color')
        ).toBe(undefined);

        wrapper
            .findWhere((node) => node.key() === intensityLabel)
            .simulate('click');
        expect(
            wrapper
                .findWhere((node) => node.key() === intensityLabel)
                .prop('color')
        ).toBe('red');

        wrapper
            .findWhere((node) => node.key() === secondIntensityLabel)
            .simulate('click');
        expect(
            wrapper
                .findWhere((node) => node.key() === secondIntensityLabel)
                .prop('color')
        ).toBe('red');
        expect(
            wrapper
                .findWhere((node) => node.key() === intensityLabel)
                .prop('color')
        ).toBe(undefined);
    });

    it('toggles off button when clicked twice', () => {
        const wrapper = mountWithRealStore();

        wrapper.findWhere((node) => node.key() === location).simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === location).prop('color')
        ).toBe('red');
        wrapper.findWhere((node) => node.key() === location).simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === location).prop('color')
        ).toBe(undefined);

        wrapper.findWhere((node) => node.key() === 'right').simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === 'right').prop('color')
        ).toBe('red');
        wrapper.findWhere((node) => node.key() === 'right').simulate('click');
        expect(
            wrapper.findWhere((node) => node.key() === 'right').prop('color')
        ).toBe(undefined);

        wrapper
            .findWhere((node) => node.key() === intensityLabel)
            .simulate('click');
        expect(
            wrapper
                .findWhere((node) => node.key() === intensityLabel)
                .prop('color')
        ).toBe('red');
        wrapper
            .findWhere((node) => node.key() === intensityLabel)
            .simulate('click');
        expect(
            wrapper
                .findWhere((node) => node.key() === intensityLabel)
                .prop('color')
        ).toBe(undefined);
    });
});
