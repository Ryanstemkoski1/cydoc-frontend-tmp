import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TableContent.css';

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    getCell(placeholder) {
        const {values, rowindex, onTableBodyChange, onAddSideEffect, onAddMedication, onAddProcedure, medicationOptions, sideEffectsOptions, proceduresOptions} = this.props;

        let cell;

        switch (placeholder) {
            case 'Procedure': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            clearable
                            allowAdditions
                            icon=''
                            options={proceduresOptions}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[rowindex][placeholder]}
                            onAddItem={onAddProcedure}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case 'Side Effects': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            allowAdditions
                            icon=''
                            options={sideEffectsOptions}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[rowindex][placeholder]}
                            onAddItem={onAddSideEffect}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case 'Drug Name': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            clearable
                            allowAdditions
                            icon=''
                            options={medicationOptions}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[rowindex][placeholder]}
                            onAddItem={onAddMedication}
                            className='side-effects medication'
                        />
                    </Input>
                );
                break;
            }
            default: {
                cell = (
                    <TextArea
                        rows={3}
                        placeholder={placeholder}
                        onChange={onTableBodyChange}
                        rowindex={rowindex}
                        value={values[rowindex][placeholder]}
                        className='table-row-text'
                    />
                );
                break;
            }
        }
        return cell;
    }

    render() {
        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        const { tableBodyPlaceholders } = this.props;

        const tableRows = tableBodyPlaceholders.map((placeholder, index) => {
            return (
                <Table.Cell key={index}>
                    {this.getCell(placeholder)}
                </Table.Cell>
            )
        });

        return (
            <Table.Row>
                {tableRows}
            </Table.Row>
        );
    }
}

TableBodyRow.propTypes = {
    tableBodyPlaceholders: PropTypes.arrayOf(PropTypes.any),
    onTableBodyChange: PropTypes.func,
    rowindex: PropTypes.number
};