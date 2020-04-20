import React, {Component} from "react";
import {TextArea, Table, Dropdown} from "semantic-ui-react";
import PropTypes from "prop-types";

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    render() {
        const {values, rowindex, onTableBodyChange, dropdown, dropdown_placeholder, options} = this.props;
        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        var tableRows = this.props.tableBodyPlaceholders.map((placeholder, index) =>
                        <Table.Cell key={index}>
                            <TextArea
                                className='table'
                                style = {{outline: 'transparent', border: "none", width: "100%", height: "100%", resize: "none"}}
                                type = {placeholder === "Date" ? "date" : "text"}
                                rows={3}
                                type="text"
                                placeholder={placeholder}
                                onChange={onTableBodyChange}
                                rowindex={rowindex}
                                value={values[rowindex][placeholder]}
                            />
                        </Table.Cell>)
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