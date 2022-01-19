import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { FamilyHistoryConditionFlat } from 'redux/selectors/familyHistorySelectors';
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
            }
        }

        if (this.checkEmpty()) {
            return <div />;
        } else if (!this.props.isRich) {
            return (
                <ul>
                    {Object.keys(components).map((key, index) => {
                        const conditionText =
                            components[key].family.length > 0
                                ? `${components[key].family.join(', ')}. `
                                : null;
                        return (
                            conditionText !== null && (
                                <li key={index}>
                                    <b>{components[key].condition}: </b>
                                    {conditionText}
                                </li>
                            )
                        );
                    })}
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
                                components[key].family.length > 0
                                    ? `${components[key].family.join('; ')}. `
                                    : null;
                            return (
                                conditionText !== null && (
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                            {<b>{components[key].condition}</b>}
                                        </Table.Cell>
                                        <Table.Cell>{conditionText}</Table.Cell>
                                    </Table.Row>
                                )
                            );
                        })}
                    </Table.Body>
                </Table>
            );
        }
    }
}

export default FamilyHistoryNote;
