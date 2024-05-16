import React, { Component } from 'react';
import { ReviewOfSystemsState } from '@redux/reducers/reviewOfSystemsReducer';
import { YesNoResponse } from 'constants/enums';
import { Table } from 'semantic-ui-react';

interface ROSProps {
    ROSState: ReviewOfSystemsState;
    isRich: boolean;
}

export class ReviewOfSystemsNote extends Component<ROSProps> {
    render() {
        const { ROSState } = this.props;
        const review = ROSState;

        const components: {
            [category: string]: {
                [key: string]: string[];
            };
        } = {};
        for (const category in review) {
            const positives: string[] = [];
            const negatives: string[] = [];
            for (const option in review[category]) {
                if (review[category][option] === YesNoResponse.Yes) {
                    positives.push(option.toLowerCase());
                } else if (review[category][option] === YesNoResponse.No) {
                    negatives.push(option.toLowerCase());
                }
            }
            components[category] = {
                positives: positives,
                negatives: negatives,
            };
        }

        let isEmpty = true;
        for (const category in components) {
            if (
                !(
                    components[category].positives.length === 0 &&
                    components[category].negatives.length === 0
                )
            ) {
                isEmpty = false;
            }
        }

        if (isEmpty) {
            return <div />;
        }

        return this.props.isRich ? (
            <Table>
                <Table.Header>
                    <Table.HeaderCell>System</Table.HeaderCell>
                    <Table.HeaderCell>Notes</Table.HeaderCell>
                </Table.Header>
                {Object.keys(components).map(
                    (key) =>
                        (components[key].positives.length > 0 ||
                            components[key].negatives.length > 0) && (
                            <Table.Row key={key}>
                                <Table.Cell>
                                    <b>{key}</b>
                                </Table.Cell>
                                <Table.Cell>
                                    {components[key].positives.length > 0
                                        ? `Positive for ${components[
                                              key
                                          ].positives.join(', ')}. `
                                        : null}
                                    {components[key].negatives.length > 0
                                        ? `Negative for ${components[
                                              key
                                          ].negatives.join(', ')}. `
                                        : null}
                                </Table.Cell>
                            </Table.Row>
                        )
                )}
            </Table>
        ) : (
            <ul>
                {Object.keys(components).map((key) =>
                    components[key].positives.length > 0 ||
                    components[key].negatives.length > 0 ? (
                        <li key={key}>
                            <b>{key}: </b>
                            {components[key].positives.length > 0
                                ? `Positive for ${components[
                                      key
                                  ].positives.join(', ')}. `
                                : null}
                            {components[key].negatives.length > 0
                                ? `Negative for ${components[
                                      key
                                  ].negatives.join(', ')}. `
                                : null}
                        </li>
                    ) : null
                )}
            </ul>
        );
    }
}

export default ReviewOfSystemsNote;
