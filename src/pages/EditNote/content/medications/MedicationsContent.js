import React, { Component } from 'react';
import { Table, Input, Accordion, Form, Dropdown, Label, Icon } from 'semantic-ui-react'; 
import { sideEffects } from 'constants/sideEffects';
import drug_names from 'constants/drugNames';
import diseases from 'constants/diseases';
import HPIContext from 'contexts/HPIContext.js';
import AddRowButton from 'components/tools/AddRowButton.js';
import ToggleButton from 'components/tools/ToggleButton';
import './Medications.css';


export default class MedicationsContent extends Component {
    static contextType = HPIContext

    constructor(props, context) {
        super(props, context);
        this.currentYear = new Date(Date.now()).getFullYear();
        const values = this.context["Medications"]
        let invalidStartYearSet = new Set()
        let invalidEndYearSet = new Set()
        for (let i = 0; i < values.length; i++) {
            const startYear = +values[i]["Start Year"]
            const endYear = +values[i]["End Year"]
            if (values[i]["Start Year"] !== "" && (isNaN(startYear) || startYear < 1900 || startYear > this.currentYear)) {
                invalidStartYearSet.add(i)
            }
            if (values[i]["End Year"] !== "" && (isNaN(endYear) || endYear < 1900 || endYear > this.currentYear)) {
                invalidEndYearSet.add(i)
            }
        }

        this.state = {
            sideEffectsOptions: sideEffects,
            medicationOptions: drug_names,
            diseaseOptions: diseases,
            active: new Set(),
            invalidStartYear: invalidStartYearSet,
            invalidEndYear: invalidEndYearSet
        }
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleTakingToggleButtonClick = this.handleTakingToggleButtonClick.bind(this);
    }

    addRow() {
        let values = this.context["Medications"];
        const last_index = values.length.toString();
        values[last_index] = {"Drug Name": '', "Start Year": '', "Currently Taking": '', "End Year": '', "Schedule": '', "Dose": '', "Reason for Taking": '', "Side Effects": [], "Comments": ''}
        this.context.onContextChange("Medications", values);
    }

    handleTableBodyChange(_event, data){ 
        const { active } = this.state;
        if(!active.has(data.rowindex)) {
            active.add(data.rowindex);
            this.setState({active});
        }

        // Year validation
        if (data.type == 'Start Year') {
            const onset = +data.value
            if (data.value !== "" && (isNaN(onset) || onset < 1900 || onset > this.currentYear)) {
                if (!this.state.invalidStartYear.has(data.rowindex)){
                    let newInvalidStartYear = this.state.invalidStartYear
                    newInvalidStartYear.add(data.rowindex)
                    this.setState({invalidStartYear: newInvalidStartYear})
                }

            }
            else if (this.state.invalidStartYear.has(data.rowindex)) {
                let newInvalidStartYear = this.state.invalidStartYear
                newInvalidStartYear.delete(data.rowindex)
                this.setState({invalidStartYear: newInvalidStartYear})
            }
        }
        else if (data.type == 'End Year') {
            const endYear = +data.value
            if (data.value !== "" && (isNaN(endYear) || endYear < 1900 || endYear > this.currentYear)) {
                if (!this.state.invalidEndYear.has(data.rowindex)){
                    let newInvalidEndYear = this.state.invalidEndYear
                    newInvalidEndYear.add(data.rowindex)
                    this.setState({invalidEndYear: newInvalidEndYear})
                }
            }
            else if (this.state.invalidEndYear.has(data.rowindex)) {
                let newInvalidEndYear = this.state.invalidEndYear
                newInvalidEndYear.delete(data.rowindex)
                this.setState({invalidEndYear: newInvalidEndYear})
            }
        }

        let newState = this.context["Medications"];
        newState[data.rowindex][data.type] = data.value;
        this.context.onContextChange("Medications", newState);
    }

    handleTakingToggleButtonClick(_event, data) {
        let values = this.context["Medications"]
        values[data.condition]["Currently Taking"] = values[data.condition]["Currently Taking"] == data.title ? "" : data.title

        // Clearing any entry in End Year
        values[data.condition]["End Year"] = ""
        this.state.invalidEndYear.delete(data.condition) // the row index is being passed through the condition property
        
        this.context.onContextChange("Medications", values)
    }

