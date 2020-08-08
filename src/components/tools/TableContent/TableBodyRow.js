import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TableContent.css';

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    getCell(placeholder) {
        const {values, name, rowindex, onTableBodyChange, onAddSideEffect, onAddMedication, onAddProcedure, onAddDrink, medicationOptions, sideEffectsOptions, proceduresOptions, drinkOptions, drinkSizes, drugOptions, modesOfDelivery} = this.props;
        let cell;

        if (name === 'Alcohol' || name === 'Recreational Drugs') {
            switch (placeholder) {
                case 'Drink Type': {
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
                                options={drinkOptions}
                                placeholder={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[name]["fields"][rowindex][placeholder]}
                                onAddItem={onAddDrink}
                                className='side-effects'
                            />
                        </Input>
                    );
                    break;
                }
                case 'Drink Size': {
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
                                options={drinkSizes}
                                placeholder={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[name]["fields"][rowindex][placeholder]}
                                className='side-effects'
                            />
                        </Input>
                    );
                    break;
                }
                // this one is for recreational drugs
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
                                options={drugOptions}
                                placeholder={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[name]["fields"][rowindex][placeholder]}
                                className='side-effects'
                            />
                        </Input>
                    );
                    break;
                }
                case 'Mode of Delivery': {
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
                                options={modesOfDelivery}
                                placeholder={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[name]["fields"][rowindex][placeholder]}
                                className='side-effects'
                            />
                        </Input>
                    );
                    break;
                }
                case '# Per Week': {
                    cell = (
                        <Input
                            fluid
                            className='content-input-computer content-dropdown'
                            onChange={onTableBodyChange}
                            placeholder={placeholder}
                            rowindex={rowindex}
                            onChange={onTableBodyChange}
                            value={values[name]["fields"][rowindex][placeholder]}
                        />
                    );
                    break;
                }
            }
        } else {
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
                // this one is for medications
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