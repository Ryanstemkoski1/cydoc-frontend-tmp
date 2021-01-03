import React, { Component, Fragment } from 'react';
import {
    Table,
    Input,
    Accordion,
    Form,
    Dropdown,
    Label,
    Icon,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton.js';
import ToggleButton from 'components/tools/ToggleButton';
import HPIContext from 'contexts/HPIContext.js';
import { sideEffects } from 'constants/sideEffects';
import drug_names from 'constants/drugNames';
import diseases from 'constants/diseases';
import { MedicationTableBody } from './MedicationTableBody.js';
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
            invalidStartYear: new Set(),
            invalidEndYear: new Set(),
        };
        this.currentYear = new Date(Date.now()).getFullYear();
        // TODO: add back addRow functionality
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleTakingToggleButtonClick = this.handleTakingToggleButtonClick.bind(
            this
        );
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(event, data) {
        if (
            data.placeholder === 'Drug Name' &&
            !this.state.active.has(data.rowindex)
        ) {
            this.toggleAccordion(data.rowindex);
        }
        // Year validation
        if (data.type === 'Start Year') {
            const onset = +data.value;
            if (
                onset !== '' &&
                (isNaN(onset) || onset < 1900 || onset > this.currentYear)
            ) {
                if (!this.state.invalidStartYear.has(data.rowindex)) {
                    let newInvalidStartYear = this.state.invalidStartYear;
                    newInvalidStartYear.add(data.rowindex);
                    this.setState({ invalidStartYear: newInvalidStartYear });
                }
            } else if (this.state.invalidStartYear.has(data.rowindex)) {
                let newInvalidStartYear = this.state.invalidStartYear;
                newInvalidStartYear.delete(data.rowindex);
                this.setState({ invalidStartYear: newInvalidStartYear });
            }
        } else if (data.type === 'End Year') {
            const endYear = +data.value;
            if (
                endYear !== '' &&
                (isNaN(endYear) || endYear < 1900 || endYear > this.currentYear)
            ) {
                if (!this.state.invalidEndYear.has(data.rowindex)) {
                    let newInvalidEndYear = this.state.invalidEndYear;
                    newInvalidEndYear.add(data.rowindex);
                    this.setState({ invalidEndYear: newInvalidEndYear });
                }
            } else if (this.state.invalidEndYear.has(data.rowindex)) {
                let newInvalidEndYear = this.state.invalidEndYear;
                newInvalidEndYear.delete(data.rowindex);
                this.setState({ invalidEndYear: newInvalidEndYear });
            }
        }

        let newState = this.props.values;
        newState[data.rowindex][data.type] = data.value;
        this.props.onTableBodyChange(newState);
    }

    handleTakingToggleButtonClick(_event, data) {
        let values = this.context['Medications'];
        values[data.condition]['Currently Taking'] =
            values[data.condition]['Currently Taking'] === data.title
                ? ''
                : data.title;

        // Clearing any entry in End Year
        values[data.condition]['End Year'] = '';
        this.state.invalidEndYear.delete(data.condition); // the row index is being passed through the condition property

        this.context.onContextChange('Medications', values);
    }

    handleAddition(event, { optiontype, value }) {
        this.setState((prevState) => ({
            [optiontype]: [
                { key: value, text: value, value },
                ...prevState[optiontype],
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
    };

    makeAccordionPanels(nums) {
        const { values, tableBodyPlaceholders, mobile, isPreview } = this.props;

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
                            type={'Drug Name'}
                            options={this.state.medicationOptions}
                            placeholder={'medication'}
                            onChange={this.handleTableBodyChange}
                            rowindex={i}
                            value={values[i]['Drug Name']}
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
                        type={'Reason for Taking'}
                        options={this.state.diseaseOptions}
                        placeholder={'e.g. arthritis'}
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={isPreview ? '' : values[i]['Reason for Taking']}
                        disabled={isPreview}
                        onAddItem={this.handleAddition}
                        className='side-effects medication'
                        direction='left'
                    />
                </Input>
            );

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
                    if (tableBodyPlaceholders[j] === 'Reason for Taking') {
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
                                    <Input
                                        key={j}
                                        fluid
                                        className='content-input content-dropdown'
                                    >
                                        <Label
                                            basic
                                            className={
                                                'medications-content-input-label'
                                            }
                                            content={`${tableBodyPlaceholders[j]}:`}
                                            style={{ fontSize: '1rem' }}
                                        />
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            multiple
                                            allowAdditions
                                            icon=''
                                            options={
                                                this.state.sideEffectsOptions
                                            }
                                            type={tableBodyPlaceholders[j]}
                                            placeholder='Click here to select side effect(s)'
                                            onChange={
                                                this.handleTableBodyChange
                                            }
                                            rowindex={i}
                                            value={
                                                isPreview
                                                    ? ''
                                                    : values[i][
                                                          tableBodyPlaceholders[
                                                              j
                                                          ]
                                                      ]
                                            }
                                            onAddItem={
                                                this.handleAdditionSideEffects
                                            }
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
                                    label={{
                                        basic: true,
                                        content: 'Start Year:',
                                        className:
                                            'medications-content-input-label',
                                    }}
                                    placeholder='e.g. 2020'
                                    value={
                                        isPreview
                                            ? ''
                                            : values[i][
                                                  tableBodyPlaceholders[j]
                                              ]
                                    }
                                    onChange={this.handleTableBodyChange}
                                    className='content-input content-dropdown'
                                />
                                {this.state.invalidStartYear.has(i) && (
                                    <p className='year-validation-error'>
                                        Please enter a valid year between 1900
                                        and 2020
                                    </p>
                                )}
                            </div>
                        );
                    } else if (
                        tableBodyPlaceholders[j] === 'Currently Taking'
                    ) {
                        contentInputs.push(
                            <div>
                                <Label
                                    basic
                                    className='ui input content-input medications-content-input-label'
                                    content='Currently Taking: '
                                ></Label>
                                <ToggleButton
                                    active={
                                        values[i]['Currently Taking'] === 'Yes'
                                    }
                                    condition={i}
                                    title='Yes'
                                    onToggleButtonClick={
                                        this.handleTakingToggleButtonClick
                                    }
                                />
                                <ToggleButton
                                    active={
                                        values[i]['Currently Taking'] === 'No'
                                    }
                                    condition={i}
                                    title='No'
                                    onToggleButtonClick={
                                        this.handleTakingToggleButtonClick
                                    }
                                />
                            </div>
                        );
                    } else if (tableBodyPlaceholders[j] === 'End Year') {
                        contentInputs.push(
                            <>
                                {values[i]['Currently Taking'] === 'No' && (
                                    <div className='table-year-input mobile'>
                                        <Input
                                            fluid
                                            transparent
                                            rowindex={i}
                                            type={'End Year'}
                                            label={{
                                                basic: true,
                                                content: 'End Year:',
                                                className:
                                                    'medications-content-input-label',
                                            }}
                                            placeholder='e.g. 2020'
                                            value={
                                                isPreview
                                                    ? ''
                                                    : values[i]['End Year']
                                            }
                                            onChange={
                                                this.handleTableBodyChange
                                            }
                                            className='content-input content-dropdown'
                                        />
                                        {this.state.invalidEndYear.has(i) && (
                                            <p className='year-validation-mobile-error'>
                                                Please enter a valid year
                                                between 1900 and 2020
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
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
                                label={{
                                    basic: true,
                                    content: `${tableBodyPlaceholders[j]}:`,
                                    className:
                                        'medications-content-input-label',
                                }}
                                placeholder={
                                    tableBodyPlaceholders[j] === 'Schedule'
                                        ? 'e.g. once a day'
                                        : tableBodyPlaceholders[j] === 'Dose'
                                        ? 'e.g. 81 mg tablet'
                                        : 'e.g. take with food' // Default is for comments input
                                }
                                onChange={this.handleTableBodyChange}
                                value={
                                    isPreview
                                        ? ''
                                        : values[i][tableBodyPlaceholders[j]]
                                }
                                className='content-input'
                            />
                        );
                    }
                }
            } else {
                titleContent = (
                    <>
                        <Table
                            className={'medications-desktop-accordion-title'}
                        >
                            <Table.Cell width={3}>{drugNameInput}</Table.Cell>
                            <Table.Cell width={3}>
                                <Input
                                    fluid
                                    transparent
                                    rowindex={i}
                                    disabled={isPreview}
                                    type={'Dose'}
                                    placeholder={'e.g. 81 mg tablet'}
                                    onChange={this.handleTableBodyChange}
                                    value={isPreview ? '' : values[i]['Dose']}
                                    className='content-input'
                                />
                            </Table.Cell>
                            <Table.Cell width={3}>
                                <Input
                                    fluid
                                    transparent
                                    rowindex={i}
                                    disabled={isPreview}
                                    type={'Schedule'}
                                    placeholder={'e.g. once a day'}
                                    onChange={this.handleTableBodyChange}
                                    value={
                                        isPreview ? '' : values[i]['Schedule']
                                    }
                                    className='content-input'
                                />
                            </Table.Cell>
                            <Table.Cell width={1}>
                                <i>for</i>
                            </Table.Cell>
                            <Table.Cell width={3}>
                                {reasonForTakingInput}
                            </Table.Cell>
                        </Table>
                    </>
                );

                contentInputs.push(
                    <div className='table-year-input mobile'>
                        <Input
                            fluid
                            transparent
                            rowindex={i}
                            type={'Start Year'}
                            label={{
                                basic: true,
                                content: 'Start Year:',
                                className: 'medications-content-input-label',
                            }}
                            placeholder='e.g. 2020'
                            value={isPreview ? '' : values[i]['Start Year']}
                            onChange={this.handleTableBodyChange}
                            className='content-input content-dropdown'
                        />
                        {this.state.invalidStartYear.has(i) && (
                            <p className='year-validation-error'>
                                Please enter a year between 1900 and 2020
                            </p>
                        )}
                    </div>
                );

                contentInputs.push(
                    <div>
                        <Label
                            basic
                            className='ui input content-input medications-content-input-label'
                            content='Currently Taking: '
                        ></Label>
                        <ToggleButton
                            active={values[i]['Currently Taking'] === 'Yes'}
                            condition={i}
                            title='Yes'
                            onToggleButtonClick={
                                this.handleTakingToggleButtonClick
                            }
                        />
                        <ToggleButton
                            active={values[i]['Currently Taking'] === 'No'}
                            condition={i}
                            title='No'
                            onToggleButtonClick={
                                this.handleTakingToggleButtonClick
                            }
                        />
                    </div>
                );

                contentInputs.push(
                    <>
                        {values[i]['Currently Taking'] === 'No' && (
                            <div className='table-year-input mobile'>
                                <Input
                                    fluid
                                    transparent
                                    rowindex={i}
                                    type={'End Year'}
                                    label={{
                                        basic: true,
                                        content: 'End Year:',
                                        className:
                                            'medications-content-input-label',
                                    }}
                                    placeholder='e.g. 2020'
                                    value={
                                        isPreview ? '' : values[i]['End Year']
                                    }
                                    onChange={this.handleTableBodyChange}
                                    className='content-input content-dropdown'
                                />
                                {this.state.invalidEndYear.has(i) && (
                                    <p className='year-validation-error'>
                                        Please enter a year between 1900 and
                                        2020
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                );

                contentInputs.push(
                    <div>
                        <Input fluid className='content-input content-dropdown'>
                            <Label
                                basic
                                className={'medications-content-input-label'}
                                content={'Side Effects: '}
                            />
                            <Dropdown
                                fluid
                                search
                                selection
                                multiple
                                allowAdditions
                                icon=''
                                options={this.state.sideEffectsOptions}
                                type={'Side Effects'}
                                placeholder='Click here to select side effect(s)'
                                onChange={this.handleTableBodyChange}
                                rowindex={i}
                                value={
                                    isPreview ? '' : values[i]['Side Effects']
                                }
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
                        type={'Comments'}
                        label={{
                            basic: true,
                            content: 'Comments: ',
                            className: 'medications-content-input-label',
                        }}
                        placeholder={'e.g. take with food'}
                        onChange={this.handleTableBodyChange}
                        value={isPreview ? '' : values[i]['Comments']}
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
                        <Icon
                            name='dropdown'
                            corner='top left'
                            className='medications-desktop-accordion-dropdown-icon'
                        />
                    ),
                },
                content: {
                    content: <Fragment>{contentInputs}</Fragment>,
                },
                onTitleClick: (event) => {
                    if (event.target.type !== 'text') {
                        this.toggleAccordion(i);
                    }
                },
            });
        }

        return panels;
    }

    addRow() {
        let values = this.context[this.props.category];
        const last_index = values.length.toString();
        values[last_index] = { Procedure: '', Date: '', Comments: '' };
        this.context.onContextChange(this.props.category, values);
    }

    makeTableBodyRows(nums) {
        const { isPreview, tableBodyPlaceholders, values } = this.props;

        return nums.map((rowindex, index) => (
            <MedicationTableBody
                key={index}
                rowindex={isPreview ? rowindex : parseInt(rowindex)}
                tableBodyPlaceholders={tableBodyPlaceholders}
                onTableBodyChange={this.handleTableBodyChange}
                onAddItem={this.handleAddition}
                medicationOptions={this.state.medicationOptions}
                sideEffectsOptions={this.state.sideEffectsOptions}
                proceduresOptions={this.state.proceduresOptions}
                diseaseOptions={this.state.diseaseOptions}
                values={values}
                isPreview={isPreview}
            />
        ));
    }

    render() {
        const { values, isPreview } = this.props;
        const nums = isPreview ? values : Object.keys(values);

        const content = (
            <Accordion
                panels={this.makeAccordionPanels(nums)}
                exclusive={false}
                fluid
                styled
            />
        );

        return (
            <Fragment>
                {content}
                {!isPreview && (
                    <AddRowButton
                        onClick={this.addRow}
                        name={this.props.name}
                    />
                )}
            </Fragment>
        );
    }
}
