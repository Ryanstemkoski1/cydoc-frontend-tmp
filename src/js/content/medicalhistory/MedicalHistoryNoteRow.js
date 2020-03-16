import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteRow extends Component {
    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, onset, onChange, comments} = this.props;
        return (<Grid.Row>
            <Grid.Column>
                {condition}
            </Grid.Column>
            <Grid.Column>
                <ToggleButton active={yesActive}
                              condition={condition}
                              title="Yes"
                              onToggleButtonClick={onToggleButtonClick}/>
                <ToggleButton active={noActive}
                              condition={condition}
                              title="No"
                              onToggleButtonClick={onToggleButtonClick}/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea condition={condition} placeholder='Onset' value={onset}
                              onChange={onChange}/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea condition={condition} value={comments}
                              onChange={onChange} placeholder='Comments'/>
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