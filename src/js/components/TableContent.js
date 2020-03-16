import React, {Component, Fragment} from 'react';
import {Table} from "semantic-ui-react";
import AddRowButton from "./AddRowButton"
import PropTypes from 'prop-types';
import {TableBodyRow} from "./TableBodyRow";
import HPIContext from "../contexts/HPIContext"

//Component for a table layout
export default class TableContent extends Component {
    static contextType = HPIContext
    constructor(props, context) {
        super(props, context);
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data){ 
        let newState = this.props.values;
        newState[data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    //method to generate an collection of rows
    makeTableBodyRows(nums){
        return nums.map((rowindex, index) => <TableBodyRow
            key={index}
            rowindex={rowindex}
            tableBodyPlaceholders={this.props.tableBodyPlaceholders}
            onTableBodyChange={this.handleTableBodyChange}
            values={this.props.values}
        />)
    }

    //Method to generate the table header row
    makeHeader(){
        return(
            <Table.Row>
                {this.props.tableHeaders.map((header, index) =>
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    addRow() {
        let values = this.context[this.props.category]
        var last_index = values.length.toString()
        values[last_index] = {Procedure: "", Date: "", Comments: ""}
        this.context.onContextChange(this.props.category, values);
    }

    render(){
        var nums = Object.keys(this.props.values)
        const headerRow = this.makeHeader();
        var rows = this.makeTableBodyRows(nums);
        return (
            <Fragment>
                <br/>
                <div style={{width: "100%", height: "100%", overflowX: 'auto'}}> 
                <Table celled>
                    <Table.Header>
                        {headerRow}
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                </div>
                <AddRowButton onClick={this.addRow}/>
            </Fragment>
        );
    }
}

TableContent.propTypes = {
    tableHeaders: PropTypes.array.isRequired,
    tableBodyPlaceholders: PropTypes.array.isRequired,
    onTableBodyChange: PropTypes.func,
    values: PropTypes.any.isRequired
};
