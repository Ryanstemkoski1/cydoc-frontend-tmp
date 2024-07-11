import { YesNoResponse } from '@constants/enums';
import React, { Component } from 'react';
import { SurgicalHistoryState } from '@redux/reducers/surgicalHistoryReducer';
import { Table } from 'semantic-ui-react';

interface SurgicalHistoryProps {
    isRich: boolean;
    surgicalHistory: SurgicalHistoryState;
}

export class SurgicalHistoryNote extends Component<SurgicalHistoryProps> {
    checkEmpty = () => {
        const surgicalHistory = this.props.surgicalHistory.elements;
        for (const id in surgicalHistory) {
            if (surgicalHistory[id].hasHadSurgery != YesNoResponse.None) {
                return false;
            }
        }
        return true;
    };

    trimSurgicalProcedure = (procedure: string) => {
        return procedure;
    };

    render() {
        const { isRich } = this.props;
        const { hasSurgicalHistory } = this.props.surgicalHistory;
        const surgicalHistory = this.props.surgicalHistory.elements;

        // hasSurgicalHistory is value of the YES/NO question on surgical history form
        if (hasSurgicalHistory === false) {
            return <div>The patient has never had any surgeries.</div>;
        } else if (this.checkEmpty()) {
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
                        {Object.values(surgicalHistory).map(
                            (surgical, index) =>
                                surgical.procedure !== '' ? (
                                    <Table.Row key={index}>
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
                    {Object.values(surgicalHistory).map((surgical, index) =>
                        surgical.procedure !== '' ? (
                            <li key={index}>
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
