import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import EditProfile from '../pages/Account/EditProfile';
import AuthContext from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const initialState = {
    patientView: false,
    doctorView: true,
    userSurvey: {},
};

const testUser = {
    user: {
        _id: '5e1bf03333dde9658ac24012',
        username: 'yasab',
        role: 'doctor',
        firstName: 'Yasab',
        middleName: '',
        lastName: 'Aig',
        email: 'yasa@b.aig',
        phoneNumber: '1234567890',
        birthday: '10/23/1999',
        isStudent: 'false',
        workplace: 'Duck',
        inPatient: 'No?',
        institutionType: 'Yasa',
        address: 'Yasa',
        backupEmail: 'yasab27@gmail.com',
    },
    role: 'doctor',
    email: 'yasa@b.aig',
};

const setup = (context, state = initialState) => {
    const store = mockStore({ userView: state });
    return {
        store: store,
        wrapper: mount(
            <BrowserRouter>
                <Provider store={store}>
                    <AuthContext.Provider value={context}>
                        <EditProfile />
                    </AuthContext.Provider>
                </Provider>
            </BrowserRouter>
        ),
    };
};

test('renders without crashing', () => {
    const wrapper = setup(testUser);
    expect(wrapper).toBeTruthy();
});
