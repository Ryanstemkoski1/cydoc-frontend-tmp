import {Checkbox, Form, Grid, TextArea} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import { render } from "react-dom";

//Component for a row in the Family History GridContent
export default class FamilyHistoryNoteRow extends Component {

    render = () => {
        const { yesActive, condition, onToggleButtonClick, noActive, CODActive, familyMember, onChange, comments} = this.props;
        return (
            <Grid.Row>
                <Grid.Column>
                    {this.props.condition}
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
                        <TextArea condition={condition} placeholder='Family Member' value={familyMember}
                                  onChange={onChange}/>
                    </Form>
                </Grid.Column>
                <Grid.Column>
                    <Checkbox checked={CODActive} condition={condition} label="Yes" title="Cause of Death" onChange={onToggleButtonClick}/>
                </Grid.Column>
                <Grid.Column>
                    <Form>
                    <TextArea condition={condition} value={comments}
                                  onChange={onChange} placeholder='Comments'/>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        )
    }
    
}

FamilyHistoryNoteRow.propTypes = {
    condition: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
};