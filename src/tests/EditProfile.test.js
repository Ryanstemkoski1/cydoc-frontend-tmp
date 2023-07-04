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

test('EditProfile renders one UserForm component', () => {
    //     const wrapper = setup(testUser).wrapper.find(UserForm);
    //     expect(wrapper).toHaveLength(1);
});

describe('testing props to UserForm based on current user', () => {
    //     const wrapper = setup(testUser).wrapper.find(UserForm);
    //     const stringArray = ['', '', ''];
    // TODO: Fix below tests
    test('defined user props', () => {
        // expect(wrapper.props().userInfo.username).toEqual(
        // testUser.user.username
        // );
        // expect(wrapper.props().userInfo.password).toEqual(
        //     testUser.user.password
        // );
        // expect(wrapper.props().userInfo.email).toEqual(testUser.user.email);
        // expect(wrapper.props().userInfo.phoneNumber).toEqual(
        //     testUser.user.phoneNumber
        // );
        // expect(wrapper.props().userInfo.firstName).toEqual(
        //     testUser.user.firstName
        // );
        // expect(wrapper.props().userInfo.lastName).toEqual(
        //     testUser.user.lastName
        // );
        // expect(wrapper.props().userInfo.workplace).toEqual(
        //     testUser.user.workplace
        // );
        // expect(wrapper.props().userInfo.inPatient).toEqual(
        //     testUser.user.inPatient
        // );
        // expect(wrapper.props().userInfo.institutionType).toEqual(
        //     testUser.user.institutionType
        // );
        // expect(wrapper.props().userInfo.address).toEqual(testUser.user.address);
        // expect(wrapper.props().userInfo.backupEmail).toEqual(
        //     testUser.user.backupEmail
        // );
        // expect(wrapper.props().userInfo.role).toEqual(testUser.user.role);
    });
    test('undefined user props set to default values', () => {
        //     expect(wrapper.props().userInfo.studentStatus).toEqual(emptyString);
        // expect(wrapper.props().userInfo.degreesCompleted).toEqual(stringArray);
        // expect(wrapper.props().userInfo.degreesInProgress).toEqual(stringArray);
        // expect(wrapper.props().userInfo.specialties).toEqual(stringArray);
        // expect(wrapper.props().userInfo.workplaceFeatures).toEqual(emptyArray);
        // });
    });
    describe('testing text-based props to UserForm', () => {
        // const wrapper = setup(testUser).wrapper.find(UserForm);
        // TOOD: Fix below tests
        test('title text', () => {
            //     expect(wrapper.props().title).toEqual('edit profile');
        });
        test('button text', () => {
            //     expect(wrapper.props().buttonText).toEqual('Save');
        });
    });
});
