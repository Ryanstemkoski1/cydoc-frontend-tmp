import React, { Component, Fragment } from 'react';
import { Table, Input, Accordion, Form, Dropdown, Label } from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton.js'
import PropTypes from 'prop-types';
import HPIContext from 'contexts/HPIContext.js';
import procedures from 'constants/procedures';
import { sideEffects } from 'constants/sideEffects';
import drug_names from 'constants/drugNames';
import diseases from 'constants/diseases';
import {MedicationTableBody} from './MedicationTableBody.js';
import './Medications.css';

export default class MedicationsTable extends Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            sideEffectsOptions: sideEffects,
            medicationOptions: drug_names,
            diseaseOptions: diseases,
            active: new Set(),
            invalidYear: false,
        }
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
    }


    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data){ 
        if (data.placeholder === 'Drug Name' && !this.state.active.has(data.rowindex)) {
            this.toggleAccordion(data.rowindex);
        }
        let newState = this.props.values;
        newState[data.rowindex][data.type] = data.value;
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

    onYearChange = (e) => {
        this.setState({ invalidYear: e.target.value !== "" && !/^(19\d\d|20[0-2]\d)$/.test(e.target.value) });
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

    makeAccordionPanels(nums) {
        const { values, tableBodyPlaceholders, name, isPreview } = this.props;

        const panels = [];
        for (let i = 0; i < nums.length; i++) {
            let titleContent;
            const contentInputs = [];

            switch(name) {
                
                case 'medication': {
                    let mainInput;
                    if (isPreview) {
                        mainInput = (
                            <Input
                                disabled    
                                transparent
                                className='content-input content-dropdown medication'
                                value={nums[i]}
                            />
                        );
                    } else {
                        mainInput = (
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
                                    type={tableBodyPlaceholders[0]}
                                    options={this.state.medicationOptions}
                                    placeholder={tableBodyPlaceholders[0]}
                                    onChange={this.handleTableBodyChange}
                                    rowindex={i}
                                    value={values[i][tableBodyPlaceholders[0]]}
                                    onAddItem={this.handleAddition}
                                    className='side-effects'
                                />
                            </Input>
                        );
                    }
                    titleContent = (
                        <Form className='inline-form'>
                            {mainInput}
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
                                        type={tableBodyPlaceholders[4]}
                                        options={this.state.diseaseOptions}
                                        placeholder={tableBodyPlaceholders[4]}
                                        onChange={this.handleTableBodyChange}
                                        rowindex={i}
                                        value={isPreview ? "" : values[i][tableBodyPlaceholders[4]]}
                                        disabled={isPreview}
                                        onAddItem={this.handleAddition}
                                        className='side-effects medication'
                                    />
                                </Input>
                            </span>
                        </Form>
                    );
                    break;
                }
                default: {
                    titleContent = (
                        <Form className='inline-form'>
                            <Input
                                transparent
                                type={tableBodyPlaceholders[0]}
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
                    if (isPreview) {
                        contentInputs.push(
                            <Input 
                                fluid 
                                disabled
                                transparent 
                                key={j} 
                                placeholder={tableBodyPlaceholders[j]}
                                className='content-input content-dropdown'
                            />
                        );
                    } else {
                        contentInputs.push(
                            <div>
                                <Input key={j} fluid className='content-input content-dropdown'>
                                <Label basic className={'medications-input-label-mobile'} content={`${tableBodyPlaceholders[j]}:`} style={{fontSize: "1rem"}}/>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        multiple
                                        allowAdditions
                                        icon=''
                                        options={this.state.sideEffectsOptions}
                                        type={tableBodyPlaceholders[j]}
                                        placeholder="Click here to select side effect(s)"
                                        onChange={this.handleTableBodyChange}
                                        rowindex={i}
                                        value={isPreview ? "" : values[i][tableBodyPlaceholders[j]]}
                                        onAddItem={this.handleAdditionSideEffects}
                                        className='side-effects'
                                    />
                                </Input>
                            </div>
                        );
                    }
                } else if (tableBodyPlaceholders[j] === 'Start Year') {
                    contentInputs.push(
                        <div className='table-year-input mobile' key={j}>
                            <Input 
                                key={j}
                                fluid 
                                transparent 
                                rowindex={i}
                                type={tableBodyPlaceholders[j]}
                                label={{basic: true, content: 'Start Year:', className: 'medications-input-label-mobile'}}
                                placeholder="e.g. 2020"
                                value={isPreview ? "" : values[i][tableBodyPlaceholders[j]]}
                                onChange={this.handleTableBodyChange}
                                onBlur={this.onYearChange}
                                className='content-input content-dropdown'
                            />
                            { this.state.invalidYear && (
                                <p className='error'>Please enter a year between 1900 and 2020</p>
                            )}
                        </div>
                    );
                } else {
                    contentInputs.push(
                        <Input
                            key={j}
                            fluid
                            transparent
                            rowindex={i}
                            disabled={isPreview}
                            type={tableBodyPlaceholders[j]}
                            label={{basic: true, content: `${tableBodyPlaceholders[j]}:`, className: 'medications-input-label-mobile'}}
                            placeholder={
                                tableBodyPlaceholders[j] == "Schedule" ?
                                    "e.g. once a day" : 
                                    tableBodyPlaceholders[j] == "Dose" ? 
                                        "e.g. 81 mg tablet" : 
                                        "e.g. take with food" // Default is for comments input
                            }
                            onChange={this.handleTableBodyChange}
                            value={isPreview ? "" : values[i][tableBodyPlaceholders[j]]}
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


    addRow() {
        let values = this.context[this.props.category];
        const last_index = values.length.toString();
        values[last_index] = {Procedure: '', Date: '', Comments: ''}
        this.context.onContextChange(this.props.category, values);
    }

    makeTableBodyRows(nums){
        const { 
            isPreview,
            tableBodyPlaceholders,
            values,
            name,
        } = this.props;

        return nums.map((rowindex, index) => 
            <MedicationTableBody
                key={index}
                rowindex={isPreview ? rowindex : parseInt(rowindex)}
                tableBodyPlaceholders={tableBodyPlaceholders}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                values={this.props.values}
                medicationOptions={this.state.medicationOptions}
                sideEffectsOptions={this.state.sideEffectsOptions}
                proceduresOptions={this.state.proceduresOptions}
                diseaseOptions={this.state.diseaseOptions}
                values={values}
                isPreview={isPreview}
            />
        )
    }

    render() {
        const {values, mobile, isPreview } = this.props;
        const nums = isPreview ? values : Object.keys(values);
    
        const content = mobile ? (
            <Accordion
                panels={this.makeAccordionPanels(nums)}
                exclusive={false}
                fluid
                styled
            />
        ) : (
        <Table celled className='table-display'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell className='table-header'><p>Drug Name</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header' width={'one'}><p>Start Year</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header' width={'two'}><p>Schedule</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header' width={'one'}><p>Dose</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header'><p>Reason For Taking</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header' width={'four'}><p>Side Effects</p></Table.HeaderCell>
                    <Table.HeaderCell className='table-header'><p>Comments</p></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            
            <Table.Body children={this.makeTableBodyRows(nums)}/>


        </Table>

        )

        return (
            <Fragment>
                {content}
                {!isPreview
                    &&
                    <AddRowButton
                        onClick={this.addRow}
                        name={this.props.name}
                    />
                }
            </Fragment>
        )
    }

}