import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import EditProfile from '../pages/Account/EditProfile';
import AuthContext from '../contexts/AuthContext';
// import UserForm from '../pages/Account/UserForm';
import { BrowserRouter } from 'react-router-dom';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const testUser = {
    user: {
        _id: '5e1bf03333dde9658ac24012',
        username: 'yasab',
        password: 'basay',
        email: 'yasa@b.aig',
        phoneNumber: '1234567890',
        firstName: 'Yasab',
        lastName: 'Aig',
        workplace: 'Duck',
        inPatient: 'No?',
        institutionType: 'Yasa',
        address: 'Yasa',
        backupEmail: 'yasab27@gmail.com',
        role: 'doctor',
    },
};

const setup = (context) => {
    return mount(
        <BrowserRouter>
            <AuthContext.Provider value={context}>
                <EditProfile />
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

test('renders without crashing', () => {
    const wrapper = setup(testUser);
    expect(wrapper).toBeTruthy();
});

test('EditProfile renders one UserForm component', () => {
    // const wrapper = setup(testUser).find(UserForm);
    // expect(wrapper).toHaveLength(1);
});

describe('testing props to UserForm based on current user', () => {
    // const wrapper = setup(testUser).find(UserForm);
    // const emptyString = '';
    // const stringArray = ['', '', ''];
    // const emptyArray = [];
    // // TODO: Fix below tests
    // test('defined user props', () => {
    //     expect(wrapper.props().username).toEqual(testUser.user.username);
    //     expect(wrapper.props().password).toEqual(testUser.user.password);
    //     expect(wrapper.props().email).toEqual(testUser.user.email);
    //     expect(wrapper.props().phoneNumber).toEqual(testUser.user.phoneNumber);
    //     expect(wrapper.props().firstName).toEqual(testUser.user.firstName);
    //     expect(wrapper.props().lastName).toEqual(testUser.user.lastName);
    //     expect(wrapper.props().workplace).toEqual(testUser.user.workplace);
    //     expect(wrapper.props().inPatient).toEqual(testUser.user.inPatient);
    //     expect(wrapper.props().institutionType).toEqual(
    //         testUser.user.institutionType
    //     );
    //     expect(wrapper.props().address).toEqual(testUser.user.address);
    //     expect(wrapper.props().backupEmail).toEqual(testUser.user.backupEmail);
    //     expect(wrapper.props().role).toEqual(testUser.user.role);
    // });
    // test('undefined user props set to default values', () => {
    //     expect(wrapper.props().studentStatus).toEqual(emptyString);
    //     expect(wrapper.props().degreesCompleted).toEqual(stringArray);
    //     expect(wrapper.props().degreesInProgress).toEqual(stringArray);
    //     expect(wrapper.props().specialties).toEqual(stringArray);
    //     expect(wrapper.props().workplaceFeatures).toEqual(emptyArray);
    // });
});

describe('testing text-based props to UserForm', () => {
    // const wrapper = setup(testUser).find(UserForm);
    // // TOOD: Fix below tests
    // test('title text', () => {
    //     expect(wrapper.props().title).toEqual('edit profile');
    // });
    // test('button text', () => {
    //     expect(wrapper.props().buttonText).toEqual('Save');
    // });
});
