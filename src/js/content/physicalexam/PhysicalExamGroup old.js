import React, {Component, Fragment} from 'react'
import {Divider, Header, Grid, Form, Checkbox, TextArea} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import HPIContext from '../../contexts/HPIContext';

export const MyContext = React.createContext('yasa')

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class PhysicalExamGroup extends Component{
    
    static contextType = HPIContext

    constructor(props) {
        super(props)
        this.state = {}
    }

    handleChange = (e, data) => {
        const values = this.context["Physical Exam"]
        values[this.props.category]["Abnormal Findings"] = data.value
        this.context.onContextChange("Physical Exam", values)
    }

    render() {
        if (this.props.abnormalFindings == true) {
            return (
                <MyContext.Provider value={this.props.category}>
                    <Fragment>
                        <Header as="h4">{this.props.category}</Header>
                        <Divider />
                        <Form>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.props.children}
                                    </Grid.Column>
                                    <Grid.Column floated="right" width={5}>
                                        <Form.Field>
                                            <label>Abnormal Findings</label>
                                            <TextArea 
                                                value={this.context["Physical Exam"][this.props.category]["Abnormal Findings"]}
                                                onChange={this.handleChange}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Fragment>
                </MyContext.Provider>
                
                
                
            )
        }

        else {
            return (
                <MyContext.Provider value={this.props.category}>
                    <Fragment>
                        <Header as="h4">{this.props.category}</Header>
                        <Divider />
                        <Form>
                            <Grid columns="equal">
                            <Grid.Row>
                                <Grid.Column>
                                    {this.props.children}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        </Form>
                    </Fragment>
                </MyContext.Provider>
                
            ) 
        }
        
    }

    
}

PhysicalExamGroup.propTypes = {
    content: PropTypes.any.isRequired,
}