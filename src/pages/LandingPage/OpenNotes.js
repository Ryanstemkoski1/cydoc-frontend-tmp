import React, {Component, useContext, Fragment} from "react";
import NotesContext from "../../contexts/NotesContext";
import HPIContext from "../../contexts/HPIContext";
import {Button, Divider, Header, Icon, Menu, Segment, Item, Loader, Grid, Search, Modal, ButtonGroup, Placeholder} from "semantic-ui-react";
import {Redirect} from "react-router";
import './LandingPage.css'


export default class OpenRecentSegment extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleTrashClick = this.handleTrashClick.bind(this);
        // this.setActive = this.setActive.bind(this);
        this.state = {
            redirect: false,
            loadedNotes: false
        }
    }

    componentDidMount = async () => {
        await this.context.loadAllNotes();
        if ( this.state.loadedNotes == false) this.setState({loadedNotes: true});
    }

    handleItemClick(event, { note }){
        console.log(note);
        this.context.loadNote(note);
        this.setState({redirect: true});
    }

    async handleTrashClick(event, { note }) {
        await this.context.deleteNote(note);
    }

    displayNotes = (number) => {
        let sortedNotes = Array.from(this.context.getAllNotes()).slice(0,number).sort((a, b) => (a.modifiedTime > b.modifiedTime) ? -1 : 1)
        return sortedNotes.map( (note) =>
            <ButtonGroup fluid compact style={{display: 'inline'}}>
                <Button size={'big'}
                        basic
                        note={note}
                        onClick={this.handleItemClick} >
                    <Icon name="file" />
                    {note.noteName}

                </Button>
                <Button
                    basic
                    note={note}
                    onClick={this.handleTrashClick}
                    style={{position: 'absolute', right: '0'}}
                >
                    <Icon name='trash' color='red' />
                </Button>
            </ButtonGroup>

        )
    }


    render () {

        if (this.state.redirect) {
            return (
                <Redirect to= "/editnote" />
            )
        }

        return (
            <>
                <Segment className={this.props.stack? "landing-page-columns-mobile": 'landing-page-columns'}>
                    <Header as='h2'>Open Recent</Header>
                    <Divider />
                    <Menu text vertical style={{width: '100%'}}>
                        {this.props.stack ?
                            this.displayNotes(5)
                            :
                            (this.state.loadedNotes ?
                                    this.displayNotes(13)
                                    :
                                    <Loader active>Loading</Loader>
                            )
                        }

                    </Menu>
                    {this.state.loadedNotes?
                        <ButtonGroup floated='right' className="right-bottom-button">
                            <Modal trigger={<Button >Browse All...</Button>}>
                                {this.props.stack? <NotesBrowserMobile /> : <NotesBrowser />}
                            </Modal>
                        </ButtonGroup>:
                        null
                    }

                </Segment>


            </>
        )

    }


}


class NotesBrowser extends Component {

