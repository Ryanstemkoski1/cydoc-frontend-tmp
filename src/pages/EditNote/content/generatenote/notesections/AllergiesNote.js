import React from 'react';
import { Table } from 'semantic-ui-react';

class AllergiesNote extends React.Component {
    checkEmpty() {
        for (const key in this.props.allergies) {
            if (
                !(
                    this.props.allergies[key]['Inciting Agent'] === '' &&
                    this.props.allergies[key]['Reaction'] === '' &&
                    this.props.allergies[key]['Comments'] === ''
                )
            ) {
                return false;
            }
        }
        return true;
    }

    render() {
        const allergies = this.props.allergies;

        if (this.checkEmpty()) {
            return <div>No allergies reported.</div>;
        } else if (this.props.isRich) {
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
                        {Object.keys(allergies).map((key, index) => (
                            <Table.Row key={index}>
                                {allergies[key]['Inciting Agent'] ? (
                                    <Table.Cell>
                                        {allergies[key]['Inciting Agent']}
                                    </Table.Cell>
                                ) : null}
                                {allergies[key]['Reaction'] ? (
                                    <Table.Cell>
                                        {allergies[key]['Reaction']}
                                    </Table.Cell>
                                ) : null}
                                {allergies[key]['Comments'] ? (
                                    <Table.Cell>
                                        {allergies[key]['Comments']}
                                    </Table.Cell>
                                ) : null}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            );
        }

        return (
            <ul>
                {Object.keys(allergies).map((key) =>
                    allergies[key]['Inciting Agent'] ? (
                        <li>
                            <b>{allergies[key]['Inciting Agent']}. </b>
                            {allergies[key]['Reaction']
                                ? `Reaction: ${allergies[key]['Reaction']}. `
                                : null}
                            {allergies[key]['Comments']
                                ? `Comments: ${allergies[key]['Comments']}`
                                : null}
                        </li>
                    ) : null
                )}
            </ul>
        );
    }
}

export default AllergiesNote;
