import { Divider, Grid} from "semantic-ui-react";
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import AddRowButton from "./AddRowButton";

export default class GridContent extends Component {
    constructor(props) {
        super(props);
        this.defaultRows = this.props.rows;
        this.onChange = this.props.onChange;
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
                    {this.props.rows}
                </Grid>
                <AddRowButton onClick={this.addRow}/>
            </Fragment>
        );
    }
}

GridContent.propTypes = {
    contentHeader: PropTypes.any.isRequired,
    numColumns: PropTypes.number.isRequired,
    rows: PropTypes.array.isRequired,
    customNoteRow: PropTypes.any.isRequired,
};

