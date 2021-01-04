import React, { Component } from 'react';
import { surgicalHistory } from 'constants/States';
import { SurgicalHistoryTableBodyRow } from './SurgicalHistoryTableBodyRow';
import HPIContext from 'contexts/HPIContext.js';
import procedures from 'constants/procedures';
import { Accordion, Dropdown, Form, Icon, Input, Table } from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';

export default class SurgicalHistoryContent extends Component {
    static contextType = HPIContext

    constructor(props, context) {
        super(props, context)
        this.currentYear = new Date(Date.now()).getFullYear()
        let invalidYearSet = new Set()
        if (!this.props.isPreview) {
            const values = this.context["Surgical History"]
            for (let i = 0; i < values.length; i++) {
                const procedureYear = +values[i]["Year"]
                if (values[i]["Year"] !== "" && (isNaN(procedureYear) || procedureYear < 1900 || procedureYear > this.currentYear)) {
                    invalidYearSet.add(i)
                }
            }
        }

        this.state = {
            proceduresOptions: procedures,
            active: new Set(),
            isInvalidYear: invalidYearSet
        }
        this.addRow = this.addRow.bind(this)
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this)
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this)
        this.makeHeader = this.makeHeader.bind(this);
    }

    addRow() {
        let values = this.context["Surgical History"];
        const last_index = values.length.toString();
        values[last_index] = {"Procedure": '', "Year": '', "Comments": ''}
        this.context.onContextChange("Surgical History", values);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(_event, data) { 
        const { active } = this.state;
        if(!active.has(data.rowindex)) {
            active.add(data.rowindex);
            this.setState({active});
        }

        // Year validation
        if (data.type == 'Year') {
            const procedureYear = +data.value
            if (data.value !== "" && (isNaN(procedureYear) || procedureYear < 1900 || procedureYear > this.currentYear)) {
                if (!this.state.isInvalidYear.has(data.rowindex)) {
                    let newInvalidYears = this.state.isInvalidYear
                    newInvalidYears.add(data.rowindex)
                    this.setState({isInvalidYear: newInvalidYears})
                }

            }
            else if (this.state.isInvalidYear.has(data.rowindex)) {
                let newInvalidYears = this.state.isInvalidYear
                newInvalidYears.delete(data.rowindex)
                this.setState({isInvalidYear: newInvalidYears})
            }
        }

        let newState = this.context["Surgical History"];
        newState[data.rowindex][data.type] = data.value;
        this.context.onContextChange("Surgical History", newState);
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

    //method to generate an collection of rows
    makeTableBodyRows(nums, values) {
        return nums.map((rowindex, index) => 
            <SurgicalHistoryTableBodyRow
                key={index}
                rowindex={this.props.isPreview ? rowindex : parseInt(rowindex)}
                fields={surgicalHistory.fields}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                proceduresOptions={this.state.proceduresOptions}
                values={values}
                isPreview={this.props.isPreview}
                currentYear={this.currentYear}
                isInvalidYear={this.state.isInvalidYear.has(index)}
            />
        )
    }

    //Method to generate the table header row
    makeHeader() {
        return(
            <Table.Row>
                {surgicalHistory.fields.map((header, index) =>
                    <Table.HeaderCell key={index}>{header}</Table.HeaderCell>)}
            </Table.Row>
        );
    }

    makeAccordionPanels(nums, values) {
        const { isPreview } = this.props;

        const panels = [];
        for (let i = 0; i < nums.length; i++) {
            const titleContent = (
                <Form className='inline-form'>
                    {isPreview ? (
                        <Input
                            disabled    
                            transparent
                            className='content-input medication'
                            value={nums[i]}
                        />
                    ) : (
                        <Input
                        transparent
                        className='content-input-surgical content-dropdown medication'
                        >
                            <Dropdown
                                clearable
                                fluid
                                search
                                selection
                                allowAdditions
                                icon=''
                                type='Procedure'
                                optiontype='proceduresOptions'
                                options={this.state.proceduresOptions}
                                placeholder={'Procedure'}
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={values[i]['Procedure']}
                                onAddItem={this.handleAddition}
                                className='side-effects'
                            />
                        </Input>
                    )}
                </Form>
            );

            const contentInputs = (
                <>
                    <Input 
                        fluid 
                        transparent 
                        rowindex={i}
                        disabled={isPreview}
                        type='Year'
                        label={{basic: true, content: 'Year:', className: 'medications-content-input-label'}}
                        placeholder="e.g. 2020"
                        value={isPreview ? "" : values[i]['Year']}
                        onChange={this.handleTableBodyChange}
                        className='content-input content-dropdown'
                    />
                    {this.state.isInvalidYear.has(i) && (
                        <p className='year-validation-mobile-error'>Please enter a valid year between 1900 and {this.currentYear}</p>
                    )}
                    <Input
                        fluid
                        transparent
                        rowindex={i}
                        disabled={isPreview}
                        type='Comments'
                        label={{basic: true, content: 'Comments: ', className: 'medications-content-input-label'}}
                        placeholder='Comments'
                        onChange={this.handleTableBodyChange}
                        value={isPreview ? "" : values[i]['Comments']}
                        className='content-input'
                    />
                </>
            )

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
                onTitleClick: (_event) => {
                    this.toggleAccordion(i)
                },
            });
        }

        return panels;
    }

    render() {
        const values = this.props.values || this.context["Surgical History"]
        const nums = this.props.isPreview ? values : Object.keys(values)

        const content = this.props.mobile ? (
            <Accordion
                panels={this.makeAccordionPanels(nums, values)}
                exclusive={false}
                fluid
                styled
            />
        ) : (
            <Table
                celled
                className='table-display'
            >
                <Table.Header content={this.makeHeader()} />
                <Table.Body children={this.makeTableBodyRows(nums, values)} />
            </Table>
        )

        return (
            <>
                {content}
                {!this.props.isPreview
                    &&
                    <AddRowButton
                        onClick={this.addRow}
                        name='surgical history'
                    />
                }
            </>
        )
    }
}