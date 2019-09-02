import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class VerticalMenu extends Component {
    state = {}
    handleItemClick = (name) => this.setState({activeItem: name})

    render() {
        const {activeItem} = this.state

        return (
            <Menu vertical secondary style={{ height: '100vh'}}>
                <Menu.Item>
                    <Menu.Header>Notes</Menu.Header>

                    <Menu.Menu>
                        <Menu.Item
                            name='recent'
                            active={activeItem === 'enterprise'}
                            onClick={this.handleItemClick}
                        />

                    </Menu.Menu>
                </Menu.Item>
            </Menu>)
    }
};
