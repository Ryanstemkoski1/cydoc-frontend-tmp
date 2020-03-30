import { Divider, Grid } from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import AddRowButton from "./AddRowButton";
import HPIContext from "../contexts/HPIContext"

//Basic Layout and functionality for note tabs that use a grid. Includes support to
// add a row, but likely this state will be lifted in the future
export default class GridContent extends Component {

    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.defaultRows = this.props.rows;
        this.onChange = this.props.onChange;
        this.addRow = this.addRow.bind(this);
    }

    addRow() {
        let values = this.context[this.props.value_type]
        let last_index = Object.keys(values).length.toString()
        values[last_index] = {
            'Condition': "",
            "Yes": false,
            "No": false,
            "Onset": "",
            "Comments": "" 
        }
        this.context.onContextChange(this.props.value_type, values);
    }

    render(){
        const {numColumns, contentHeader, rows, mobile} = this.props;

        return mobile ?
            (<Fragment>
                <br/>
                <Grid columns={1} verticalAlign='middle' divided='vertically'>
                    {rows}
                </Grid>
                <Divider />
                {this.props.question_type === "add_row" ? <AddRowButton onClick={this.addRow} name={this.props.name}/> : ""}
            </Fragment>
            ) : (
            <Fragment>
                <br/>
                {contentHeader}
                <Divider/>
                <Grid columns={numColumns} verticalAlign='middle'>
                    {rows}
                </Grid>
                {this.props.question_type === "add_row" ? <AddRowButton onClick={this.addRow} name={this.props.name}/> : ""}
            </Fragment>
        );
    }
}

GridContent.propTypes = {
    contentHeader: PropTypes.any.isRequired, //Heading that goes over the divider
    numColumns: PropTypes.number.isRequired, //Number of columns in the grid
    rows: PropTypes.array.isRequired, //The rows that will comprise the body of the note. Array of Grid.Row Components.
};

