import React, {Component, Fragment} from 'react';
import {Container, Header, Icon, Menu} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {logout} from "../actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import "../content/hpi/knowledgegraph/src/css/App.css";
import AuthContext from "../contexts/AuthContext";

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    };
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        user: state.user
    };
};


//Navigation Bar component that will go at the top of most pages
class ConnectedNavMenu extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
        this.props.logout();
    }

    render() {

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
                        {this.context.token ?
                            <LoggedInMenuItems handleLogout={this.handleLogout}
                                               name={this.context.user.firstName}/> :
                            <DefaultMenuItems/>}
                    </Menu.Menu>
                </Container>
            </Menu>
        );
    }
    };

const NavMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedNavMenu);
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
            <Link to={"/login"}>Register</Link>
        </Menu.Item></a>
    </Fragment>;
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return <Fragment>
        <a> <Menu.Item name="create_note">
            <Link to={"/editnote"}>Create Note</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="about">
            <Link to={"/creategraph"}>Create Template</Link>
        </Menu.Item> </a>
        <a> <Menu.Item name="login">
            <Link to={"/dashboard"}>Load Note</Link>
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