import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import { AuthProvider } from 'providers/AuthProvider';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NavMenu from '../NavMenu';
import NoteNameMenuItem from '../NoteNameMenuItem';

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

const initialState = {
    patientView: true,
    doctorView: false,
    userSurvey: {},
};

const connectStore = (props, state = initialState) => {
    const store = mockStore({ userView: state });
    props = {
        className: '',
        attached: 'top',
        displayNoteName: false,
        ...props,
    };
    return {
        store,
        wrapper: mount(
            // <Router>
            <Provider store={store}>
                <AuthProvider>
                    <NavMenu {...props} />
                </AuthProvider>
            </Provider>
            // </Router>
        ),
    };
};

describe('NavMenu', () => {
    it('renders without crashing', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
    });
    it('matches snapshot', () => {
        const { wrapper } = connectStore();
        expect(wrapper.html()).toMatchSnapshot();
    });
    it('does not render note name outside of editnote', () => {
        const { wrapper } = connectStore();
        expect(wrapper.find(NoteNameMenuItem)).toHaveLength(0);
    });
    it('does not render note name when directed if in patient view', () => {
        const { wrapper } = connectStore({ displayNoteName: true });
        expect(wrapper.find(NoteNameMenuItem)).toHaveLength(0);
    });

    it('renders note name when directed if in doctor view', () => {
        const { wrapper } = connectStore(
            { displayNoteName: true },
            { ...initialState, doctorView: true }
        );
        expect(wrapper.find(NoteNameMenuItem)).toHaveLength(0);
    });
});
