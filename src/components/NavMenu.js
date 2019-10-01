import React, {Component, Fragment} from 'react';
import {Container, Header, Icon, Menu} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {logout} from "../js/actions";
import {connect} from "react-redux";

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    };
}

//Navigation Bar component that will go at the top of most pages
class ConnectedNavMenu extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            isLoggedIn: true
        }
    }

    handleLogout(){
        this.props.logout();
    }

    render() {
        const user = "Isabella";
        return (
            <Menu secondary borderless style={{height: "10vh", borderColor: "white"}} attached={this.props.attached}>
                <Container>
                    <Menu.Item href="/home">
                        <Header as="h2">
                            cydoc
                        </Header>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        {/* Menu will have different options depending on whether the user is logged in or not */}
                        {localStorage.getItem('user') ? <LoggedInMenuItems handleLogout={this.handleLogout} user={user}/> : <DefaultMenuItems/>}
                    </Menu.Menu>
                </Container>
            </Menu>
        );
    }
    };

const NavMenu = connect(null, mapDispatchToProps)(ConnectedNavMenu);
export default NavMenu;

NavMenu.propTypes = {
    // optional prop for stacking another menu above/below
    attached: PropTypes.string
};

//Functional component for menu items that show when user is not logged in
function DefaultMenuItems() {
    return <Fragment>
        <Menu.Item name="create_note" href="/createnote">
            Create Note
        </Menu.Item>
        <Menu.Item name="about" href="/about">
            About
        </Menu.Item>
        <Menu.Item name="login" href="/login">
            Login
        </Menu.Item>
        <Menu.Item name="register" href="/login">
            Register
        </Menu.Item>
    </Fragment>;
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return <Fragment>
        <Menu.Item name="create_note" href="/createnote">
            Create Note
        </Menu.Item>
        <Menu.Item name="about" href="/dashboard">
            Create Template
        </Menu.Item>
        <Menu.Item name="login" href="/dashboard">
            Load Note
        </Menu.Item>
        <Menu.Item name="register" href="/dashboard">
            Welcome, {props.user}
            <Icon name="user" style={{marginLeft: "7px"}}/>
        </Menu.Item>
        <Menu.Item name={"logout"} href={'/login'} onClick={props.handleLogout}>
            Logout
        </Menu.Item>
    </Fragment>;
}