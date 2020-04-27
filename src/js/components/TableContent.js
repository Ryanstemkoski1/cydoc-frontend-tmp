import React, { Component, Fragment } from 'react';
import { Table, Input, Accordion, Form, Dropdown } from 'semantic-ui-react';
import AddRowButton from './AddRowButton'
import PropTypes from 'prop-types';
import { TableBodyRow } from './TableBodyRow';
import HPIContext from '../contexts/HPIContext';
import { sideEffects } from '../constants/sideEffects';
import drug_names from '../constants/drugNames';
import '../../css/components/tableContent.css';
 
//Component for a table layout
export default class TableContent extends Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            sideEffectsOptions: sideEffects,
            medicationOptions: drug_names,
        }
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAdditionSideEffects = this.handleAdditionSideEffects.bind(this);
        this.handleAdditionMedication = this.handleAdditionMedication.bind(this);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data){ 
        let newState = this.props.values;
        newState[data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    handleAdditionSideEffects(event, { value }) {
        this.setState((prevState) => ({
            sideEffectsOptions: [
                {text: value, value},
                ...prevState.sideEffectsOptions
            ],
        }));
    }

    handleAdditionMedication(event, { value }) {
        this.setState((prevState) => ({
            medicationOptions: [
                prevState.medicationOptions[0],
                {text: value, value},
                ...prevState.medicationOptions
            ],
        }));
    }

    //method to generate an collection of rows
    makeTableBodyRows(nums){
        return nums.map((rowindex, index) => 
            <TableBodyRow
                key={index}
                rowindex={parseInt(rowindex)}
                tableBodyPlaceholders={this.props.tableBodyPlaceholders}
                onTableBodyChange={this.handleTableBodyChange}
                onAddSideEffect={this.handleAdditionSideEffects}
                onAddMedication={this.handleAdditionMedication}
                values={this.props.values}
                medicationOptions={this.state.medicationOptions}
                sideEffectsOptions={this.state.sideEffectsOptions}
            />
        )
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
                        <Form className='inline-form'>
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[0]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[0]]}
                            />
                        </Form>
                    );
                    break;
                }
                case 'medication': {
                    titleContent = (
                        <Form className='inline-form'>
                            <Input
                                transparent
                                className='content-input content-dropdown medication'
                            >
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    clearable
                                    allowAdditions
                                    icon=''
                                    options={this.state.medicationOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[i][tableBodyPlaceholders[0]]}
                                    onAddItem={this.handleAdditionMedication}
                                    className='side-effects'
                                />
                            </Input>
                            {' for '}
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[4]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[4]]}
                            />
                        </Form>
                    );
                    break;
                }
                case 'allergy': {
                    titleContent = (
                        <Form className='inline-form'>
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
                        </Form>
                    );
                    break;
                }
                default: {
                    titleContent = (
                        <Form className='inline-form'>
                            <Input
                                transparent
                                placeholder={tableBodyPlaceholders[0]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[0]]}
                            />
                        </Form>
                    );
                    break;
                }
            }

            for (let j = 1; j < tableBodyPlaceholders.length; j++) {
                if ((name === 'medication' && j === 4) || (name === 'allergy' && j === 1)) {
                    // already in accordion title
                    continue;
                } else if (tableBodyPlaceholders[j] === 'Side Effects') {
                    contentInputs.push(
                        <Input key={j} fluid transparent className='content-input content-dropdown'>
                            <Dropdown
                                fluid
                                search
                                selection
                                multiple
                                allowAdditions
                                icon=''
                                options={this.state.sideEffectsOptions}
                                placeholder={tableBodyPlaceholders[j]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[j]]}
                                onAddItem={this.handleAdditionSideEffects}
                                className='side-effects'
                            />
                        </Input>
                    );
                } else {
                    contentInputs.push(
                        <Input
                            key={j}
                            fluid
                            transparent
                            placeholder={tableBodyPlaceholders[j]}
                            onChange={this.handleTableBodyChange}
                            rowindex={i}
                            value={values[i][tableBodyPlaceholders[j]]}
                            className='content-input'
                        />
                    );
                }
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
