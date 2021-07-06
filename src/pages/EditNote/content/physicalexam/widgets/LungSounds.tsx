import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import LungSoundsButtons from './LungSoundsButtons';
import './TableCSS.css';

export default class LungSounds extends Component {
    render = () => {
        return (
            <div>
                <Table celled unstackable>
                    <Table.Body>
                        <Table.Row key='upperLobe'>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Left Upper Lobe</div>
                                <LungSoundsButtons
                                    key='leftUpperLobe'
                                    lungLobe='leftUpperLobe'
                                />
                            </Table.Cell>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Right Upper Lobe</div>
                                <LungSoundsButtons
                                    key='rightUpperLobe'
                                    lungLobe='rightUpperLobe'
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row key='middleLobe'>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Lingula </div>
                                <LungSoundsButtons
                                    key='lingula'
                                    lungLobe='lingula'
                                />
                            </Table.Cell>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Right Middle Lobe</div>
                                <LungSoundsButtons
                                    key='rightMiddleLobe'
                                    lungLobe='rightMiddleLobe'
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row key='lowerLobe'>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Left Lower Lobe</div>
                                <LungSoundsButtons
                                    key='leftLowerLobe'
                                    lungLobe='leftLowerLobe'
                                />
                            </Table.Cell>
                            <Table.Cell verticalAlign='top'>
                                {' '}
                                <div> Right Lower Lobe</div>
                                <LungSoundsButtons
                                    key='rightLowerLobe'
                                    lungLobe='rightLowerLobe'
                                />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        );
    };
}
