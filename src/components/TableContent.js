import React, {Component, Fragment} from 'react';
import {Table} from "semantic-ui-react";
import AddRowButton from "./AddRowButton"
import PropTypes from 'prop-types';
import {TableBodyRow} from "./TableBodyRow";

export default class TableContent extends Component {
    constructor(props) {
        super(props);
        // TODO: add back addRow functionality
        // this.addRow = this.addRow.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
    }

    handleTableBodyChange(event, data){
        console.log(data);
        let newState = this.props.values;
        newState[data.rowindex][data.placeholder] = data.value;
        console.log(newState);
        this.props.onTableBodyChange(data, newState);
    }

    makeTableBodyRows(){
        const nums = [0,1,2];
        return nums.map((rowindex, index) => <TableBodyRow
            key={index}
            rowindex={rowindex}
            tableBodyPlaceholders={this.props.tableBodyPlaceholders}
            onTableBodyChange={this.handleTableBodyChange}
            values={this.props.values}
        />)
    }

    makeHeader(){
        return(
            <Table.Row>
                {this.props.tableHeaders.map((header, index) =>
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    // addRow() {
    //     let nextState = this.state;
    //     nextState.rows.push(this.tableBodyRow);
    //     this.setState(nextState);
    // }

    render(){
        const headerRow = this.makeHeader();
        const rows = this.makeTableBodyRows();
        return (
            <Fragment>
                <br/>
                <Table celled>
                    <Table.Header>
                        {headerRow}
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
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
