import {Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteRow extends Component {
    render = () => {
        const { yesActive, condition, onConditionToggleButtonClick, onResolvedToggleButtonClick, noActive, onset, onChange, comments, isPreview, currentYear, isResolved, endYear } = this.props;
        return (<Grid.Row>
            <Grid.Column>
                {condition}
            </Grid.Column>
            <Grid.Column textAlign="center">
                <ToggleButton active={yesActive}
                              condition={condition.props.condition}
                              title="Yes"
                              onToggleButtonClick={onConditionToggleButtonClick}/>
                <ToggleButton active={noActive}
                              condition={condition.props.condition}
                              title="No"
                              onToggleButtonClick={onConditionToggleButtonClick}/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.TextArea condition={condition.props.condition} placeholder='Onset' value={onset}
                              onChange={onChange} disabled={isPreview} rows={1}/>
                </Form>
                { onset !== "" && (isNaN(+onset) || onset < 1900 || onset > currentYear) && (
                    <p className='year-validation-error'>Please enter a valid year after 1900</p>
                )}
            </Grid.Column>
            <Grid.Column textAlign="center">
                <ToggleButton active={isResolved == 'Yes'}
                              condition={condition.props.condition}
                              title="Yes"
                              onToggleButtonClick={onResolvedToggleButtonClick}/>
                <ToggleButton active={isResolved == 'No'}
                              condition={condition.props.condition}
                              title="No"
                              onToggleButtonClick={onResolvedToggleButtonClick}/>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.TextArea condition={condition.props.condition} placeholder='End Year' value={endYear}
                              onChange={onChange} disabled={isPreview} rows={1} disabled={isResolved != 'Yes'}/>
                </Form>
                { isResolved == 'Yes' && endYear !== "" && (isNaN(+endYear) || endYear < 1900 || endYear > currentYear || endYear < onset) && (
                    <p className='year-validation-error'>Please enter a valid year after 1900 and the onset</p>
                )}
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <Form.TextArea rows={2} condition={condition.props.condition} value={comments}
                              onChange={onChange} placeholder='Comments' disabled={isPreview}/>
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