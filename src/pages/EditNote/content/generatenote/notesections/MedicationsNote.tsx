import React, { Component } from 'react';
import { MedicationsState } from 'redux/reducers/medicationsReducer';
import { Table } from 'semantic-ui-react';

interface MedicationsProps {
    isRich: boolean;
    medications: MedicationsState;
}

export class MedicationsNote extends Component<MedicationsProps> {
    checkEmpty = () => {
        for (const id in this.props.medications) {
            if (
                !(
                    this.props.medications[id].comments === '' &&
                    this.props.medications[id].dose === '' &&
                    this.props.medications[id].drugName === '' &&
                    this.props.medications[id].schedule === '' &&
                    this.props.medications[id].startYear === -1 &&
                    this.props.medications[id].sideEffects.length === 0
                )
            ) {
                return false;
            }
        }
        return true;
    };

    render() {
        const { isRich, medications } = this.props;

        if (this.checkEmpty()) {
            return <div>No medications reported.</div>;
        } else if (isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Drug Name</Table.HeaderCell>
                            <Table.HeaderCell>Start Year</Table.HeaderCell>
                            <Table.HeaderCell>Schedule</Table.HeaderCell>
                            <Table.HeaderCell>Dose</Table.HeaderCell>
                            <Table.HeaderCell>
                                Reason for Taking
                            </Table.HeaderCell>
                            <Table.HeaderCell>Side Effects</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(medications).map((medication, i) =>
                            medication.drugName !== '' ? (
                                <Table.Row key={i}>
                                    <Table.Cell>
                                        {medication.drugName}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {medication.startYear !== -1 &&
                                            medication.startYear}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {medication.schedule}
                                    </Table.Cell>
                                    <Table.Cell>{medication.dose}</Table.Cell>
                                    <Table.Cell>
                                        {medication.reasonForTaking}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {medication.sideEffects.join(', ')}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {medication.comments}
                                    </Table.Cell>
                                </Table.Row>
                            ) : null
                        )}
                    </Table.Body>
                </Table>
            );
        } else {
            return (
                <ul>
                    {Object.values(medications).map((medication, i) =>
                        medication.drugName ? (
                            <div key={i}>
                                <li>
                                    <b>{medication.drugName}</b>
                                </li>
                                <ul>
                                    {medication.startYear !== -1 ? (
                                        <li>
                                            Start Year: {medication.startYear}
                                        </li>
                                    ) : null}
                                    {medication.schedule ? (
                                        <li>Schedule: {medication.schedule}</li>
                                    ) : null}
                                    {medication.dose ? (
                                        <li>Dose: {medication.dose}</li>
                                    ) : null}
                                    {medication.reasonForTaking ? (
                                        <li>
                                            Reason for Taking:{' '}
                                            {medication.reasonForTaking}
                                        </li>
                                    ) : null}
                                    {medication.sideEffects.length > 0 ? (
                                        <li>
                                            Side Effects:{' '}
                                            {medication.sideEffects.join(', ')}
                                        </li>
                                    ) : null}
                                    {medication.comments ? (
                                        <li>Comments: {medication.comments}</li>
                                    ) : null}
                                </ul>
                            </div>
                        ) : null
                    )}
                </ul>
            );
        }
    }
}

export default MedicationsNote;
