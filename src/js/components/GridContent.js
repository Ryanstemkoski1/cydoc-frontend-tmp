import { Divider, Grid} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import AddRowButton from "./AddRowButton";

//Basic Layout and functionality for note tabs that use a grid. Includes support to
// add a row, but likely this state will be lifted in the future
export default class GridContent extends Component {
    constructor(props) {
        super(props);
        this.defaultRows = this.props.rows;
        this.onChange = this.props.onChange;
        this.addRow = this.addRow.bind(this);
        this.state = {
            rows: this.defaultRows
            //TODO: refactor this workflow
        }
    }

    addRow() {
        let nextState = this.state;
        nextState.rows.push(this.props.customNoteRow);
        this.setState(nextState);
    }

    render(){
        return(
            <Fragment>
                <br/>
                {this.props.contentHeader}
                <Divider/>
                <Grid columns={this.props.numColumns} verticalAlign='middle'>
                    {this.props.rows}
                </Grid>
                <AddRowButton onClick={this.addRow}/>
            </Fragment>
        );
    }
}

GridContent.propTypes = {
    contentHeader: PropTypes.any.isRequired, //Heading that goes over the divider
    numColumns: PropTypes.number.isRequired, //Number of columns in the grid
    rows: PropTypes.array.isRequired, //The rows that will comprise the body of the note. Array of Grid.Row Components.
    customNoteRow: PropTypes.any.isRequired, //The row that is added to the note when the add row button is clicked
};

