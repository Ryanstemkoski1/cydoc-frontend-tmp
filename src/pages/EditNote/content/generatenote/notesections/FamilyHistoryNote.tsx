import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { FamilyHistoryState } from 'redux/reducers/familyHistoryReducer';
import { FamilyHistoryConditionFlat } from 'redux/selectors/familyHistorySelectors';

interface FamilyHistoryProps {
    familyHistory: FamilyHistoryState;
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
                            status = '(cause of death)';
                        } else if (
                            familyMember.causeOfDeath === YesNoResponse.No &&
                            familyMember.living === YesNoResponse.Yes
                        ) {
                            status = '(living)';
                        } else if (
                            familyMember.causeOfDeath === YesNoResponse.No &&
                            familyMember.living === YesNoResponse.No
                        ) {
                            status = '(not the cause of death)';
                        }
                        familyMembersArray.push(
                            `${familyMember.member} ${status}, ${familyMember.comments}`
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
            return <div>No family history reported.</div>;
        } else {
            return (
                <ul>
                    {Object.keys(components).map((key, index) => (
                        <li key={index}>
                            <b>{components[key].condition}: </b>
                            {components[key].family.length > 0
                                ? `${components[key].family.join(', ')}. `
                                : null}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}

export default FamilyHistoryNote;
