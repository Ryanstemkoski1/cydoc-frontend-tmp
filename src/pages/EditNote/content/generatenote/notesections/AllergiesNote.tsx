import React, { Component } from 'react';
import { AllergiesState } from 'redux/reducers/allergiesReducer';
import { Table } from 'semantic-ui-react';

interface AllergiesProps {
    isRich: boolean;
    allergies: AllergiesState;
    hasAllergies?: boolean | null;
}

export class AllergiesNote extends Component<AllergiesProps> {
    checkEmpty = () => {
        for (const id in this.props.allergies) {
            if (
                !(
                    this.props.allergies[id].incitingAgent === '' &&
                    this.props.allergies[id].reaction === '' &&
                    this.props.allergies[id].comments === ''
                )
            ) {
                return false;
            }
        }
        return true;
    };

    render() {
        const { isRich, allergies, hasAllergies } = this.props;

        // hasAllergies is value of the YES/NO question on allergies form
        if (hasAllergies === false) {
            return <div>The patient has no allergies.</div>;
        } else if (this.checkEmpty()) {
            return <div />;
        } else if (isRich) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Inciting Agent</Table.HeaderCell>
                            <Table.HeaderCell>Reaction</Table.HeaderCell>
                            <Table.HeaderCell>Comments</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.values(allergies).map(
                            (allergies, i) =>
                                allergies.incitingAgent !== '' && (
                                    <Table.Row key={i}>
                                        <Table.Cell>
                                            {allergies.incitingAgent
                                                ? allergies.incitingAgent
                                                : null}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {allergies.reaction
                                                ? allergies.reaction
                                                : null}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {allergies.comments
                                                ? allergies.comments
                                                : null}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                        )}
                    </Table.Body>
                </Table>
            );
        } else {
            return (
                <ul>
                    {Object.values(allergies).map((allergies, i) =>
                        allergies.incitingAgent ? (
                            <li key={i}>
                                <b>{allergies.incitingAgent}. </b>
                                {allergies.reaction &&
                                    `Reaction: ${allergies.reaction}. `}
                                {allergies.comments &&
                                    `Comments: ${allergies.comments}`}
                            </li>
                        ) : null
                    )}
                </ul>
            );
        }
    }
}

export default AllergiesNote;
