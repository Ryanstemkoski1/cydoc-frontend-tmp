import React, { Component, Fragment } from 'react'
import { Divider, Header, Grid, Form, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import HPIContext from '../../contexts/HPIContext'
import PhysicalExamRow from './PhysicalExamRow'

export const MyContext = React.createContext('yasa')

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class PhysicalExamGroup extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
        this.state = {}
        this.handleToggle = this.handleToggle.bind(this)
    }

<<<<<<< HEAD
    handleToggle = (name, data) => {
        const values = this.context["Physical Exam 2"]
        values[this.props.name][name] = data
        this.context.onContextChange("Physical Exam 2", values)
=======
    handleChange = (e, data) => { 
        const values = this.context["Physical Exam"]
        values[this.props.category]["Abnormal Findings"] = data.value
        this.context.onContextChange("Physical Exam", values)
>>>>>>> master
    }

    handleLRToggle = (leftRight, name, data) => {
        console.log(name)
        const values = this.context["Physical Exam 2"]
        if (leftRight === null) {
            values[this.props.name][name].active = data
            if (data === false) {
                values[this.props.name][name].left = data
                values[this.props.name][name].right = data
            }
        } else {
            values[this.props.name][name][leftRight] = data
        }
        
        this.context.onContextChange("Physical Exam 2", values)
    }

    generateRows = (rows) => {

        return (
            rows.map((row) =>            
                <PhysicalExamRow 
                    row={row}
                    group={this.props.name}
                    handleToggle={this.handleToggle}
                    handleLRToggle={this.handleLRToggle}
                />

            )
        )
    }

    render() {



        return (

            <Fragment>
                <Header as="h4">{this.props.name}</Header>
                <Divider />
                <Form>
                    <Grid columns="equal">
                        <Grid.Row>
                            <Grid.Column>
                                {this.generateRows(this.props.rows)}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Fragment>


        )

    }


}

PhysicalExamGroup.propTypes = {
    content: PropTypes.any.isRequired,
}