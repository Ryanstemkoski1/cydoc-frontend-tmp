import {Form, Grid} from "semantic-ui-react";
import ToggleButton from 'components/tools/ToggleButton.js';
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import "../familyhistory/FamilyHistory.css";
import "./MedicalHistoryNote.css"

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteItem extends Component {
    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, onset, onChange, comments} = this.props;

        const showTextAreas = yesActive ? "display" : "hide";

        return (<Grid.Row>
            <Form className="family-hx-note-item">
                <Form.Group inline className="condition-header">
                    <div className="condition-name">
                        {condition}
                    </div>
                    <div>
                        <ToggleButton
                            active={yesActive}
                            condition={condition.props.condition}
                            title="Yes"
                            onToggleButtonClick={onToggleButtonClick}
                        />
                        <ToggleButton
                            active={noActive}
                            condition={condition.props.condition}
                            title="No"
                            onToggleButtonClick={onToggleButtonClick}
                        />
                    </div>
                </Form.Group>
                <div className="condition-info">
                    <Form.TextArea
                        label="Onset"
                        className={`text-area text-area-${condition.props.index} ${showTextAreas}`}
                        condition={condition.props.condition}
                        placeholder="Onset"
                        value={onset}
                        onChange={onChange}
                        rows={1}
                    />
                    { onset !== "" && !/^(19\d\d|20[0-2]\d)$/.test(onset) && (
                        <p className='mobile-error'>Please enter a year between 1900 and 2020</p>
                    )}
                    <Form.TextArea
                        label="Comments"
                        className={`text-area text-area-${condition.props.index} ${showTextAreas}`}
                        condition={condition.props.condition}
                        placeholder="Comments"
                        value={comments}
                        onChange={onChange}
                        rows={2}
                    />
                </div>
            </Form>
        </Grid.Row>);
    }
}

MedicalHistoryNoteItem.propTypes = {
  condition: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
  ])
} ;