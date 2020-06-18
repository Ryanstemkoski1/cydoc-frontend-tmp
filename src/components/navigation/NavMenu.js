import React, { Component, Fragment } from 'react';
import { Dropdown, Menu, Image} from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import AuthContext from "../../contexts/AuthContext";
import { DEFAULT_NAV_MENU_MOBILE_BP, LOGGEDIN_NAV_MENU_MOBILE_BP } from "constants/breakpoints.js";
import LogoLight from '../../assets/logo-light.png'
import './NavMenu.css'

// Navigation Bar component that will go at the top of most pages
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
            <div>
                <Menu className={this.props.className + " nav-menu"} attached={this.props.attached}>
                    {/* Logo item */}
                    <Menu.Item>
                        <Image className="nav-menu-logo-container" href='/home' src={LogoLight} />
                    </Menu.Item>

                    {/* Navigation links */}
                    <Menu.Menu secondary position="right" style={{ margin : '10px 0 10px',}}>
                        {/* Menu will have different options depending on whether the user is logged in or not */}
                        {this.context.token ?
                            <LoggedInMenuItems
                                handleLogout={this.context.logOut}
                                name={this.context.user.firstName}
                                collapseNav={collapseLoggedInNav} /> :
                            <DefaultMenuItems collapseNav={collapseDefaultNav} />}
                    </Menu.Menu>
                </Menu>
            </div>

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
                <Dropdown>
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
                        {/*<HPIContext.Consumer>*/}
                        {/*    {value =>*/}
                        {/*        value._id !== null ?*/}
                        {/*            <Dropdown.Item as={Link} name="editNote" to="/editnote" text={`Edit Note (${value.title})`} /> :*/}
                        {/*            null*/}
                        {/*    }*/}
                        {/*</HPIContext.Consumer>*/}
                        <Dropdown.Item name="welcome" style={{color: '#6DA3B1', fontStyle: 'italic', fontWeight: 'light'}}>
                            Welcome, {props.name}
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} name="createTemplate" to="/creategraph" text="Create Template" />
                        <Dropdown.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />

                        <Dropdown.Item name="logout" href="/login" text="Logout" onClick={props.handleLogout} />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        ) : (
            <>
                {/*<HPIContext.Consumer>*/}
                {/*    {value =>*/}
                {/*        value._id !== null ?*/}
                {/*            <Menu.Item as={Link} name="editNote" to="/editnote" text={`Edit Note (${value.title})`} /> :*/}
                {/*            null*/}
                {/*    }*/}
                {/*</HPIContext.Consumer>*/}
                <Menu.Item name="welcome" style={{color: '#6DA3B1', fontStyle: 'italic', fontWeight: 'normal'}}>
                    Welcome, {props.name}
                </Menu.Item>
                <Menu.Item as={Link} name="createTemplate" to="/creategraph" text="Create Template" />
                <Menu.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />

                <Menu.Item name="logout" href="/login" text="Logout" onClick={props.handleLogout} style={{color: '#DB2828'}}/>
            </>
        );
}