    handleAddition(_event, { optiontype, value }) {
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

    makeAccordionPanels(nums) {
        const { mobile, isPreview } = this.props;
        const values = this.context["Medications"]
        
        const panels = [];
        for (let i = 0; i < nums.length; i++) {
            let titleContent, contentInputs;

            const drugNameInput = (
                <Input
                    disabled={isPreview}
                    transparent={isPreview}
                    className='content-input content-dropdown medication'
                    value={isPreview ? nums[i] : nums[i]['Drug Name']}
                >
                {
                    !isPreview && 
                    <Dropdown
                        fluid
                        search
                        selection
                        clearable
                        allowAdditions
                        icon=''
                        optiontype='medicationOptions'
                        type="Drug Name"
                        options={this.state.medicationOptions}
                        placeholder="medication"
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={values[i]["Drug Name"]}
                        onAddItem={this.handleAddition}
                        className='side-effects'
                    />
                }
                </Input>
            )

            const reasonForTakingInput = (
                <Input
                    transparent
                    className='content-input content-dropdown medication reason'
                >
                {
                    !isPreview &&
                    <Dropdown
                        fluid
                        search
                        selection
                        allowAdditions
                        icon=''
                        optiontype='diseaseOptions'
                        type="Reason for Taking"
                        options={this.state.diseaseOptions}
                        placeholder="e.g. arthritis"
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={values[i]["Reason for Taking"]}
                        onAddItem={this.handleAddition}
                        className='side-effects medication'
                        direction="left"
                    />
                }
                </Input>
            ) 

            const scheduleInput = (
                <Input
                    fluid
                    transparent
                    rowindex={i}
                    disabled={isPreview}
                    type='Schedule'
                    label={mobile && {basic: true, content: 'Schedule: ', className: 'medications-content-input-label'}}
                    placeholder='e.g. once a day'
                    onChange={this.handleTableBodyChange}
                    value={isPreview ? "" : values[i]['Schedule']}
                    className='content-input'
                />
            )

            const doseInput = (
                <Input
                    fluid
                    transparent
                    rowindex={i}
                    disabled={isPreview}
                    type='Dose'
                    label={mobile && {basic: true, content: 'Dose: ', className: 'medications-content-input-label'}}
                    placeholder='e.g. 81 mg tablet'
                    onChange={this.handleTableBodyChange}
                    value={isPreview ? "" : values[i]['Dose']}
                    className='content-input'
                />
            )

            const startYearInput = (
                <>
                    <Input 
                        fluid 
                        transparent 
                        rowindex={i}
                        disabled={isPreview}
                        type='Start Year'
                        label={{basic: true, content: 'Start Year:', className: 'medications-content-input-label'}}
                        placeholder="e.g. 2020"
                        value={isPreview ? "" : values[i]['Start Year']}
                        onChange={this.handleTableBodyChange}
                        className='content-input content-dropdown'
                    />
                    {this.state.invalidStartYear.has(i) && (
                        <p className='year-validation-mobile-error'>Please enter a valid year between 1900 and {this.currentYear}</p>
                    )}
                </>
            )

            const currentlyTakingInput = (
                <div>
                    <Label basic className="ui input content-input medications-content-input-label" content="Currently Taking: "></Label>
                    <ToggleButton active={values[i]["Currently Taking"] == 'Yes'}
                        condition={i}
                        title="Yes"
                        onToggleButtonClick={this.handleTakingToggleButtonClick}/>
                    <ToggleButton active={values[i]["Currently Taking"] == 'No'}
                        condition={i}
                        title="No"
                        onToggleButtonClick={this.handleTakingToggleButtonClick}/>
                </div>
            )

            const endYearInput = (
                <>
                    {
                    values[i]["Currently Taking"] == 'No' &&
                        <div>
                        <Input 
                            fluid 
                            transparent 
                            rowindex={i}
                            disabled={isPreview}
                            type="End Year"
                            label={{basic: true, content: 'End Year:', className: 'medications-content-input-label'}}
                            placeholder="e.g. 2020"
                            value={isPreview ? "" : values[i]["End Year"]}
                            onChange={this.handleTableBodyChange}
                            className='content-input content-dropdown'
                        />
                        { this.state.invalidEndYear.has(i) && (
                            <p className='year-validation-mobile-error'>Please enter a valid year between 1900 and {this.currentYear}</p>
                        )}
                        </div>
                    }
                </>
            )

            const sideEffectsInput = (
                <>
                    <Input fluid className='content-input content-dropdown'>
                    <Label basic className={'medications-content-input-label'} content={"Side Effects: "}/>
                    {
                        !isPreview && 
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            allowAdditions
                            icon=''
                            options={this.state.sideEffectsOptions}
                            type="Side Effects"
                            placeholder="Click here to select side effect(s)"
                            onChange={this.handleTableBodyChange}
                            rowindex={i}
                            value={values[i]["Side Effects"]}
                            onAddItem={this.handleAdditionSideEffects}
                            className='side-effects'
                        />
                    }
                        
                    </Input>
                </>
            )

            const commentsInput = (
                <Input
                    fluid
                    transparent
                    rowindex={i}
                    disabled={isPreview}
                    type='Comments'
                    label={{basic: true, content: 'Comments: ', className: 'medications-content-input-label'}}
                    placeholder='e.g. take with food'
                    onChange={this.handleTableBodyChange}
                    value={isPreview ? "" : values[i]['Comments']}
                    className='content-input'
                />
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
                
                contentInputs = (
                    <>
                        {startYearInput}
                        {currentlyTakingInput}
                        {endYearInput}
                        {scheduleInput}
                        {doseInput}
                        {sideEffectsInput}
                        {commentsInput}
                    </>
                )
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
                                        {doseInput}
                                    </Table.Cell>
                                    <Table.Cell width={3}>
                                        {scheduleInput}
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

                contentInputs = (
                    <>
                        {startYearInput}
                        {currentlyTakingInput}
                        {endYearInput}
                        {sideEffectsInput}
                        {commentsInput}
                    </>
                )

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
                        <>
                            {contentInputs}
                        </>
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
            <>
                {content}
                {!this.props.isPreview
                    &&
                    <AddRowButton
                        onClick={this.addRow}
                        name='medication'
                    />
                }
            </>
        )
    }
}