import {Checkbox, Form, Grid } from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import "../../../css/content/familyHistory.css";

//Component for a row in the Family History GridContent
export default class FamilyHistoryNoteItem extends Component {
    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, CODActive, familyMember, onChange, comments } = this.props;
        return (
            <Grid.Row>
                <Form className="family-hx-note-item">
                    <Form.Group inline className="condition-header">
                        <div className="condition-name">
                            {condition}
                        </div>
                        <ToggleButton
                            active={yesActive}
                            condition={condition}
                            title="Yes"
                            onToggleButtonClick={onToggleButtonClick}
                        />
                        <ToggleButton
                            active={noActive}
                            condition={condition}
                            title="No"
                            onToggleButtonClick={onToggleButtonClick}
                        />
                    </Form.Group>
                    <div className="condition-info">
                        <Form.TextArea
                            label="Family Member"
                            className="text-area"
                            condition={condition}
                            placeholder="Family Member"
                            value={familyMember}
                            onChange={onChange}
                            rows={1}
                        />
                        <Form.Group inline className="cod-checkbox">
                            <label>Cause of death?</label>
                            <Checkbox
                                checked={CODActive}
                                condition={condition}
                                title="Cause of Death"
                                onChange={onToggleButtonClick}
                            />
                        </Form.Group>
                        <Form.TextArea
                            label="Comments"
                            className="text-area"
                            condition={condition}
                            placeholder="Comments"
                            value={comments}
                            onChange={onChange}
                            rows={2}
                        />
                    </div>
                </Form>
            </Grid.Row>
        )
    }
    
}

FamilyHistoryNoteItem.propTypes = {
    condition: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
};