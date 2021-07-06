import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import AbdomenExamButtons from './AbdomenExamButtons';
import './TableCSS.css';

export default class AbdomenExam extends Component {
    render = () => {
        return (
            <div>
                <Table celled unstackable>
                    <Table.Body>
                        <Table.Row key={'upperQuadrant'}>
                            <Table.Cell>
                                {' '}
                                <div> Right Upper Quadrant</div>
                                <AbdomenExamButtons
                                    key={'rightUpperQuadrant'}
                                    abdomenQuadrant={'rightUpperQuadrant'}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                {' '}
                                <div> Left Upper Quadrant</div>
                                <AbdomenExamButtons
                                    key={'leftUpperQuadrant'}
                                    abdomenQuadrant={'leftUpperQuadrant'}
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row key={'lowerQuadrant'}>
                            <Table.Cell>
                                {' '}
                                <div> Right Lower Quadrant</div>
                                <AbdomenExamButtons
                                    key={'rightLowerQuadrant'}
                                    abdomenQuadrant={'rightLowerQuadrant'}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                {' '}
                                <div> Left Lower Quadrant</div>
                                <AbdomenExamButtons
                                    key={'leftLowerQuadrant'}
                                    abdomenQuadrant={'leftLowerQuadrant'}
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    };
}
