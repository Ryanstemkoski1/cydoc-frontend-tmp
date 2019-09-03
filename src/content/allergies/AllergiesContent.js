import React, { Component } from 'react';
import TableContent from "../TableContent";

const fields = ['Inciting Agent', 'Reaction', 'Comments'];
const contentLabel = ['allergies'];

export default class AllergiesContent extends Component {
    render(){
        return (
            <TableContent tableHeaders={fields} tableBodyPlaceholders={fields} contentLabel={contentLabel}/>
        );
    }
}
