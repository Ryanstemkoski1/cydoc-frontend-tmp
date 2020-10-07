import React, { Component, Fragment } from 'react'
import { Divider, Header, Grid, Form, TextArea } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import HPIContext from 'contexts/HPIContext.js'
import PhysicalExamRow from './PhysicalExamRow'
import {PHYSICAL_EXAM_MOBILE_BP} from "constants/breakpoints.js";

export const MyContext = React.createContext('yasa')

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class PhysicalExamGroup extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props)
        this.state = {
            windowWidth: 0
        }
        this.handleToggle = this.handleToggle.bind(this)
        this.updateDimensions = this.updateDimensions.bind(this)
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
 
        this.setState({ windowWidth });
    }

    handleToggle = (name, data) => {
        const values = this.context["Physical Exam"]
        values[this.props.name][name] = data
        this.context.onContextChange("Physical Exam", values)
    }

    handleLRToggle = (leftRight, name, data) => {
        console.log(name)
        const values = this.context["Physical Exam"]
        if (leftRight === 'left' || leftRight === 'right') {
            values[this.props.name][name][leftRight] = data
        } else {
            values[this.props.name][name].active = data
            if (data === false || leftRight === 'all') {
                values[this.props.name][name].left = data
                values[this.props.name][name].right = data
            }
        }

        this.context.onContextChange("Physical Exam", values)
    }

    handleTextChange = (e, data) => {
        const values = this.context["Physical Exam"]
        values[this.props.name].comments = data.value
        this.context.onContextChange("Physical Exam", values)
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
        const windowWidth = this.state.windowWidth

        return (
            <Fragment>
                {windowWidth != 0 && windowWidth < PHYSICAL_EXAM_MOBILE_BP ?
                <>
                    <Header as="h2" style={{paddingTop: '1rem'}}>{this.props.name}</Header>
                    <Divider />
                    <Form>
                        {this.generateRows(this.props.rows)}
                        <Form.Field style={{paddingBottom: 100}}>
                            <label>Additional Comments</label>
                            <Form.TextArea
                                value={this.context["Physical Exam"][this.props.name].comments}
                                onChange={this.handleTextChange} 
                                style={{maxHeight: 75}}
                            />
                        </Form.Field>
                    </Form>
                </>
                :
                <>
                    <Header as="h2">{this.props.name}</Header>
                    <Divider />
                    <Form>
                        <Grid columns="equal">
                            <Grid.Row>
                                <Grid.Column>
                                    {this.generateRows(this.props.rows)}
                                </Grid.Column>
                                <Grid.Column floated="right" width={5}>
                                    <Form.Field>
                                        <label>Additional Comments</label>
                                        <Form.TextArea
                                            value={this.context["Physical Exam"][this.props.name].comments}
                                            onChange={this.handleTextChange} />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </>
                }
            </Fragment>
        )
    }
}

PhysicalExamGroup.propTypes = {
    content: PropTypes.any.isRequired,
}