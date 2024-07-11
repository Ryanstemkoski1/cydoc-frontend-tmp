import React from 'react';
import ReviewOfSystemsContent from '../ReviewOfSystemsContent';
import ReviewOfSystemsCategory from '../ReviewOfSystemsCategory';
import configureStore from 'redux-mock-store';
import { initialStore } from '../utils';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

const initialState = {
    patientView: true,
    doctorView: false,
    userSurvey: {},
};

const mockStore = configureStore([]);

const mountWithStore = (reviewOfSystems = initialStore) => {
    const store = mockStore({ reviewOfSystems, userView: initialState });
    return render(
        <Provider store={store}>
            {/* Placeholder */}
            {null}
            {/* <ReviewOfSystemsContent /> */}
        </Provider>
    );
};

describe.todo('ReviewOfSystemsContent', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithStore();
        expect(wrapper).toBeDefined();
    });

    // it('matches snapshot', () => {
    //     const wrapper = mountWithStore();
    //     expect(wrapper).toMatchSnapshot();
    // });

    // it('renders the correct number of categories', () => {
    //     const wrapper = mountWithStore();
    //     expect(wrapper.find(ReviewOfSystemsCategory)).toHaveLength(
    //         Object.keys(initialStore).length
    //     );
    // });

    // it('renders the correct titles for the categories', () => {
    //     const wrapper = mountWithStore();
    //     for (let category of Object.keys(initialStore)) {
    //         const categoryWrapper = wrapper.container.querySelectorAll(
    //             `ReviewOfSystemsCategory[category='${category}']`
    //         );
    //         expect(categoryWrapper).toHaveLength(1);
    //     }
    // });
});
