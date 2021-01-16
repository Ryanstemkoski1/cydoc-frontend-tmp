import React, { Component } from 'react';
import { Accordion, Form, Input, Table } from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton.js';
import { allergies } from 'constants/States';
import HPIContext from 'contexts/HPIContext.js';
import { AllergiesTableBodyRow } from './AllergiesTableBodyRow';

//Component that manages the layout for the allergies page
export default class AllergiesContent extends Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            active: new Set(),
        };
        this.addRow = this.addRow.bind(this);
        this.handleTableBodyChange = this.handleTableBodyChange.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
        this.makeHeader = this.makeHeader.bind(this);
    }

    addRow() {
        let values = this.context['Allergies'];
        const last_index = values.length.toString();
        values[last_index] = {
            'Inciting Agent': '',
            Reaction: '',
            Comments: '',
        };
        this.context.onContextChange('Allergies', values);
    }

    //modify the current values in the table to reflect changes
    // and call the handler prop
    handleTableBodyChange(_event, data) {
        const { active } = this.state;
        if (!active.has(data.rowindex)) {
            active.add(data.rowindex);
            this.setState({ active });
        }

        let newState = this.context['Allergies'];
        newState[data.rowindex][data.type] = data.value;
        this.context.onContextChange('Allergies', newState);
    }

    //Method to generate the table header row
    makeHeader() {
        return (
            <Table.Row>
                {allergies.fields.map((header, index) => (
                    <Table.HeaderCell key={index} className='sticky-header'>
                        {header}
                    </Table.HeaderCell>
                ))}
            </Table.Row>
        );
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

    //method to generate an collection of rows
    makeTableBodyRows(nums, values) {
        return nums.map((rowindex, index) => (
            <AllergiesTableBodyRow
                key={index}
                rowindex={this.props.isPreview ? rowindex : parseInt(rowindex)}
                fields={allergies.fields}
                onTableBodyChange={this.handleTableBodyChange}
                values={values}
                isPreview={this.props.isPreview}
            />
        ));
    }

    makeAccordionPanels(nums, values) {
        const { isPreview } = this.props;

        const panels = [];
        for (let i = 0; i < nums.length; i++) {
            const titleContent = (
                <Form className='inline-form'>
                    <Input
                        transparent
                        placeholder='Inciting Agent'
                        type='Inciting Agent'
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={isPreview ? '' : values[i]['Inciting Agent']}
                    />
                    {' causes '}
                    <Input
                        transparent
                        placeholder='Reaction'
                        type='Reaction'
                        onChange={this.handleTableBodyChange}
                        rowindex={i}
                        value={isPreview ? '' : values[i]['Reaction']}
                    />
                </Form>
            );

            const contentInputs = (
                <Input
                    fluid
                    transparent
                    rowindex={i}
                    disabled={isPreview}
                    type='Comments'
                    label={{
                        basic: true,
                        content: 'Comments: ',
                        className: 'medications-content-input-label',
                    }}
                    placeholder='Comments'
                    onChange={this.handleTableBodyChange}
                    value={isPreview ? '' : values[i]['Comments']}
                    className='content-input'
                />
            );

            panels.push({
                key: i,
                active: this.state.active.has(i),
                title: {
                    content: titleContent,
                },
                content: {
                    content: <>{contentInputs}</>,
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

    render() {
        const values = this.props.values || this.context['Allergies'];
        const nums = this.props.isPreview ? values : Object.keys(values);

        const content = this.props.mobile ? (
            <Accordion
                panels={this.makeAccordionPanels(nums, values)}
                exclusive={false}
                fluid
                styled
            />
        ) : (
            <Table celled className='table-display'>
                <Table.Header content={this.makeHeader()} />
                {/* eslint-disable-next-line react/no-children-prop */}
                <Table.Body children={this.makeTableBodyRows(nums, values)} />
            </Table>
        );

        return (
            <>
                {content}
                {!this.props.isPreview && (
                    <AddRowButton onClick={this.addRow} name='allergy' />
                )}
            </>
        );
    }
}
