import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { MedicalHistoryState } from 'redux/reducers/medicalHistoryReducer';
import { Table } from 'semantic-ui-react';

interface MedicalHistoryProps {
    isRich: boolean;
    medicalHistory: MedicalHistoryState;
}

export class MedicalHistoryNote extends Component<MedicalHistoryProps> {
    checkEmpty = () => {
        for (const id in this.props.medicalHistory) {
            if (
                this.props.medicalHistory[id].hasBeenAfflicted !==
                YesNoResponse.None
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
        const { isRich, medicalHistory } = this.props;

        // console.log("MedicalHistoryNote1 " + isRich);

        const conditions: {
            [index: string]: any;
        } = [];

        for (const key in medicalHistory) {
            if (medicalHistory[key].hasBeenAfflicted === YesNoResponse.Yes) {
                conditions.push(medicalHistory[key]);
            }
        }

        if (this.checkEmpty()) {
            // console.log("MedicalHistoryNote2 " + isRich);
            return <div />;
        } else if (isRich) {
            // console.log("MedicalHistoryNote3 " + isRich);
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Condition</Table.HeaderCell>
                            <Table.HeaderCell>Start Year</Table.HeaderCell>
                            <Table.HeaderCell>
                                Condition Resolved?
                            </Table.HeaderCell>
                            <Table.HeaderCell>End Year</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(conditions).map((condition, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{condition.condition}</Table.Cell>
                                <Table.Cell>
                                    {condition.startYear > 0
                                        ? condition.startYear
                                        : null}
                                </Table.Cell>
                                <Table.Cell>
                                    {condition.hasConditionResolved
                                        ? condition.hasConditionResolved
                                        : null}
                                </Table.Cell>
                                <Table.Cell>
                                    {condition.endYear > 0
                                        ? condition.endYear
                                        : null}
                                </Table.Cell>
                                <Table.Cell>
                                    {condition.comments
                                        ? condition.comments
                                        : null}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            );
        } else {
            return (
                <ul>
                    {Object.values(conditions).map((condition, i) => (
                        <li key={i}>
                            <b>{condition.condition} </b>
                            {condition.startYear !== -1
                                ? `started in ${condition.startYear.toString()}. `
                                : ''}
                            {condition.hasConditionResolved ===
                            YesNoResponse.Yes
                                ? `resolved${
                                      condition.endYear !== -1
                                          ? ' (' +
                                            condition.endYear.toString() +
                                            ')'
                                          : ''
                                  }. `
                                : ''}
                            {condition.comments
                                ? condition.comments
                                      .substring(0, 1)
                                      .toUpperCase() +
                                  condition.comments.substring(1)
                                : null}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}

export default MedicalHistoryNote;
