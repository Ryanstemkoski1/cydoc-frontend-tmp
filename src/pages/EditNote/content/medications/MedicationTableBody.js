import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './Medications.css';

export class MedicationTableBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidYear: false,
        };
    }

    handleCellClick = (e) => {
        const innerInput = e.target.lastElementChild;
        // Handles clicks outside of the "clickable area" (padding) of the input/textarea component within a cell
        if (innerInput !== null) {
            if (innerInput.type === 'textarea') {
                innerInput.focus();
            } else {
                // for Inputs/dropdowns
                innerInput.click();
            }
        }
    };

    onYearChange = (e) => {
        this.setState({
            invalidYear:
                e.target.value !== '' &&
                !/^(19\d\d|20[0-2]\d)$/.test(e.target.value),
        });
    };

    getCell(placeholder) {
        const {
            values,
            rowindex,
            onTableBodyChange,
            onAddItem,
            medicationOptions,
            sideEffectsOptions,
            diseaseOptions,
        } = this.props;

        let cell;

        switch (placeholder) {
            case 'Side Effects': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown content-text'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            compact
                            allowAdditions
                            icon=''
                            options={sideEffectsOptions}
                            optiontype='sideEffectsOptions'
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
            case 'Drug Name': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown drug-text'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            clearable
                            allowAdditions
                            icon=''
                            options={medicationOptions}
                            optiontype='medicationOptions'
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
            case 'Start Year':
                cell = (
                    <div className='table-year-input'>
                        <TextArea
                            rows={3}
                            type={placeholder}
                            onChange={onTableBodyChange}
                            onBlur={this.onYearChange}
                            rowindex={rowindex}
                            value={values[rowindex][placeholder]}
                            className='table-row-text'
                        />
                        {this.state.invalidYear && (
                            <p className='error'>
                                Please enter a year between 1900 and 2020
                            </p>
                        )}
                    </div>
                );
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
                            clearable
                            allowAdditions
                            icon=''
                            options={diseaseOptions}
                            optiontype='diseaseOptions'
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
            default: {
                cell = (
                    <TextArea
                        rows={3}
                        type={placeholder}
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
                <Table.Cell key={index} onClick={this.handleCellClick}>
                    {this.getCell(placeholder)}
                </Table.Cell>
            );
        });

        return <Table.Row>{tableRows}</Table.Row>;
    }
}

MedicationTableBody.propTypes = {
    tableBodyPlaceholders: PropTypes.arrayOf(PropTypes.any),
    onTableBodyChange: PropTypes.func,
    rowindex: PropTypes.number,
};
