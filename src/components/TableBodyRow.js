import React, {Component} from "react";
import {Input, Table} from "semantic-ui-react";
import PropTypes from "prop-types";

export class TableBodyRow extends Component {
    render() {
        const {values, rowindex, onTableBodyChange} = this.props;

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