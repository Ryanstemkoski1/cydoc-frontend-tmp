import React from 'react';
import { Container, Image, Menu, Button } from 'semantic-ui-react';
export default () => (
    <Menu borderless>   
        <Container>
            <Menu.Item header>
                cydoc
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item  name="create_note">
                    <Button primary>Create Note</Button>
                </Menu.Item>
                <Menu.Item name="about">
                    About
                </Menu.Item>
                <Menu.Item name="login">
                    Login
                </Menu.Item>
                <Menu.Item name="register">
                    Register
                </Menu.Item>
            </Menu.Menu>
        </Container>
    </Menu>
);