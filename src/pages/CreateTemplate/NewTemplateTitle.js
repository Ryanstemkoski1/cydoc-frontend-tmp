import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Input, Header, Segment, Form} from 'semantic-ui-react';
import CreateTemplateContext from '../../contexts/CreateTemplateContext';
import './NewTemplate.css';

class NewTemplateTitle extends Component {
    static contextType = CreateTemplateContext;

    constructor(props, context) {
        super(props, context);
        this.saveTitle = this.saveTitle.bind(this);
        this.editGraph = this.editGraph.bind(this);
    }

    saveTitle(event, data) {
        this.context.onContextChange('title', data.value);
    }

    editGraph = () => {
        this.props.history.push('/editgraph');
    }

    render() {
        return (
            <Segment className='container'>
                <Header
                    as='h2'
                    textAlign='center'
                    content='new template'
                    className='new-template-header'
                />
                <Form className='center' onSubmit={this.editGraph}>
                    <div className='title-description'>
                        Enter a short title for your new template.
                    </div>
                    <Input
                        placeholder='template title'
                        value={this.context.state.title}
                        onChange={this.saveTitle}
                        className='input-title'
                    />
                    <Button
                        basic
                        circular
                        icon='arrow right'
                        onClick={this.editGraph}
                    />
                </Form>
            </Segment>
        );
    }
}

export default withRouter(NewTemplateTitle);