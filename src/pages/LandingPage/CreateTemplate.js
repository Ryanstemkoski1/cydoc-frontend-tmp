import React, { Component } from 'react';
import {
    Button,
    Divider,
    Header,
    Icon,
    Menu,
    Modal,
    Segment,
    Input,
    Grid,
    Radio,
    ButtonGroup,
} from 'semantic-ui-react';
import { Redirect } from 'react-router';
import './LandingPage.css';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';

export default class CreateTemplateSegment extends Component {
    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        // this.setActive = this.setActive.bind(this);
        this.state = {
            activeItem: 'Notes',
            redirect: false,
        };
        this.templates = [
            'History of Present Illness',
            'Review of Systems',
            'Physical Exam',
        ];
    }

    handleItemClick(event, { content }) {
        this.setState({ activeItem: content });
        if (content === 'History of Present Illness') {
            this.setState({ redirect: true });
        }
    }

    displayTemplates = () => {
        return this.templates.map((template, index) => {
            return (
                <Menu.Item key={index}>
                    <ButtonGroup compact>
                        <Button
                            basic
                            name={template}
                            active={this.state.activeItem === template}
                            content={template}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='file alternate outline' />
                            {template}
                        </Button>
                    </ButtonGroup>
                </Menu.Item>
            );
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to='/creategraph' />;
        }
        return (
            <Segment className='landing-page-columns'>
                <Header as='h2'>New Template</Header>
                <Divider />
                <Menu text vertical>
                    {this.displayTemplates()}
                </Menu>
                <Modal
                    trigger={
                        <Button className='right-bottom-button'>
                            New Template Group...
                        </Button>
                    }
                >
                    {this.props.stack ? null : <CreateTemplateGroupDialogue />}
                </Modal>
            </Segment>
        );
    }
}

class CreateTemplateGroupDialogue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeHPITemplate: 'Show All',
            activePETemplate: 'Show All',
            activeRoSTemplate: 'Show All',
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

    handleHPIChange = (e, { name }) => {
        this.setState({ activeHPITemplate: name });
    };
    handlePEChange = (e, { name }) => {
        this.setState({ activePETemplate: name });
    };
    handleRoSChange = (e, { name }) => {
        this.setState({ activeRoSTemplate: name });
    };

    //TODO
    handleCreate = () => {};

    render() {
        return (
            <Segment className='my-notes-modal'>
                <Input
                    as={'h2'}
                    size='massive'
                    transparent
                    placeholder='Untitled Template Group'
                ></Input>

                <Divider />

                <Header as={'h3'}>
                    Each section of this group will have the following template:
                </Header>

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
                                <Form.Group>
                                    <Radio
                                        label='Show All'
                                        name='Show All'
                                        value='Show All'
                                        checked={
                                            this.state.activeHPITemplate ===
                                            'Show All'
                                        }
                                        onChange={this.handleHPIChange}
                                    ></Radio>
                                </Form.Group>
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
                                                        .activeHPITemplate ===
                                                    template
                                                }
                                                onChange={this.handleHPIChange}
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
                                <Form.Group>
                                    <Radio
                                        label='Show All'
                                        name='Show All'
                                        value='Show All'
                                        checked={
                                            this.state.activePETemplate ===
                                            'Show All'
                                        }
                                        onChange={this.handlePEChange}
                                    ></Radio>
                                </Form.Group>
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
                                                            .activePETemplate ===
                                                        template
                                                    }
                                                    onChange={
                                                        this.handlePEChange
                                                    }
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
                                <Form.Group>
                                    <Radio
                                        label='Show All'
                                        name='Show All'
                                        value='Show All'
                                        checked={
                                            this.state.activeRoSTemplate ===
                                            'Show All'
                                        }
                                        onChange={this.handleRoSChange}
                                    ></Radio>
                                </Form.Group>
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
                                                        .activeRoSTemplate ===
                                                    template
                                                }
                                                onChange={this.handleRoSChange}
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
