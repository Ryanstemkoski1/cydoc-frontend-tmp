import {Form, Grid, TextArea, Input} from "semantic-ui-react";
import ToggleButton from "../../components/ToggleButton";
import React, {Component} from 'react'
import PropTypes from 'prop-types';

//Component for a row the Medical History GridContent
export default class MedicalHistoryNoteRow extends Component {
    render = () => {
        const {index, drugName, startDate, schedule, dose, reason, comments} = this.props;
        return (<Grid.Row>
            <Grid.Column>
                <Input index={index} value={drugName} placeholder='Drug Name' onChange={onChange} />
            </Grid.Column>
            <Grid.Column>
                <Input index={index} value={startDate} placeholder='Start Date' onChange={onChange} />
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea index={index} placeholder='Schedule' value={schedule}
                              onChange={onChange}/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea index={index} placeholder='Dose' value={dose}
                              onChange={onChange}/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea index={index} value={reason}
                              onChange={onChange} placeholder='Reason for Taking'/>
                </Form>
            </Grid.Column>
            <Grid.Column>
                <Form>
                    <TextArea index={index} value={comments}
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