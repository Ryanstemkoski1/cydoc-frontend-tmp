import React from 'react';
import { Table } from 'semantic-ui-react';

class SurgicalHistoryNote extends React.Component {
    render() {
        const surgicalHistory = this.props.surgicalHistory;

        if (this.props.isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Procedure</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {Object.keys(surgicalHistory).map(key => (
                        surgicalHistory[key].Procedure !== "" ?
                        <Table.Row>
                            <Table.Cell>{surgicalHistory[key].Procedure}</Table.Cell>
                            <Table.Cell>{surgicalHistory[key].Date ? surgicalHistory[key].Date : null}</Table.Cell>
                            <Table.Cell>{surgicalHistory[key].Comments ? surgicalHistory[key].Comments : null}</Table.Cell>
                        </Table.Row> : null
                    ))}
                    </Table.Body>
                </Table>
            )
        }

        return (
            <ul>
                {Object.keys(surgicalHistory).map(key => (
                    surgicalHistory[key].Procedure !== "" ?
                    <li>
                        <b>{surgicalHistory[key].Procedure} </b>
                        {surgicalHistory[key].Date ? `${surgicalHistory[key].Date}. ` : null}
                        {surgicalHistory[key].Comments ? surgicalHistory[key].Comments : null}
                    </li> : null
                ))}
            </ul>
        )
    }
}

export default SurgicalHistoryNote;