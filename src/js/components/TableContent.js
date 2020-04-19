import React, { Component, Fragment } from 'react';
import { Table, Input, Accordion } from 'semantic-ui-react';
import AddRowButton from './AddRowButton'
import PropTypes from 'prop-types';
import { TableBodyRow } from './TableBodyRow';
import HPIContext from '../contexts/HPIContext';
import '../../css/components/tableContent.css';
 
//Component for a table layout
export default class TableContent extends Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data){ 
        let newState = this.props.values;
        newState[data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    //method to generate an collection of rows
    makeTableBodyRows(nums){
        return nums.map((rowindex, index) => <TableBodyRow
            key={index}
            rowindex={parseInt(rowindex)}
            tableBodyPlaceholders={this.props.tableBodyPlaceholders}
            onTableBodyChange={this.handleTableBodyChange}
            values={this.props.values}
        />)
    }

    //Method to generate the table header row
    makeHeader(){
        return(
            <Table.Row>
                {this.props.tableHeaders.map((header, index) =>
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    addRow() {
        let values = this.context[this.props.category];
        const last_index = values.length.toString();
        values[last_index] = {Procedure: '', Date: '', Comments: ''}
        this.context.onContextChange(this.props.category, values);
    }

    makeAccordionPanels(nums) {
        const { values, tableBodyPlaceholders, name } = this.props;

        const panels = [];

        for (let i = 0; i < nums.length; i++) {
            let titleContent;
            const contentInputs = [];

            switch(name) {
                case 'surgical history': {
                    titleContent = (
                        <Fragment>
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[0]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[0]]}
                            />
                        </Fragment>
                    );
                    break;
                }
                case 'medication': {
                    titleContent = (
                        <Fragment>
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[0]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[0]]}
                            />
                            {' for '}
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[4]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[4]]}
                            />
                        </Fragment>
                    );
                    break;
                }
                case 'allergy': {
                    titleContent = (
                        <Fragment>
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[0]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[0]]}
                            />
                            {' causes '}
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[1]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[1]]}
                            />
                        </Fragment>
                    );
                    break;
                }
            }

            for (let j = 1; j < tableBodyPlaceholders.length; j++) {
                contentInputs.push(
                    <Input
                        key={j}
                        fluid
                        transparent
                        placeholder={tableBodyPlaceholders[j]}
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={values[i][tableBodyPlaceholders[j]]}
                        className={j == 1 ? 'first-content-input' : 'content-input'}
                    />
                );
            }

            panels.push({
                key: i,
                title: {
                    content: titleContent,
                },
                content: {
                    content: (
                        <Fragment>
                            {contentInputs}
                        </Fragment>
                    ),
                }
            });
        }

        return panels;
    }

    render() {
        const {values, mobile } = this.props;
        const nums = Object.keys(values);
        const headerRow = this.makeHeader();
        const rows = this.makeTableBodyRows(nums);
        const panels = this.makeAccordionPanels(nums);

        const content = mobile ? (
            <Accordion
                defaultActiveIndex={[0, 1, 2]}
                panels={panels}
                exclusive={false}
                fluid
                styled
            />
        ) : (
            <Table
                celled
                className='table-display'
            >
                <Table.Header content={headerRow} />
                <Table.Body children={rows} />
            </Table>
        );

        return (
            <Fragment>
                {content}
                <AddRowButton
                    onClick={this.addRow}
                    name={this.props.name}
                />
            </Fragment>
        );
    }
}

TableContent.propTypes = {
    tableHeaders: PropTypes.array.isRequired,
    tableBodyPlaceholders: PropTypes.array.isRequired,
    onTableBodyChange: PropTypes.func,
    values: PropTypes.any.isRequired
};
