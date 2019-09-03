import React, { Component } from "react";
import TableContent from "../TableContent";

const fields = ['Drug Name', 'Start Date', 'Schedule', 'Dose', 'Reason for Taking', 'Comments'];
const contentLabel = 'medications and supplements';

export default class MedicationsContent extends Component {
    render() {
        return(
            <TableContent  tableHeaders={fields} tableBodyPlaceholders={fields} contentLabel={contentLabel}/>
        );
    }
}