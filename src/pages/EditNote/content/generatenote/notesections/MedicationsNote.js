import React from 'react';
import { Table } from 'semantic-ui-react';

class MedicationsNote extends React.Component {
    checkEmpty() {
        for (const key in this.props.medications) {
            if (!(this.props.medications[key]["Comments"] === "" && this.props.medications[key]["Dose"] === "" && this.props.medications[key]["Drug Name"] === "" && this.props.medications[key]["Schedule"] === "" && this.props.medications[key]["Start Year"] === "" && this.props.medications[key]["Side Effects"].length === 0)) {
                return false;
            }
        }
        return true;
    }

    render() {
        const medications = this.props.medications;

        if (this.checkEmpty()) {
            return (
                <div>No medications reported.</div>
            );
        }

        else if (this.props.isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Drug Name</Table.HeaderCell>
                            <Table.HeaderCell>Start Date</Table.HeaderCell>
                            <Table.HeaderCell>Schedule</Table.HeaderCell>
                            <Table.HeaderCell>Dose</Table.HeaderCell>
                            <Table.HeaderCell>Reason for Taking</Table.HeaderCell>
                            <Table.HeaderCell>Side Effects</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(medications).map(key => (
                            medications[key]['Drug Name'] ?
                            <Table.Row>
                                {medications[key]['Drug Name'] ? <Table.Cell>{medications[key]['Drug Name']}</Table.Cell> : null}
                                {medications[key]['number'] ? <Table.Cell>{medications[key]['number']}</Table.Cell> : null}
                                {medications[key]['Schedule'] ? <Table.Cell>{medications[key]['Schedule']}</Table.Cell> : null}
                                {medications[key]['Dose'] ? <Table.Cell>{medications[key]['Dose']}</Table.Cell> : null}
                                {medications[key]['Reason for Taking'] ? <Table.Cell>{medications[key]['Reason for Taking']}</Table.Cell> : null}
                                {medications[key]['Side Effects'].length > 0 ? <Table.Cell>{medications[key]['Side Effects'].join(', ')}</Table.Cell> : null}
                                {medications[key]['Comments'] ? <Table.Cell>{medications[key]['Comments']}</Table.Cell> : null}
                            </Table.Row> : null
                        ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <ul>
                {Object.keys(medications).map(key => (
                    medications[key]['Drug Name'] ?
                        <div>
                            <li><b> {medications[key]['Drug Name']}</b></li>
                            <ul>
                                {medications[key]['number'] ? <li key={key}>Start Date: {medications[key]['number']}</li> : null}
                                {medications[key]['Schedule'] ? <li key={key}>Schedule: {medications[key]['Schedule']}</li> : null}
                                {medications[key]['Dose'] ? <li key={key}>Dose: {medications[key]['Dose']}</li> : null}
                                {medications[key]['Reason for Taking'] ? <li key={key}>Reason for Taking: {medications[key]['Reason for Taking']}</li> : null}
                                {medications[key]['Side Effects'].length > 0 ? <li key={key}>Side Effects: {medications[key]['Side Effects'].join(', ')}</li> : null}
                                {medications[key]['Comments'] ? <li key={key}>Comments: {medications[key]['Comments']}</li> : null}
                            </ul> 
                        </div> : null
                ))}
            </ul>
        )
    }
}

export default MedicationsNote;