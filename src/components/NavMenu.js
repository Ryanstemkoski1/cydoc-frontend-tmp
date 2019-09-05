import React, {Component} from 'react';
import { Container, Menu, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class NavMenu extends Component {
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
                    </Menu.Menu>
                </Container>
            </Menu>
        );
    }
};

NavMenu.propTypes = {
  attached: PropTypes.string
};