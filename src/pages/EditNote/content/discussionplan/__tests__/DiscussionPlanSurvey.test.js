import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import DiscussionPlanSurvey from '../DiscussionPlanSurvey';
import configureStore from 'redux-mock-store';
import { initialPlan } from '../util';
import { Provider } from 'react-redux';
import { PLAN_ACTION as TYPES } from 'redux/actions/actionTypes';
import { YesNoUncertainResponse } from 'constants/enums';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (discussionPlan = initialPlan) => {
    const store = mockStore({ discussionPlan });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <DiscussionPlanSurvey />
            </Provider>
        ),
    };
};

describe('DiscussionPlanSurvey', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('dispatches action with correct value on sicknessLevel update', () => {
        const { store, wrapper } = mountWithStore();
        wrapper.find('input[type="range"]').simulate('change', {
            target: { value: '7' },
        });

        const expectedActions = [
            {
                type: TYPES.UPDATE_SICKNESS_LEVEL,
                payload: {
                    newSicknessLevel: 7,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches action with correct value on emergency update', () => {
        const { store, wrapper } = mountWithStore();

        wrapper
            .findWhere(
                (node) => node.type() === 'button' && node.text() === 'Yes'
            )
            .first()
            .simulate('click');

        const expectedActions = [
            {
                type: TYPES.UPDATE_EMERGENCY,
                payload: {
                    newEmergency: YesNoUncertainResponse.Yes,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches action with correct value on admit to hospital update', () => {
        const { store, wrapper } = mountWithStore();

        wrapper
            .findWhere(
                (node) => node.type() === 'button' && node.text() === 'Yes'
            )
            .last()
            .simulate('click');

        const expectedActions = [
            {
                type: TYPES.UPDATE_ADMIT_TO_HOSPITAL,
                payload: {
                    newAdmitToHospital: YesNoUncertainResponse.Yes,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('renders survey according to current values', () => {
        const { wrapper } = mountWithStore({
            ...initialPlan,
            survey: {
                sicknessLevel: 7,
                emergency: YesNoUncertainResponse.No,
                admitToHospital: YesNoUncertainResponse.Yes,
            },
        });

        expect(wrapper.find('input[type="range"]').prop('value')).toEqual(7);
        expect(
            wrapper
                .findWhere(
                    (node) => node.type() === 'button' && node.text() === 'No'
                )
                .first()
                .hasClass('active')
        ).toBeTruthy();
        expect(
            wrapper
                .findWhere(
                    (node) => node.type() === 'button' && node.text() === 'Yes'
                )
                .last()
                .hasClass('active')
        ).toBeTruthy();
    });
});
