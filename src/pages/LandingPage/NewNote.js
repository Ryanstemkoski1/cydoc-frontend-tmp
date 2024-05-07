import React, { Component } from 'react';
import NotesContext from '../../contexts/NotesContext';
import {
    Button,
    Divider,
    Header,
    Icon,
    Menu,
    Segment,
    ButtonGroup,
    Grid,
    Radio,
    Modal,
} from 'semantic-ui-react';
import { Redirect } from 'react-router';
import './LandingPage.css';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import { connect } from 'react-redux';
import { loadNote } from '@redux/actions/currentNoteActions';

class NewNoteSegment extends Component {
    static contextType = NotesContext;

    constructor(props) {
        super(props);
        this.handleBlankNoteClick = this.handleBlankNoteClick.bind(this);
        this.state = {
            activeTemplate: null,
            redirect: false,
        };
    }

    componentDidMount = () => {};

    handleBlankNoteClick = async () => {
        const note = await this.context.addNote();
        if (note !== null) {
            // TODO: account for unsavedChanges
            let { _id, noteName: title, ...newNote } = note;
            newNote = { _id, title, ...newNote.body };
            this.context.loadNote(newNote);
            this.props.loadNote(newNote);
            this.setState({ redirect: true });
        }
    };

    displayPinnedTemplates = () => {
        let pinnedTemplates = ['Pinned A', 'Pinned A', 'Pinned A', 'Pinned A'];
        return pinnedTemplates.map((template, index) => {
            return (
                <ButtonGroup
                    key={index}
                    fluid
                    compact
                    style={{ display: 'inline' }}
                >
                    <Button basic>
                        <Icon name='file alternate outline' />
                        {template}
                    </Button>
                    <Button
                        basic
                        style={{ position: 'absolute', right: '0' }}
                        aria-label='thumb-tack'
                    >
                        <Icon name='thumb tack' />
                    </Button>
                </ButtonGroup>
            );
        });
    };

    displayRecentTemplates = () => {
        let recentTemplates = ['Recent A', 'Recent A', 'Recent A', 'Recent A'];
        return recentTemplates.map((template, index) => {
            return (
                <ButtonGroup
                    key={index}
                    fluid
                    compact
                    style={{ display: 'inline' }}
                >
                    <Button basic>
                        <Icon name='file alternate outline' />
                        {template}
                    </Button>
                    <Button
                        basic
                        style={{ position: 'absolute', right: '0' }}
                        aria-label='thumb-tack'
                    >
                        <Icon
                            name='thumb tack'
                            color='grey'
                            rotated='clockwise'
                        />
                    </Button>
                </ButtonGroup>
            );
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to='/editnote' />;
        }

        return (
            <Segment
                className={
                    this.props.stack
                        ? 'landing-page-columns-mobile'
                        : 'landing-page-columns'
                }
            >
                <Header as='h2'>New Note</Header>
                <ButtonGroup
                    basic
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    <Button
                        color='teal'
                        // use below onClick for saving notes
                        // onClick={this.handleBlankNoteClick}
                        onClick={() => this.setState({ redirect: true })}
                    >
                        New Blank Note
                    </Button>
                </ButtonGroup>
                <Divider />
                <Menu secondary vertical style={{ width: '100%' }}>
                    <Menu.Item>
                        <Header as={'h3'}>Pinned Note Templates</Header>
                        {this.displayPinnedTemplates()}
                    </Menu.Item>
                    <Menu.Item>
                        <Header as={'h3'}>Recent Note Templates</Header>
                        {this.displayRecentTemplates()}
                    </Menu.Item>
                </Menu>

                <ButtonGroup className='right-bottom-button'>
                    <Modal trigger={<Button>Browse Templates...</Button>}>
                        {this.props.stack ? null : <BrowseTemplates />}
                    </Modal>
                </ButtonGroup>
            </Segment>
        );
    }
}

export default connect(null, { loadNote })(NewNoteSegment);

class BrowseTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTemplate: null,
        };
    }

    templates = {
        'History of Present Illness': [
            'Template A',
            'Template B',
            'Template C',
            'Template D',
        ],
        'Physical Exam': ['Template E', 'Template F', 'Template G'],
        'Review of Systems': ['Template H', 'Template I'],
    };

    handleChange = () => {};

    render() {
        return (
            <Segment className='my-notes-modal'>
                <Header as={'h2'}>My Templates</Header>

                <Divider />

                <Grid>
                    <Grid.Column className='template-column' width={5}>
                        <Header as={'h3'}>History of Present Illness</Header>
                        <Segment
                            placeholder
                            className='list-placeholder-templates'
                        >
                            <Menu
                                as={Form}
                                secondary
                                vertical
                                style={{ width: '100%' }}
                            >
                                {this.templates[
                                    'History of Present Illness'
                                ].map((template, index) => {
                                    return (
                                        <Form.Group key={index}>
                                            <Radio
                                                label={template}
                                                name={template}
                                                value={template}
                                                checked={
                                                    this.state
                                                        .activeTemplate ===
                                                    template
                                                }
                                                onChange={this.handleChange}
                                            ></Radio>
                                        </Form.Group>
                                    );
                                })}
                            </Menu>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column className='template-column' width={5}>
                        <Header as={'h3'}>Physical Exam</Header>
                        <Segment
                            placeholder
                            className='list-placeholder-templates'
                        >
                            <Menu
                                as={Form}
                                secondary
                                vertical
                                style={{ width: '100%' }}
                            >
                                {this.templates['Physical Exam'].map(
                                    (template, index) => {
                                        return (
                                            <Form.Group key={index}>
                                                <Radio
                                                    label={template}
                                                    name={template}
                                                    value={template}
                                                    checked={
                                                        this.state
                                                            .activeTemplate ===
                                                        template
                                                    }
                                                    onChange={this.handleChange}
                                                ></Radio>
                                            </Form.Group>
                                        );
                                    }
                                )}
                            </Menu>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column className='template-column' width={5}>
                        <Header as={'h3'}>Review of Systems</Header>
                        <Segment
                            placeholder
                            className='list-placeholder-templates'
                        >
                            <Menu
                                as={Form}
                                secondary
                                vertical
                                style={{ width: '100%' }}
                            >
                                {this.templates[
                                    'History of Present Illness'
                                ].map((template, index) => {
                                    return (
                                        <Form.Group key={index}>
                                            <Radio
                                                label={template}
                                                name={template}
                                                value={template}
                                                checked={
                                                    this.state
                                                        .activeTemplate ===
                                                    template
                                                }
                                                onChange={this.handleChange}
                                            ></Radio>
                                        </Form.Group>
                                    );
                                })}
                            </Menu>
                        </Segment>
                    </Grid.Column>
                </Grid>

                <Button
                    color='teal'
                    className='right-bottom-button'
                    onClick={this.handleCreate}
                >
                    Create
                </Button>
            </Segment>
        );
    }
}
