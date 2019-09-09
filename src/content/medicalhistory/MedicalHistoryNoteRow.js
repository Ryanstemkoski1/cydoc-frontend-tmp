import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';

export default class MedicalHistoryNoteRow extends Component {
    render() {
        return (<Grid.Row>
            <Grid.Column>
                {this.props.condition}
            </Grid.Column>
            <Grid.Column>
                <ToggleButton active={this.props.yesActive}
                              condition={this.props.condition}
                              title="Yes"
                              onToggleButtonClick={this.props.onToggleButtonClick}/>
                <ToggleButton active={this.props.noActive}
                              condition={this.props.condition}
                              title="No"
                              onToggleButtonClick={this.props.onToggleButtonClick}/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea condition={this.props.condition} placeholder='Onset' value={this.props.onset}
                              onChange={this.props.onChange}/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea condition={this.props.condition} value={this.props.comments}
                              onChange={this.props.onChange} placeholder='Comments'/>
                </Form>
            </Grid.Column>
        </Grid.Row>)
    }
}

MedicalHistoryNoteRow.propTypes = {
  condition: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
  ])
} ;