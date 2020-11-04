import React, { Component, Fragment } from 'react';
import {Dropdown, Menu, Image, Icon, Button, Input, Container} from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

import { DEFAULT_NAV_MENU_MOBILE_BP, LOGGEDIN_NAV_MENU_MOBILE_BP } from "constants/breakpoints.js";
import HPIContext from 'contexts/HPIContext.js';
import AuthContext from "../../contexts/AuthContext";
import LogoLight from '../../assets/logo-light.png'
import LogoName from '../../assets/logo-name.png'
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

                    {/* Logo Image - display icon when tabs not collapsed, and brand name when collpased. */}
                    {/* Only logo image is displayed when the note name must be shown next to it */}
                    <Menu.Item>
                        {this.props.displayNoteName && collapseLoggedInNav?
                            null :
                            <Image className="nav-menu-logo" href='/home' src={LogoLight} />
                        }
                        {this.props.displayNoteName ?
                            null :
                            <Image className="nav-menu-brand" size='small' href='/home' src={LogoName} />
                        }
                    </Menu.Item>

                    {/* When parent is EditNote, then display the note name item */}
                    {this.props.displayNoteName ?  <NoteNameMenuItem /> : null}

                    {/* Navigation links */}
                    <Menu.Menu position="right">
                        {/* Menu will have different options depending on whether the user is logged in or not */}
                        {this.context.token ?
                            <LoggedInMenuItems
                                handleLogout={this.context.logOut}
                                name={this.context.user.firstName}
                                collapseNav={collapseLoggedInNav} />
                            :
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
    attached: PropTypes.string,
    // optional prop for whether to display or hide hte note name menu item
    displayNoteName: PropTypes.bool
};


// class component that displays and changes note name
// shown only if parent is EditNote.
class NoteNameMenuItem extends Component {

    static contextType = HPIContext

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        this.context.onContextChange("title", event.target.value)
    }

    render () {
        return (
            <Menu.Item className="note-name-menu-item">
                <HPIContext.Consumer>
                    {value =>
                        <>
                            <Input
                                size="huge"
                                transparent
                                placeholder="Untitled Note"
                                onChange={this.handleInputChange}
                                onFocus={()=>{
                                    if (this.context.title === "Untitled Note") {
                                        this.context.onContextChange("title", "")
                                    }
                                }}
                                onBlur={()=>{
                                    this.setState({isTitleFocused: false})
                                    if (this.context.title === '') {
                                        this.context.onContextChange("title", "Untitled Note")
                                    }
                                }}
                                value={this.context.title}
                            />
                            <Button basic onClick={this.context.saveNote} className="save-button">
                                Save
                            </Button>
                        </>
                    }

                </HPIContext.Consumer>
            </Menu.Item>
        )
    }

}

// Functional component for menu items that show when user is not logged in
function DefaultMenuItems(props) {
    return props.collapseNav ?
        (<Menu.Item>
                <Dropdown icon="large bars" className='collapsed-dropdown'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} name="about" to="/about" text="About" />
                        <Dropdown.Item as={Link} name="login" to="/login" text="Login" />
                        <Dropdown.Item as={Link} name="register" to="/register" text="Sign Up" />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        ) : (
            <Fragment>
                <Menu.Item as={Link} name="about" to="/about" text="About" />
                <Menu.Item>
                    <Button.Group>
                        <Button as={Link} basic color={"teal"} name="login" to="/login" text="Login" >Login</Button>
                        <Button as={Link} color={"teal"} name="register" to="/register" text="Sign Up" >Sign Up</Button>
                    </Button.Group>
                </Menu.Item>

            </Fragment>
        );
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return (props.collapseNav ? (
            // (<Menu.Item>
            //         <Dropdown icon="large bars">
            //             <Dropdown.Menu>
            //                 <Dropdown.Item name="welcome" style={{color: '#6DA3B1', fontStyle: 'italic', fontWeight: 'light'}}>
            //                     {props.name}
            //                 </Dropdown.Item>
            //                 <Dropdown.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />
            //
            //                 <Dropdown.Item name="logout" href="/home" text="Logout" onClick={props.handleLogout} />
            //             </Dropdown.Menu>
            //         </Dropdown>
            //     </Menu.Item>
            <>
                <Menu.Item>

                    <Button.Group>
                        <Button as={Link} name="myNotes" to="/dashboard" text="My Notes" >
                            <Icon name="sticky note outline" className='collapsed-icon'/>
                        </Button>
                        <Button name="logout" href="/home" text="Logout" onClick={props.handleLogout} className='logout-button'>
                            <Icon name="sign out alternate" className='collapsed-icon'/>
                        </Button>
                    </Button.Group>
                </Menu.Item>
            </>
        ) : (
            <>
                <Menu.Item>
                    <Button.Group>
                        <Button as={Link} name="myNotes" to="/dashboard" text="My Notes" >My Notes</Button>
                        <Button name="logout" href="/home" text="Logout" onClick={props.handleLogout} style={{color: '#FC4F56'}}>Log Out</Button>
                    </Button.Group>
                </Menu.Item>
                <Menu.Item name="welcome" style={{color: '#6DA3B1', fontWeight: 'normal'}}>
                    <Icon name="user outline" /> {props.name}
                </Menu.Item>
            </>
        )
    );
}

