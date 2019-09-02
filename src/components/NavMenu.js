import React, {Component} from 'react';
import { Container, Menu, Button } from 'semantic-ui-react';

export default class NavMenu extends Component {
    render() {
        return (
            <Menu secondary borderless>
                <Container>
                    <Menu.Item header href="/home">
                        cydoc
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item name="create_note">
                            <Button primary href='/createnote'>Create Note</Button>
                        </Menu.Item>
                        <Menu.Item name="about">
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