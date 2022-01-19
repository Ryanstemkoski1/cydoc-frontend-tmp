import React, { Component } from 'react';
import { SurgicalHistoryState } from 'redux/reducers/surgicalHistoryReducer';
import { Table } from 'semantic-ui-react';

interface SurgicalHistoryProps {
    isRich: boolean;
    surgicalHistory: SurgicalHistoryState;
}

export class SurgicalHistoryNote extends Component<SurgicalHistoryProps> {
    checkEmpty = () => {
        for (const id in this.props.surgicalHistory) {
            if (
                !(
                    this.props.surgicalHistory[id].procedure === '' &&
                    this.props.surgicalHistory[id].year === -1 &&
                    this.props.surgicalHistory[id].comments === ''
                )
            ) {
                return false;
            }
        }
        return true;
    };

    trimSurgicalProcedure = (procedure: string) => {
        return procedure.split(' ').slice(1).join(' ');
    };

    render() {
        const { isRich, surgicalHistory } = this.props;

        if (this.checkEmpty()) {
            return <div />;
        } else if (isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Procedure</Table.HeaderCell>
                            <Table.HeaderCell>Year</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(surgicalHistory).map((surgical) =>
                            surgical.procedure !== '' ? (
                                <Table.Row>
                                    <Table.Cell>
                                        {this.trimSurgicalProcedure(
                                            surgical.procedure
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {surgical.year !== -1
                                            ? surgical.year
                                            : null}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {surgical.comments
                                            ? surgical.comments
                                            : null}
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
                    {Object.values(surgicalHistory).map((surgical) =>
                        surgical.procedure !== '' ? (
                            <li>
                                <b>
                                    {this.trimSurgicalProcedure(
                                        surgical.procedure
                                    )}{' '}
                                </b>
                                {surgical.year !== -1
                                    ? `${surgical.year}. `
                                    : null}
                                {surgical.comments ? surgical.comments : null}
                            </li>
                        ) : null
                    )}
                </ul>
            );
        }
    }
}

export default SurgicalHistoryNote;
