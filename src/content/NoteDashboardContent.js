import React, { Component } from 'react';
import {Card, Header, Icon} from 'semantic-ui-react'

export default class NoteDashboardContent extends Component {
    render() {
        const extra = (
            <a>
                <Icon name='edit' />
                edit
            </a>
        );
        const plus = (
            <Header as="h3" textAlign="center" inverted>
                new note
                <br/>
                <Icon name='plus' inverted/>
            </Header>
        );
        return (
            <Card.Group>
                <Card
                    raised
                    style={{backgroundColor: "#6DA3B1", borderColor: "#6DA3B1"}}
                    header={plus}
                    href="#new-note"
                />
                <Card
                    raised
                    header='note 1'
                    meta='9/02/2019'
                    description='note description'
                    extra={extra}
                    style={{borderColor: "white"}}
                    href="#new-note"
                />
                <Card
                    raised
                    header='new note 2'
                    meta='9/02/2019'
                    description='note description'
                    extra={extra}
                    style={{borderColor: "white"}}
                    href="#new-note"
                />
            </Card.Group>

        )
    }
}