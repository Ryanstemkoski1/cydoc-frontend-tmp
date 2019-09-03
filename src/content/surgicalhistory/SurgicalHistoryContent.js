import React, { Component } from 'react';
import TableContent from "../TableContent";

const tableHeaders = ['Procedure', 'Date', 'Comments'];
const tableBodyPlaceholders = ['Procedure', 'Date', 'Comments'];


export default class SurgicalHistoryContent extends Component {
    render(){
        return (
            <TableContent tableHeaders={tableHeaders} tableBodyPlaceholders={tableBodyPlaceholders} />
        );
    }
}
