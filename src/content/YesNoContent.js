import {Button, Divider, Grid} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import AddRowButton from "../components/AddRowButton";

export default class YesNoContent extends Component {
    constructor(props) {
        super(props);
        this.customNoteRow = this.props.customNoteRow;
        this.defaultRows = this.props.listItems;
        this.onChange = this.props.onChange
        this.addRow = this.addRow.bind(this);
        this.state = {
            rows: this.defaultRows
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
                <Grid columns={this.props.numColumns} verticalAlign='middle' >
                    {this.state.rows.map(row => row)}
                </Grid>
                <AddRowButton onClick={this.addRow}/>
            </Fragment>
        );
    }
}

YesNoContent.propTypes = {
    contentHeader: PropTypes.any.isRequired,
    numColumns: PropTypes.number.isRequired,
    listItems: PropTypes.array.isRequired,
    customNoteRow: PropTypes.any.isRequired,
};

