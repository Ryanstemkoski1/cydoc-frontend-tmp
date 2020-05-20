import React, { Component } from 'react'
import {Icon, Menu, Button} from 'semantic-ui-react'
import NotesContext from '../../contexts/NotesContext'


//Component for the vertical menu that appears on the dashboard page
export default class VerticalMenu extends Component {

    static contextType = NotesContext

    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {
            activeItem: "Notes"
        }
    }

    //sets the corresponding menu item to active on click
    handleItemClick(event, { id, note }){
        this.setState({activeItem: id});
        this.props.setActive(note)
    }

    displayNotes = () => {
        return (
            this.context.notes.map( (note) => 
                <Menu.Item
                name={note.noteName}
                key={note._id}
                id={note._id}
                note={note}
                active={this.state.activeItem === note._id}
                onClick={this.handleItemClick}
                />
            )
        )
    }

    render() {
        const activeItem = this.state;

        return (
            <Menu vertical size="massive" secondary style={{ height: '100vh'}}>
                <Menu.Item
                    header
                    name='Notes'
                    active={activeItem === 'Notes'}
                >
                    <Icon name="plus" link onClick={this.context.addNote}/>
                    <Icon name="search" />
                    Notes
                </Menu.Item>
                <Menu.Menu>
                    {this.displayNotes()}
                </Menu.Menu>
                <Menu.Item
                    header
                    name='Knowledge Graphs'
                    active={activeItem === 'Knowledge Graphs'}
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
