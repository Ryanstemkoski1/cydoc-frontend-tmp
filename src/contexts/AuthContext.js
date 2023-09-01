import { HPIPatientQueryParams } from 'assets/enums/hpi.patient.enums';
import React from 'react';
import { withCookies } from 'react-cookie';

const Context = React.createContext({});

class AuthStore extends React.Component {
    state = {
        user: this.props.cookies.get('user') || null,
        role: this.props.cookies.get('role') || null,
        token: this.props.cookies.get('token') || null,
    };

    /*
    const user = {
            username: "yasab",
            password: "basay",
            email: "yasa@b.aig",
            phoneNumber: "123456789",
            firstName: "Yasab",
            lastName: "Aig",
            workplace: "Duck",
            inPatient: false,
            institutionType: "Yasa",
            address: "Yasa",
            backupEmail: "yasab27@gmail.com",
            role: "The Boss"
        };
    */

    storeLoginInfo = (user, role, token) => {
        this.props.cookies.set('user', user, { path: '/' });
        this.props.cookies.set('role', role, { path: '/' });
        this.props.cookies.set('token', token, { path: '/' });
        this.setState({ user: user, role: role, token: token });
    };

    logOut = () => {
        this.props.cookies.remove('user', { path: '/' });
        this.props.cookies.remove('role', { path: '/' });
        this.props.cookies.remove('token', { path: '/' });
        localStorage.removeItem(HPIPatientQueryParams.CLINICIAN_ID);
        localStorage.removeItem(HPIPatientQueryParams.INSTITUTION_ID);
        this.setState({ user: null, role: null, token: null });
    };

    render = () => {
        return (
            <Context.Provider
                value={{
                    ...this.state,
                    storeLoginInfo: this.storeLoginInfo,
                    logOut: this.logOut,
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    };
}
const AuthStoreCookies = withCookies(AuthStore);
export { AuthStoreCookies as AuthStore };
export default Context;
