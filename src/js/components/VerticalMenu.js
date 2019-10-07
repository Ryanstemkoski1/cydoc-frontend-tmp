import React, { Component } from 'react'
import {Icon, Menu} from 'semantic-ui-react'


//Component for the vertical menu that appears on the dashboard page
export default class VerticalMenu extends Component {
    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {
            activeItem: "Notes"
        }
    }

    //sets the corresponding menu item to active on click
    handleItemClick(event, { name }){
        this.setState({ activeItem: name });
    }

    render() {
        const activeItem = this.state;

        return (
            <Menu vertical size="massive" secondary style={{ height: '100vh'}}>
                <Menu.Item
                    header
                    name='Notes'
                    active={activeItem === 'Notes'}
                    onClick={this.handleItemClick}
                >
                    <Icon name="plus" />
                    <Icon name="search" />
                    Notes
                </Menu.Item>
                <Menu.Menu>
                    <Menu.Item header>Recent</Menu.Item>
                    <Menu.Item
                        name='note 1'
                        active={activeItem === 'note 1'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='new note 2'
                        active={activeItem === 'new note 2'}
                        onClick={this.handleItemClick}
                    />
                </Menu.Menu>
                <Menu.Item
                    header
                    name='Knowledge Graphs'
                    active={activeItem === 'Knowledge Graphs'}
                    onClick={this.handleItemClick}
                >
                    <Icon name="plus" />
                    <Icon name="search" />
                    Knowledge Graphs
                </Menu.Item>
                <Menu.Menu>
                    <Menu.Item header>Recent</Menu.Item>
                    <Menu.Item
                        name='graph 1'
                        active={activeItem === 'graph 1'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='new graph 2'
                        active={activeItem === 'new graph 2'}
                        onClick={this.handleItemClick}
                    />
                </Menu.Menu>

            </Menu>)
    }
};
