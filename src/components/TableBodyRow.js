import React, {Component} from "react";
import {Input, Table} from "semantic-ui-react";
import PropTypes from "prop-types";

//Controlled component for a row in a TableContent component
export class TableBodyRow extends Component {
    render() {
        const {values, rowindex, onTableBodyChange} = this.props;

        //returns a Table.Row with a cell for each item in tableBodyPlaceholders
        return (
            <Table.Row>
                {this.props.tableBodyPlaceholders.map((placeholder, index) =>
                    <Table.Cell key={index}>
                        <Input
                            transparent
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