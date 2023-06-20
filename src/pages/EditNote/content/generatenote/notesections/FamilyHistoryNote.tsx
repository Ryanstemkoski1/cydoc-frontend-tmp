import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { Table } from 'semantic-ui-react';

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
    isRich: boolean;
}

export class FamilyHistoryNote extends Component<FamilyHistoryProps> {
    checkEmpty = () => {
        for (const id in this.props.familyHistory) {
            if (
                this.props.familyHistory[id].hasAfflictedFamilyMember !==
                YesNoResponse.None
            ) {
                return false;
            }
        }
        return true;
    };

    render() {
        const { familyHistory } = this.props;

        const components: {
            [conditionIndex: string]: {
                [condition: string]: any;
            };
        } = {};
        const noHistory: string[] = [];
        for (const conditionIndex in familyHistory) {
            const familyMembersArray: string[] = [];
            const familyCondition = familyHistory[conditionIndex];
            // if condition has afflicted family members
            if (
                familyCondition.hasAfflictedFamilyMember === YesNoResponse.Yes
            ) {
                // if family members are listed
                if (familyCondition.familyMembers) {
                    // loop through each family member
                    for (const index in familyCondition.familyMembers) {
                        const familyMember =
                            familyCondition.familyMembers[index];
                        let status = '';

                        if (familyMember.causeOfDeath === YesNoResponse.Yes) {
                            status = `(died of ${familyCondition.condition})`;
                        } else if (
                            familyMember.causeOfDeath === YesNoResponse.No &&
                            familyMember.living === YesNoResponse.Yes
                        ) {
                            status = '(still living)';
                        } else if (
                            familyMember.causeOfDeath === YesNoResponse.No &&
                            familyMember.living === YesNoResponse.No
                        ) {
                            status = '(not the cause of death)';
                        }
                        familyMembersArray.push(
                            `${familyMember.member} ${status}${
                                familyMember.comments ? ', ' : ''
                            }${familyMember.comments}`
                        );
                    }
                }

                components[conditionIndex] = {
                    condition: familyCondition.condition,
                    family: familyMembersArray,
                };
            } else if (
                familyCondition.hasAfflictedFamilyMember === YesNoResponse.No
            ) {
                if (familyCondition.condition !== '') {
                    noHistory.push(familyCondition.condition);
                }
            }
        }

        if (this.checkEmpty()) {
            return <div />;
        } else if (!this.props.isRich) {
            return (
                <ul>
                    {Object.keys(components).map((key, index) => {
                        const conditionText =
                            components[key].family.length > 0 &&
                            components[key].family[0] !== ' '
                                ? `${components[key].family.join(', ')}. `
                                : '';
                        return (
                            <li key={index}>
                                <b>
                                    {components[key].condition}
                                    {conditionText.length > 0 ? ':' : ''}{' '}
                                </b>
                                {conditionText}
                            </li>
                        );
                    })}
                    {noHistory && noHistory.length >= 1 ? (
                        <li>
                            No family history of{' '}
                            {noHistory.length > 1
                                ? noHistory.slice(0, -1).join(', ') +
                                  ', or ' +
                                  noHistory.slice(-1)
                                : noHistory[0]}
                            .
                        </li>
                    ) : null}
                </ul>
            );
        } else {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Condition</Table.HeaderCell>
                            <Table.HeaderCell>Family History</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(components).map((key, index) => {
                            const conditionText =
                                components[key].family.length > 0 &&
                                components[key].family[0] !== ' '
                                    ? `${components[key].family.join('; ')}. `
                                    : '';
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        {<b>{components[key].condition}</b>}
                                    </Table.Cell>
                                    <Table.Cell>{conditionText}</Table.Cell>
                                </Table.Row>
                            );
                        })}
                        {noHistory ? (
                            <Table.Row>
                                <Table.Cell>No family history of</Table.Cell>
                                <Table.Cell>
                                    {noHistory.length > 1
                                        ? noHistory.slice(0, -1).join(', ') +
                                          ', or ' +
                                          noHistory.slice(-1)
                                        : noHistory[0]}
                                    .
                                </Table.Cell>
                            </Table.Row>
                        ) : null}
                    </Table.Body>
                </Table>
            );
        }
    }
}

export default FamilyHistoryNote;
