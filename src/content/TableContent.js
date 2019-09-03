import React, {Component} from 'react';
import {Button, Header, Input, Table} from "semantic-ui-react";


export default class TableContent extends Component {
    tableHeaders = [];
    tableBodyPlaceholders = [];
    constructor(props) {
        super(props);
        this.addRow = this.addRow.bind(this);
        TableContent.makeHeader = TableContent.makeHeader.bind(this);
        this.headerRows = TableContent.makeHeader(this.props.tableHeaders);
        this.tableBodyRow = TableContent.makeTableBodyRow(this.props.tableBodyPlaceholders);
        this.contentLabel = this.props.contentLabel;
        this.state = {
            rows: [this.tableBodyRow, this.tableBodyRow, this.tableBodyRow]
        }
    }

    static makeHeader(tableHeaders){
        return tableHeaders.map((header) =>
            <Table.HeaderCell>{header}</Table.HeaderCell>);
    }

    static makeTableBodyRow(tableBodyPlaceholders){
        return (
            <Table.Row>
                    {tableBodyPlaceholders.map((placeholder) =>
                     <Table.Cell>
                        <Input transparent placeholder={placeholder}/>
                     </Table.Cell>)}
            </Table.Row>
        );
    }

    addRow() {
        let nextState = this.state;
        nextState.rows.push(this.tableBodyRow);
        this.setState(nextState);
    }



    render(){
        return (
            <div>
                <Header as="h3" textAlign="center">
                    {this.contentLabel}
                </Header>
                <br />
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {this.headerRows}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.rows.map(row => row)}
                    </Table.Body>
                </Table>
                <div>
                    <Button circular icon="plus" onClick={this.addRow}/>
                    add row
                </div>
            </div>
        );
    }
}
