import React, { Component } from 'react';
import { TextArea, Table, Dropdown, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import '../../css/components/tableContent.css';

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    render() {
        const {values, rowindex, onTableBodyChange, onAddItem, dropdown, dropdown_placeholder, options, sideEffectsOptions} = this.props;

        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        var tableRows = this.props.tableBodyPlaceholders.map((placeholder, index) => {

            return (
                placeholder === 'Side Effects' ? (
                <Table.Cell
                    key={index}
                    verticalAlign='top'
                >
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
                            onAddItem={onAddItem}
                            className='side-effects'
                        />
                    </Input>
                </Table.Cell>
            ) : (
                <Table.Cell key={index}>
                    <TextArea
                        rows={3}
                        placeholder={placeholder}
                        onChange={onTableBodyChange}
                        rowindex={rowindex}
                        value={values[rowindex][placeholder]}
                        className='table-row-text'
                    />
                </Table.Cell>
            )
            );
        });

        if (dropdown) {
            const key = tableRows[0].key
            tableRows[0] = <Table.Cell key={key}>
                <Dropdown 
                    placeholder={dropdown_placeholder}
                    fluid
                    search
                    selection
                    clearable
                    options={options}
                    onChange={onTableBodyChange}
                    rowindex={rowindex}
                    value={values[rowindex][dropdown_placeholder]}
                />
            </Table.Cell> 
        }
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