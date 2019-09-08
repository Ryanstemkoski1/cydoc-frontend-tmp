import {Form, Grid, Input, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';

export default class SocialHistoryNoteRow extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     value: this.props.value
        // }
    }

    render() {
        return (<Grid.Row>
            <Grid.Column width={2}>
                {this.props.condition}
            </Grid.Column>
            <Grid.Column width={4}>
                <ToggleButton title="Yes" size={"small"} compact={true}/>
                <ToggleButton title="In the Past" size={"small"} compact={true}/>
                <ToggleButton title="Never Used" size={"small"} compact={true}/>
            </Grid.Column>
            <Grid.Column width={2}>
                <Form >
                    <Form.Field>
                        <label>{this.props.firstField}</label>
                        <Input
                            onChange={this.props.onChange}
                            field={this.props.firstField}
                            condition={this.props.condition}
                            value={this.props.value}
                        >
                            {/*{this.props.value}*/}
                        </Input>
                    </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.Field>
                        <label>{this.props.secondField}</label>
                        <Input
                            onChange={this.props.onChange}
                            field={this.props.secondField}
                            condition={this.props.condition}/>
                    </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column width={4}>
                <Form>
                    <Form.Field>
                        <label>Comments</label>
                        <TextArea
                            onChange={this.props.onChange}
                            field={"Comments"}
                            condition={this.props.condition}/>
                    </Form.Field>
                </Form>
            </Grid.Column>
        </Grid.Row>)
    }
}

SocialHistoryNoteRow.propTypes = {
    condition: PropTypes.string.isRequired,
    firstField: PropTypes.string.isRequired,
    secondField: PropTypes.string.isRequired,
}