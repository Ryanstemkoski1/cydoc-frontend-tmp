import { act } from 'react';
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
        let wrapper;

        act(() => {
            wrapper = mountWithStore();
        });
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', async () => {
        let wrapper;

        act(() => {
            wrapper = mountWithStore();
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
            wrapper.update();
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('should render 4 form sections if length of conditions is greater than 0', async () => {
        let wrapper;

        act(() => {
            wrapper = mountWithStore();
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
            wrapper.update();
        });

        const sections = wrapper.find(BaseCategoryForm);
        expect(sections).toHaveLength(4);
    });

    it('should not render form sections if length of conditions is 0', () => {
        let wrapper;

        act(() => {
            wrapper = mountWithStore({
                conditions: {},
                survey: initialPlan.survey,
            });
        });

        const sections = wrapper.find(BaseCategoryForm);
        expect(sections).toHaveLength(0);

        // Survey and menu should render regardless
        expect(wrapper.find(DiscussionPlanMenu)).toBeTruthy();
        expect(wrapper.find(DiscussionPlanSurvey)).toBeTruthy();
    });

    it('initializes conditionId to first condition on first render', async () => {
        const plan = {
            ...initialPlan,
            conditions: {
                ...initialPlan.conditions,
                foo: { ...initialPlan.conditions[conditionId] },
            },
        };
        let wrapper;

        act(() => {
            wrapper = mountWithStore(plan);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
            wrapper.update();
        });

        expect(
            wrapper.find(DifferentialDiagnosisForm).prop('conditionId')
        ).toEqual(conditionId);
        expect(wrapper.find(DiscussionPlanMenu).prop('index')).toEqual(0);
    });

    it('updates conditionId and index when tab is clicked', async () => {
        const id = 'foo';
        let wrapper;

        act(() => {
            wrapper = mountWithStore({
                ...initialPlan,
                conditions: {
                    ...initialPlan.conditions,
                    [id]: { ...initialPlan.conditions[conditionId] },
                },
            });
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
            wrapper.update();
        });

        wrapper.find(`a[uuid="${id}"]`).simulate('click');

        // Make assertions outside of act
        expect(
            wrapper.find(DifferentialDiagnosisForm).prop('conditionId')
        ).toEqual(id);
        expect(wrapper.find(DiscussionPlanMenu).prop('index')).toEqual(1);
    });
});
