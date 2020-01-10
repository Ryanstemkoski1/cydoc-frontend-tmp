import React, {Component, Fragment} from 'react'
import {Grid, Form, Checkbox, TextArea} from 'semantic-ui-react'
import PropTypes from 'prop-types'

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class PhysicalExamGroup extends Component{

    constructor(props) {
        super(props)
        this.state = {}
    }


    render() {
        return (
            <Form>
                <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column>
                        {this.props.children}
                    </Grid.Column>
                    <Grid.Column floated="right" width={5}>
                        <Form.Field>
                            <label>Abnormal Findings</label>
                            <TextArea/>
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </Form>
            
        )
    }

    
}

PhysicalExamGroup.propTypes = {
    content: PropTypes.any.isRequired,
}