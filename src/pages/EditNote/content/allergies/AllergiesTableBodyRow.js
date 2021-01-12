import React, { Component } from 'react';
import { Table, TextArea } from 'semantic-ui-react';

export class AllergiesTableBodyRow extends Component {
    handleCellClick = (e) => {
        const innerInput = e.target.lastElementChild;
        // Handles clicks outside of the "clickable area" (padding) of the textarea component within a cell
        if (innerInput != null) {
            if (innerInput.type === 'textarea') {
                innerInput.focus();
            }
        }
    };

    render() {
        const { fields, onTableBodyChange, rowindex, values } = this.props;

        const tableRows = fields.map((field, index) => {
            return (
                <Table.Cell key={index} onClick={this.handleCellClick}>
                    <TextArea
                        rows={3}
                        type={field}
                        onChange={onTableBodyChange}
                        rowindex={rowindex}
                        value={values[rowindex][field]}
                        className='table-row-text'
                    />
                </Table.Cell>
            );
        });

        return <Table.Row>{tableRows}</Table.Row>;
    }
}
