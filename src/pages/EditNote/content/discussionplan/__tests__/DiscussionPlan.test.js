import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import DiscussionPlan from '../DiscussionPlan';
import DiscussionPlanMenu from '../DiscussionPlanMenu';
import DiscussionPlanSurvey from '../DiscussionPlanSurvey';
import DifferentialDiagnosisForm from '../forms/DifferentialDiagnosesForm';
import { BaseCategoryForm } from '../forms/BaseCategoryForm';
import { conditionId, initialPlan } from '../util';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (discussionPlan = initialPlan) => {
    const store = mockStore({ discussionPlan });
    return mount(
        <Provider store={store}>
            <DiscussionPlan />
        </Provider>
    );
};

describe('DiscussionPlan Integration', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render 4 form sections if length of conditions is greater than 0', () => {
        const sections = mountWithStore().find(BaseCategoryForm);
        expect(sections).toHaveLength(4);
    });

    it('should not render form sections if length of conditions is 0', () => {
        const wrapper = mountWithStore({
            conditions: {},
            survey: initialPlan.survey,
        });

        const sections = wrapper.find(BaseCategoryForm);
        expect(sections).toHaveLength(0);

        // Survey and menu should render regardless
        expect(wrapper.find(DiscussionPlanMenu)).toBeTruthy();
        expect(wrapper.find(DiscussionPlanSurvey)).toBeTruthy();
    });

    it('initializes conditionId to first condition on first render', () => {
        const plan = {
            ...initialPlan,
            conditions: {
                ...initialPlan.conditions,
                foo: { ...initialPlan.conditions[conditionId] },
            },
        };
        const wrapper = mountWithStore(plan);
        expect(
            wrapper.find(DifferentialDiagnosisForm).prop('conditionId')
        ).toEqual(conditionId);
        expect(wrapper.find(DiscussionPlanMenu).prop('index')).toEqual(0);
    });

    it('updates conditionId and index when tab is clicked', async () => {
        const id = 'foo';
        const wrapper = mountWithStore({
            ...initialPlan,
            conditions: {
                ...initialPlan.conditions,
                [id]: { ...initialPlan.conditions[conditionId] },
            },
        });
        wrapper.find(`a[uuid="${id}"]`).simulate('click');
        wrapper.update();
        expect(
            wrapper.find(DifferentialDiagnosisForm).prop('conditionId')
        ).toEqual(id);
        expect(wrapper.find(DiscussionPlanMenu).prop('index')).toEqual(1);
    });
});
