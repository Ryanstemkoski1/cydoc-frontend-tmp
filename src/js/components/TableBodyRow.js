import React, {Component} from "react";
import {Input, Table, TextArea} from "semantic-ui-react";
import PropTypes from "prop-types";
import DatePicker from "react-date-picker";

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    render() {
        const {values, rowindex, onTableBodyChange} = this.props;
        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        return (
            <Table.Row>
                {this.props.tableBodyPlaceholders.map((placeholder, index) =>
                    <Table.Cell key={index}>
                        {/* {placeholder === "Date" ? <DatePicker /> : */}
                        <TextArea
                            // transparent
                            style = {{outline: 'transparent', border: "none", width: "100%", height: "100%", resize: "none"}}
                            type = {placeholder === "Date" ? "date" : "text"}
                            placeholder={placeholder}
                            onChange={onTableBodyChange}
                            rowindex={rowindex}
                            value={values[rowindex][placeholder]}
                        />
                    </Table.Cell>)}
            </Table.Row>
        );
    }
}

TableBodyRow.propTypes = {
    tableBodyPlaceholders: PropTypes.arrayOf(PropTypes.any),
    onTableBodyChange: PropTypes.func,
    rowindex: PropTypes.number
};