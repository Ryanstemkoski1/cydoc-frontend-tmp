import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input } from 'semantic-ui-react';

//Controlled component for a row in a TableContent component
export class SurgicalHistoryTableBodyRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidYear: this.props.isInvalidYear,
        };
        this.onYearChange = this.onYearChange.bind(this);
    }

    onYearChange = (e) => {
        const startYear = +e.target.value;
        this.setState({
            invalidYear:
                e.target.value !== '' &&
                (isNaN(startYear) ||
                    startYear < 1900 ||
                    startYear > this.props.currentYear),
        });
    };

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

    getCell(field) {
        const {
            values,
            rowindex,
            onTableBodyChange,
            onAddItem,
            proceduresOptions,
            isPreview,
        } = this.props;
        if (isPreview) {
            return (
                <div className='content-preview'>
                    {field === 'Procedure' ? rowindex : ''}
                </div>
            );
        }
        let cell;

        switch (field) {
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
                            options={proceduresOptions}
                            optiontype='proceduresOptions'
                            type='Procedure'
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[rowindex]['Procedure']}
                            onAddItem={onAddItem}
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case 'Year': {
                cell = (
                    <div className='table-year-input'>
                        <TextArea
                            rows={3}
                            type='Year'
                            onChange={onTableBodyChange}
                            onBlur={this.onYearChange}
                            rowindex={rowindex}
                            value={values[rowindex]['Year']}
                            className='table-row-text'
                        />
                        {this.state.invalidYear && (
                            <p className='year-validation-error'>
                                Please enter a valid year between 1900 and 2020
                            </p>
                        )}
                    </div>
                );
                break;
            }
            // Comments
            default: {
                cell = (
                    <TextArea
                        rows={3}
                        type={field}
                        onChange={onTableBodyChange}
                        rowindex={rowindex}
                        value={values[rowindex][field]}
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
        const { fields } = this.props;

        const tableRows = fields.map((field, index) => {
            return (
                <Table.Cell
                    key={index}
                    onClick={this.handleCellClick}
                    style={{ padding: '0px' }}
                >
                    {this.getCell(field)}
                </Table.Cell>
            );
        });

        return <Table.Row>{tableRows}</Table.Row>;
    }
}
