import React, { Component, Fragment } from 'react';
import { Table, Input, Accordion, Form, Dropdown, Label, Icon } from 'semantic-ui-react'; 
import { medications } from 'constants/States';
import { sideEffects } from 'constants/sideEffects';
import drug_names from 'constants/drugNames';
import diseases from 'constants/diseases';
import HPIContext from 'contexts/HPIContext.js';
import AddRowButton from 'components/tools/AddRowButton.js';
import './Medications.css';


export default class MedicationsContent extends Component {
    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.state = {
            sideEffectsOptions: sideEffects,
            medicationOptions: drug_names,
            diseaseOptions: diseases,
            active: new Set(),
            invalidYear: false,
        }

        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
    }

    addRow() {
        let values = this.context["Medications"];
        const last_index = values.length.toString();
        values[last_index] = {"Drug Name": '', "Start Year": '', "Schedule": '', "Dose": '', "Reason for Taking": '', "Side Effects": []}
        this.context.onContextChange("Medications", values);
    }

    handleTableBodyChange(_event, data){ 
        const { active } = this.state;
        if(!active.has(data.rowindex)) {
            active.add(data.rowindex);
            this.setState({active});
        }
        let newState = this.context["Medications"];
        newState[data.rowindex][data.type] = data.value;
        this.context.onContextChange("Medications", newState);
    }

    handleAddition(_event, { optiontype, value }) {
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
        const { mobile, isPreview } = this.props;
        const values = this.context["Medications"]
        const tableBodyPlaceholders = medications.fields

        const panels = [];
        for (let i = 0; i < nums.length; i++) {
            let titleContent;
            const contentInputs = [];
                
            let drugNameInput;
            if (isPreview) {
                drugNameInput = (
                    <Input
                        disabled    
                        transparent
                        className='content-input content-dropdown medication'
                        value={nums[i]}
                    />
                );
            } else {
                drugNameInput = (
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
                            type={"Drug Name"}
                            options={this.state.medicationOptions}
                            placeholder={"medication"}
                            onChange={this.handleTableBodyChange}
                            rowindex={i}
                            value={values[i]["Drug Name"]}
                            onAddItem={this.handleAddition}
                            className='side-effects'
                        />
                    </Input>
                );
            }
            let reasonForTakingInput = (
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
                        type={"Reason for Taking"}
                        options={this.state.diseaseOptions}
                        placeholder={"e.g. arthritis"}
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={isPreview ? "" : values[i]["Reason for Taking"]}
                        disabled={isPreview}
                        onAddItem={this.handleAddition}
                        className='side-effects medication'
                        direction="left"
                    />
                </Input>
            ) 

            if (mobile) {
                titleContent = (
                    <Form className='inline-form'>
                        {drugNameInput}
                        <span className='reason-wrapper'>
                            for
                            {reasonForTakingInput}
                        </span>
                    </Form>
                );
                for (let j = 1; j < tableBodyPlaceholders.length; j++) {
                    if (j == 4) {
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
                                    <Label basic className={'medications-content-input-label'} content={`${tableBodyPlaceholders[j]}:`} style={{fontSize: "1rem"}}/>
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
                                            value={isPreview ? [] : values[i][tableBodyPlaceholders[j]]}
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
                                    disabled={isPreview}
                                    type={tableBodyPlaceholders[j]}
                                    label={{basic: true, content: 'Start Year:', className: 'medications-content-input-label'}}
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
                                label={{basic: true, content: `${tableBodyPlaceholders[j]}:`, className: 'medications-content-input-label'}}
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
            }
            else {
                titleContent = (
                    <>
                        <Table className={"medications-desktop-accordion-title"}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>
                                        {drugNameInput}
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        <Input
                                            fluid
                                            transparent
                                            rowindex={i}
                                            disabled={isPreview}
                                            type={"Dose"}
                                            placeholder={"e.g. 81 mg tablet"}
                                            onChange={this.handleTableBodyChange}
                                            value={isPreview ? "" : values[i]["Dose"]}
                                            className='content-input'
                                        />
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        <Input
                                            fluid
                                            transparent
                                            rowindex={i}
                                            disabled={isPreview}
                                            type={"Schedule"}
                                            placeholder={"e.g. once a day"}
                                            onChange={this.handleTableBodyChange}
                                            value={isPreview ? "" : values[i]["Schedule"]}
                                            className='content-input'
                                        />
                                    </Table.Cell>
                                    <Table.Cell width={1}>
                                        <i>for</i>
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        {reasonForTakingInput}
                                    </Table.Cell>
                                </Table.Row> 
                            </Table.Body>    
                        </Table>
                </>
                )
                
                contentInputs.push(
                    <div className='table-year-input mobile'>
                        <Input 
                            fluid 
                            transparent 
                            rowindex={i}
                            disabled={isPreview}
                            type={"Start Year"}
                            label={{basic: true, content: 'Start Year:', className: 'medications-content-input-label'}}
                            placeholder="e.g. 2020"
                            value={isPreview ? "" : values[i]["Start Year"]}
                            onChange={this.handleTableBodyChange}
                            onBlur={this.onYearChange}
                            className='content-input content-dropdown'
                        />
                        { this.state.invalidYear && (
                            <p className='error'>Please enter a year between 1900 and 2020</p>
                        )}
                    </div>
                );

                contentInputs.push(
                    <div>
                        <Input fluid className='content-input content-dropdown'>
                        <Label basic className={'medications-content-input-label'} content={"Side Effects: "} style={{fontSize: "1rem"}}/>
                            <Dropdown
                                fluid
                                search
                                selection
                                multiple
                                allowAdditions
                                disabled={isPreview}
                                icon=''
                                options={this.state.sideEffectsOptions}
                                type={"Side Effects"}
                                placeholder="Click here to select side effect(s)"
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={isPreview ? [] : values[i]["Side Effects"]}
                                onAddItem={this.handleAdditionSideEffects}
                                className='side-effects'
                            />
                        </Input>
                    </div>
                );

                contentInputs.push(
                    <Input
                        fluid
                        transparent
                        rowindex={i}
                        disabled={isPreview}
                        type={"Comments"}
                        label={{basic: true, content: "Comments: ", className: 'medications-content-input-label'}}
                        placeholder={"e.g. take with food"}
                        onChange={this.handleTableBodyChange}
                        value={isPreview ? "" : values[i]["Comments"]}
                        className='content-input'
                    />
                );
            }
            
            panels.push({
                key: i,
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                    icon: (
                        <Icon name="dropdown" corner="top left" className="medications-desktop-accordion-dropdown-icon"/>
                    )
                },
                content: {
                    content: (
                        <Fragment>
                            {contentInputs}
                        </Fragment>
                    ),
                },
                onTitleClick: (event) => {
                    if (event.target.type != "text") {
                        this.toggleAccordion(i)
                    }
                },
            });
        }

        return panels;
    }

    render() {
        console.log(this.context["Medications"])
        const {values, isPreview} = this.props;
        const nums = isPreview ? values : this.context["Medications"]

        const content = 
            <Accordion
                panels={this.makeAccordionPanels(nums)}
                exclusive={false}
                fluid
                styled
            />

        return (
            <Fragment>
                {content}
                {!this.props.isPreview
                    &&
                    <AddRowButton
                        onClick={this.addRow}
                        name='medication'
                    />
                }
            </Fragment>
        )
    }
}