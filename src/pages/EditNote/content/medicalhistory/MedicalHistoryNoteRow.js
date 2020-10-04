import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import './MedicalHistoryNote.css';

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteRow extends Component {
    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, onset, onChange, comments, isPreview } = this.props;
        return (<Grid.Row>
            <Grid.Column>
                {condition}
            </Grid.Column>
            <Grid.Column>
                <ToggleButton active={yesActive}
                              condition={condition.props.condition}
                              title="Yes"
                              onToggleButtonClick={onToggleButtonClick}/>
                <ToggleButton active={noActive}
                              condition={condition.props.condition}
                              title="No"
                              onToggleButtonClick={onToggleButtonClick}/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.TextArea condition={condition.props.condition} placeholder='Onset' value={onset}
                              onChange={onChange} disabled={isPreview} rows={1}/>
                </Form>
                { onset !== "" && !/^(19\d\d|20[0-2]\d)$/.test(onset) && (
                    <p className='error'>Please enter a year between 1900 and 2020</p>
                )}
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.TextArea condition={condition.props.condition} value={comments}
                        onChange={onChange} placeholder='Comments' disabled={isPreview} rows={2}/>
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