import React, { Component, Fragment } from 'react';
import { Dropdown, Header, Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import AuthContext from "../../contexts/AuthContext";
import HPIContext from 'contexts/HPIContext.js';
import { DEFAULT_NAV_MENU_MOBILE_BP, LOGGEDIN_NAV_MENU_MOBILE_BP } from "constants/breakpoints.js";
import 'components/navigation/NavMenu.css';

//Navigation Bar component that will go at the top of most pages
class ConnectedNavMenu extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        const collapseDefaultNav = windowWidth < DEFAULT_NAV_MENU_MOBILE_BP;
        const collapseLoggedInNav = windowWidth < LOGGEDIN_NAV_MENU_MOBILE_BP;

        return (
            <Menu secondary borderless className="nav-menu" attached={this.props.attached}>
                <Menu.Item as={Link} to="/home">
                    <Header as="h2">
                        cydoc
                    </Header>
                </Menu.Item>
                <Menu.Menu position="right">
                    {/* Menu will have different options depending on whether the user is logged in or not */}
                    {this.context.token ?
                        <LoggedInMenuItems
                            handleLogout={this.context.logOut}
                            name={this.context.user.firstName}
                            collapseNav={collapseLoggedInNav} /> :
                        <DefaultMenuItems collapseNav={collapseDefaultNav} />}
                </Menu.Menu>
            </Menu>
        );
    }
};

const NavMenu = ConnectedNavMenu;
export default NavMenu;

NavMenu.propTypes = {
    // optional prop for stacking another menu above/below
    attached: PropTypes.string
};

//Functional component for menu items that show when user is not logged in
function DefaultMenuItems(props) {
    return props.collapseNav ?
        (<Menu.Item>
            <Dropdown icon="large bars">
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} name="about" to="/about" text="About" />
                    <Dropdown.Item as={Link} name="login" to="/login" text="Login" />
                    <Dropdown.Item as={Link} name="register" to="/register" text="Register" />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
        ) : (
            <Fragment>
                <Menu.Item as={Link} name="about" to="/about" text="About" />
                <Menu.Item as={Link} name="login" to="/login" text="Login" />
                <Menu.Item as={Link} name="register" to="/register" text="Register" />
            </Fragment>
        );
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return props.collapseNav ?
        (<Menu.Item>
            <Dropdown icon="large bars">
                <Dropdown.Menu>
                    <HPIContext.Consumer>
                        {value =>
                            value._id !== null ?
                                <Dropdown.Item as={Link} name="editNote" to="/editnote" text={`Edit Note (${value.title})`} /> :
                                null
                        }
                    </HPIContext.Consumer>
                    <Dropdown.Item as={Link} name="createTemplate" to="/creategraph" text="Create Template" />
                    <Dropdown.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />
                    <Dropdown.Item as={Link} name="welcome" to="/dashboard">
                        Welcome, {props.name}
                        <Icon name="user" className="user-icon" />
                    </Dropdown.Item>
                    <Dropdown.Item name="logout" href="/login" text="Logout" onClick={props.handleLogout} />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
        ) : (
            <Fragment>
                <HPIContext.Consumer>
                    {value =>
                        value._id !== null ?
                            <Menu.Item as={Link} name="editNote" to="/editnote" text={`Edit Note (${value.title})`} /> :
                            null
                    }
                </HPIContext.Consumer>
                <Menu.Item as={Link} name="createTemplate" to="/creategraph" text="Create Template" />
                <Menu.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />
                <Menu.Item as={Link} name="welcome" to="/dashboard">
                    Welcome, {props.name}
                    <Icon name="user" className="user-icon" />
                </Menu.Item>
                <Menu.Item name="logout" href="/login" text="Logout" onClick={props.handleLogout} />
            </Fragment>
        );
}