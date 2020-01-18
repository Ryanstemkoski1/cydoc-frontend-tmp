import {Form, Grid, TextArea, Input, Label, Divider} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types';
import { forbiddenWordsMiddleware } from "../../middleware";

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteRow extends Component {
    render = () => {
        const {index, drugName, startDate, schedule, dose, reason, sideEffects, comments, onChange} = this.props;
        return (
        <Grid.Row>
            <Grid.Column>
            <Form>
                <Form.Field inline>
                    <Input label='Drug Name' index={index} value={drugName} placeholder='Drug Name' onChange={onChange} />
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Start Date</label>
                        <Input index={index} value={startDate} placeholder='Start Date' onChange={onChange} />
                    </Form.Field>
                    <Form.Field>
                            <label>Schedule</label>
                            <Input index={index} placeholder='Schedule' value={schedule}
                                    onChange={onChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Dose</label>
                        <Input index={index} placeholder='Dose' value={dose}
                                onChange={onChange}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field>
                            <label>Reason for Taking</label>
                            <Input index={index} value={reason}
                                    onChange={onChange} placeholder='Reason for Taking'/>
                    </Form.Field>
                    <Form.Field>
                            <label>Side Effects</label>
                            <Input index={index} value={sideEffects}
                                    onChange={onChange} placeholder='Side Effects'/>
                    </Form.Field>
                </Form.Group>
                
                <Form.Field>
                        <label>Comments</label>
                        <TextArea index={index} value={comments}
                                onChange={onChange} placeholder='Comments'/>
                </Form.Field>
            </Form>          
            </Grid.Column>
            <Divider/>
        </Grid.Row>
        )
    }
}

MedicalHistoryNoteRow.propTypes = {
  condition: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
  ])
} ;