    static contextType = NotesContext

    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            activeMonth: 'July 2020',
            activeNote: null,
            redirect: false
        }
    }

    handleClick = () => {
        if (this.props.activeNote != null) {
            this.context.loadNote(this.props.activeNote);
            console.log("loading");
            this.state.redirect = true;
        }
    }

    monthItems = [
        'July 2020',
        'June 2020',
        'May 2020',
        'April 2020',
        'March 2020',
        'Feburary 2020',
        'January 2020',
    ]

    testNotes = Array.from(this.context.getNotes())

    // TODO
    arrangedNotes = {
        'July 2020': this.testNotes,
        'June 2020': this.testNotes,
        'May 2020': this.testNotes,
        'April 2020': this.testNotes,
        'March 2020': this.testNotes,
        'Feburary 2020': this.testNotes,
        'January 2020': this.testNotes
    }


    handleMonthClick = (e, {name}) => {
        this.setState({activeMonth: name});
    }

    handleNoteClick = (e, {name, note}) => {
        this.setState({activeNote: note});
    }

    render() {

        const stack = this.props.stack;

        if (this.state.redirect) {
            return (
                <Redirect to= "/editnote" />
            )
        }

        return (
            <Segment className='my-notes-modal'>

                <Header as={'h2'}>My Notes</Header>

                <Search style={{ position:'absolute', right:'10px',top:'10px' }} />

                <Divider />

                <Grid>

                    {/* Month Column */}
                    <Grid.Column className='months-column'>
                        <Header as={'h3'}>Month</Header>
                        <Segment placeholder className='list-placeholder'>
                            <Menu secondary vertical style={{width: '100%'}}>
                                {this.monthItems.map((item) => {
                                    return (
                                        <Menu.Item
                                            name={item}
                                            active={this.state.activeMonth === item}
                                            onClick={this.handleMonthClick}>
                                            <span>
                                                <Icon name={this.state.activeMonth === item? "folder open outline" : "folder"} />
                                                {item}
                                                {this.state.activeMonth === item? <Icon name='angle right' style={{position: 'absolute', right:0}}/> : null}
                                            </span>
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        </Segment>
                    </Grid.Column>

                    {/* Date Column */}
                    <Grid.Column  className='date-column'>
                        <Header as={'h3'}>Date</Header>
                        <Segment placeholder className='list-placeholder'>
                            <Menu secondary vertical style={{width: '100%'}}>
                                {this.arrangedNotes[this.state.activeMonth].map((item) => {
                                    return (
                                        <Menu.Item
                                            name={item.noteName}
                                            note={item}
                                            active={this.state.activeNote == null? false : (this.state.activeNote._id === item._id)}
                                            onClick={this.handleNoteClick}>
                                            <span>
                                                <Icon name="file" />
                                                {item.noteName}
                                            </span>
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column className='details-column'>
                        {this.state.activeNote == null ? null :
                            <div style={{width: '100%'}}>
                                <Icon name='file alternate outline' size='massive'/>
                                <Header
                                    as={'h2'}>{this.state.activeNote.noteName}</Header>

                                <Grid padded>
                                    <Grid.Column width={7}>
                                        <div style={{textAlign: 'right'}}>Patient</div>
                                        <div style={{textAlign: 'right'}}>Date Created</div>
                                        <div style={{textAlign: 'right'}}>Date Modified</div>
                                        <div style={{textAlign: 'right'}}>Details</div>
                                    </Grid.Column>
                                    <Grid.Column width={9}>
                                        <div style={{textAlign: 'left'}}>Patient A</div>
                                        <div style={{textAlign: 'left'}}>Jauary 1st, 1970</div>
                                        <div style={{textAlign: 'left'}}>Jauary 1st, 2020</div>
                                    </Grid.Column>
                                </Grid>
                            </div>
                        }
                    </Grid.Column>
                </Grid>


                <Button
                    style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '10px',
                    }}
                    color='teal'
                    onClick={this.handleClick}
                >
                    Open
                </Button>
            </Segment>
        )

    }
}

class NotesBrowserMobile extends NotesBrowser {

    constructor(props, context) {
        super(props, context);
        this.state = {
            activeMonth: 'July 2020',
            activeNote: null,
            visible: false
        }
    }

    handleMonthClick = (e, {name}) => {
        this.setState({activeMonth: name, visible: true});
    }

    render() {

        const stack = this.props.stack;

        return (
            <Segment className='my-notes-modal'>

                <Header as={'h2'}>My Notes</Header>

                <Search style={{ position:'absolute', right:'10px',top:'10px' }} />

                <Divider />

                <Header as={'h3'}>Month</Header>
                <Segment placeholder className=''>
                    <Menu secondary vertical style={{width: '100%'}}>
                        {this.monthItems.map((item) => {
                            return (
                                <Menu.Item
                                    name={item}
                                    active={this.state.activeMonth === item}
                                    onClick={this.handleMonthClick}>
                                            <span>
                                                <Icon name={this.state.activeMonth === item? "folder open outline" : "folder"} />
                                                {item}
                                                {this.state.activeMonth === item? <Icon name='angle right' style={{position: 'absolute', right:0}}/> : null}
                                            </span>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                </Segment>


                <Fragment visible={this.state.visible} style={{position: 'absolute', left: '10px', top: '10px'}}>
                    <Header as={'h3'}>Date</Header>
                    <Segment placeholder className=''>
                        <Menu secondary vertical style={{width: '100%'}}>
                            {this.arrangedNotes[this.state.activeMonth].map((item) => {
                                return (
                                    <Menu.Item
                                        name={item.noteName}
                                        note={item}
                                        active={this.state.activeNote == null? false : (this.state.activeNote._id === item._id)}
                                        onClick={this.handleNoteClick}>
                                            <span>
                                                <Icon name="file" />
                                                {item.noteName}
                                            </span>
                                    </Menu.Item>
                                )
                            })}
                        </Menu>
                    </Segment>
                </Fragment>


                <Button
                    style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '10px',
                    }}>
                    color='teal'
                    onClick={this.handleClick}>
                    Open
                </Button>
            </Segment>
        )

    }
}