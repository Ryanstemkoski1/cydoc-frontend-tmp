import React, {Component, Fragment} from 'react';
import {Dropdown, Header, Icon, Menu} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import "../content/hpi/knowledgegraph/src/css/App.css";
import AuthContext from "../contexts/AuthContext";
import {DEFAULT_NAV_MENU_MOBILE_BP, LOGGEDIN_NAV_MENU_MOBILE_BP} from "../constants/breakpoints.js";
import "../../css/components/navMenu.css";

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
                    <Menu.Item href="/home">
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
function DefaultMenuItems() {
    return <Fragment>
        <a> <Menu.Item name="create_note">
            <Link to={"/login"}>Create Note</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="about">
            <Link to={"/about"}>About</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="login">
            <Link to={"/login"}>Login</Link>
        </Menu.Item></a>
        <a> <Menu.Item name="register">
            <Link to={"/register"}>Register</Link>
        </Menu.Item></a>
    </Fragment>;
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return <Fragment>
        <a> <Menu.Item name="create_note">
            <Link to={"/editnote"}>Edit Note</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="about">
            <Link to={"/creategraph"}>Create Template</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="login">
            <Link to={"/dashboard"}>My Notes</Link>
        </Menu.Item></a>
        <a><Menu.Item name="register">
            <Link to={"/dashboard"}>Welcome, {props.name}</Link>
            <Icon name="user" style={{marginLeft: "7px"}}/>
        </Menu.Item></a>
        <a> <Menu.Item name={"logout"} onClick={props.handleLogout}>
            <Link to={"/login"}>Logout</Link>
        </Menu.Item></a>
    </Fragment>;
}