import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input, Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TableContent.css';

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidYear: false,
        };
    }

    onYearChange = (e) => {
        this.setState({ invalidYear: e.target.value !== "" && !/^(19\d\d|20[0-2]\d)$/.test(e.target.value) });
    }

    getCell(placeholder) {
        const {values, name, rowindex, onTableBodyChange, onAddSideEffect, onAddMedication, onAddProcedure, onAddDrink, medicationOptions, sideEffectsOptions, proceduresOptions, drinkOptions, drinkSizes, drugOptions, modesOfDelivery} = this.props;
        let cell;
        const mobile = true;

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
                                multiple
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
                            type="number"
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
                case 'delete': {
                    cell = (
                        <Button
                            rowindex={rowindex}
                            circular
                            icon='close'
                            size='mini'
                            basic
                            onClick={this.props.handleDelete}
                        />      
                    )
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
                                optiontype='proceduresOptions'
                                type={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[rowindex][placeholder]}
                                onAddItem={onAddItem}
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
                                optiontype='sideEffectsOptions'
                                type={placeholder}                    
                                onChange={onTableBodyChange}
                                placeholder={placeholder}
                                rowindex={rowindex}
                                onChange={onTableBodyChange}
                                value={values[name]["fields"][rowindex][placeholder]}
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
                case 'Start Year':
                    cell = (
                        <div className='table-year-input'>
                            <TextArea
                                rows={3}
                                type='number'
                                onChange={onTableBodyChange}
                                onBlur={this.onYearChange}
                                rowindex={rowindex}
                                value={values[rowindex][placeholder]}
                                className='table-row-text'
                            />
                            { this.state.invalidYear && (
                                <p className='error'>Please enter a year between 1900 and 2020</p>
                            )}
                        </div>
                    )
                    break;
                case 'Reason for Taking':
                    cell = (
                        <Input
                            fluid
                            className='content-input-computer content-dropdown'
                        >
                            <Dropdown
                                fluid
                                search
                                selection
                                allowAdditions
                                icon=''
                                options={diseaseOptions}
                                optiontype='diseaseOptions'
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[rowindex][placeholder]}
                                onAddItem={onAddItem}
                                className='side-effects'
                            />
                        </Input>
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
                <Table.Cell key={index} collapsing={placeholder === 'delete' ? true : false} style={placeholder === 'delete' ? { borderTop: 0, borderLeft: 0 } : null}>
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