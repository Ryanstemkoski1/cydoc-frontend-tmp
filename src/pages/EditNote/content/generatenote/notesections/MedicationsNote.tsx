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

    trimDiseaseName = (procedure: string) => {
        return procedure.split(' ').slice(1).join(' ');
    };

    render() {
        const { isRich, medications } = this.props;

        if (this.checkEmpty()) {
            return <div />;
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
                                        {this.trimDiseaseName(
                                            medication.reasonForTaking
                                        )}
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
                                <b>{medication.drugName}.</b>
                                {medication.startYear !== -1
                                    ? ` Start Year: ${medication.startYear.toString()}.`
                                    : ''}
                                {medication.schedule
                                    ? ` Schedule: ${medication.schedule}.`
                                    : ''}
                                {medication.dose
                                    ? ` Dose: ${medication.dose}.`
                                    : ''}
                                {medication.reasonForTaking
                                    ? ` Reason for Taking:
                                            ${this.trimDiseaseName(
                                                medication.reasonForTaking
                                            )}.`
                                    : ''}
                                {medication.sideEffects.length > 0
                                    ? ` Side Effects:
                                            ${medication.sideEffects.join(
                                                ', '
                                            )}. `
                                    : ''}
                                {medication.comments
                                    ? ` Comments: ${medication.comments}.`
                                    : ''}
                            </div>
                        ) : null
                    )}
                </ul>
            );
        }
    }
}

export default MedicationsNote;
