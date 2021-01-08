import React from 'react';
import { Table } from 'semantic-ui-react'

class MedicalHistoryNote extends React.Component {

    checkEmpty() {
        for (const key in this.props.medicalHistory) {
            if (!(this.props.medicalHistory[key].Yes === false && this.props.medicalHistory[key].No === false)) {
                return false;
            }
        }
        return true;
    }

    render() {
        const medicalHistory = this.props.medicalHistory;

        const conditions = [];
        for (var condition in medicalHistory) {
            if (medicalHistory[condition].Yes === true) {
                conditions.push(medicalHistory[condition]);
            }
        }

        if (this.checkEmpty()) {
            return (
                <div>No medical history reported.</div>
            );
        }

        else if (this.props.isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Condition</Table.HeaderCell>
                            <Table.HeaderCell>Onset</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                            {Object.keys(conditions).map(key => (
                                <Table.Row>
                                    <Table.Cell>{conditions[key].Condition}</Table.Cell>
                                    <Table.Cell>{conditions[key].Onset ? conditions[key].Onset : null}</Table.Cell>
                                    <Table.Cell>{conditions[key].Comments ? conditions[key].Comments : null}</Table.Cell>
                                </Table.Row>
                            ))}
                    </Table.Body>
                </Table>
            )
        }
        
        return (
            <ul>
                {Object.keys(conditions).map(key => (
                    <li>
                        <b>{conditions[key].Condition}. </b>
                        {conditions[key].Onset ? `Onset ${conditions[key].Onset}. ` : null} 
                        {conditions[key].Comments ? conditions[key].Comments : null}
                    </li>
                ))}
            </ul>
        )
    }
}

export default MedicalHistoryNote;