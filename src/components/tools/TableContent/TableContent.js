import React, { Component, Fragment } from 'react';
import { Table, Input, Accordion, Form, Dropdown } from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton.js'
import PropTypes from 'prop-types';
import { TableBodyRow } from './TableBodyRow';
import HPIContext from 'contexts/HPIContext.js';
import procedures from 'constants/procedures';
import { sideEffects } from 'constants/sideEffects';
import drug_names from 'constants/drugNames';
import diseases from 'constants/diseases';
import './TableContent.css';
 
//Component for a table layout
export default class TableContent extends Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            proceduresOptions: procedures,
            sideEffectsOptions: sideEffects,
            medicationOptions: drug_names,
            diseaseOptions: diseases,
            active: new Set(),
        }
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data){ 
        if (data.placeholder === 'Drug Name' && !this.state.active.has(data.rowindex)) {
            this.toggleAccordion(data.rowindex);
        }
        let newState = this.props.values;
        newState[data.rowindex][data.placeholder] = data.value;
        this.props.onTableBodyChange(newState);
    }

    handleAddition(event, { optiontype, value }) {
        this.setState((prevState) => ({
            [optiontype]: [
                {key: value, text: value, value},
                ...prevState[optiontype]
            ],
        }));
    }

    toggleAccordion = (idx) => {
        const { active } = this.state;
        if (active.has(idx)) {
            active.delete(idx);
        } else {
            active.add(idx);
        }
        this.setState({ active });
    }

    //method to generate an collection of rows
    makeTableBodyRows(nums){
        return nums.map((rowindex, index) => 
            <TableBodyRow
                key={index}
                rowindex={parseInt(rowindex)}
                tableBodyPlaceholders={this.props.tableBodyPlaceholders}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                values={this.props.values}
                medicationOptions={this.state.medicationOptions}
                sideEffectsOptions={this.state.sideEffectsOptions}
                proceduresOptions={this.state.proceduresOptions}
                diseaseOptions={this.state.diseaseOptions}
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
                                className='content-input-surgical content-dropdown medication'
                            >
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    clearable
                                    allowAdditions
                                    icon=''
                                    optiontype='proceduresOptions'
                                    options={this.state.proceduresOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[i][tableBodyPlaceholders[0]]}
                                    onAddItem={this.handleAddition}
                                    className='side-effects'
                                />
                            </Input>
                        </Form>
                    );
                    break;
                }
                case 'medication': {
                    titleContent = (
                        <Form className='inline-form medication'>
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
                                    optiontype='medicationOptions'
                                    options={this.state.medicationOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[i][tableBodyPlaceholders[0]]}
                                    onAddItem={this.handleAddition}
                                    className='side-effects'
                                />
                            </Input>
                            <span className='reason-wrapper'>
                                for
                                <Input
                                    transparent
                                    className='content-input content-dropdown medication reason'
                                >
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        allowAdditions
                                        icon=''
                                        optiontype='diseaseOptions'
                                        options={this.state.diseaseOptions}
                                        placeholder={tableBodyPlaceholders[4]}
                                        onChange={this.handleTableBodyChange}
                                        rowindex={i}
                                        value={values[i][tableBodyPlaceholders[4]]}
                                        onAddItem={this.handleAddition}
                                        className='side-effects medication'
                                    />
                                </Input>

                            </span>
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
                                optiontype='sideEffectsOptions'
                                options={this.state.sideEffectsOptions}
                                placeholder={tableBodyPlaceholders[j]}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i][tableBodyPlaceholders[j]]}
                                onAddItem={this.handleAddition}
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
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                },
                content: {
                    content: (
                        <Fragment>
                            {contentInputs}
                        </Fragment>
                    ),
                },
                onTitleClick: () => this.toggleAccordion(i),
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
