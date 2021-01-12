import React, { Component } from 'react';
import {
    Grid,
    Input,
    Header,
    Dropdown,
    Accordion,
    TextArea,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import { FORM_DEFAULTS } from './DiscussionPlanDefaults';
import HPIContext from 'contexts/HPIContext.js';
import diseases from 'constants/diseases';
import medications from 'constants/drugNames';
import procedures from 'constants/procedures';
import constants from 'constants/registration-constants.json';
const specialtyOptions = constants.specialties.map((specialty) => ({
    key: specialty,
    text: specialty,
    value: specialty,
}));

const TYPE_TO_OPTIONS = {
    differential_diagnosis: diseases,
    prescriptions: medications,
    procedures_and_services: procedures,
    referrals: specialtyOptions,
};

export default class DiscussionPlanForm extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            expandPanels: false,
            active: new Set(),
            mainOptions: TYPE_TO_OPTIONS[this.props.type],
            whenOptions: this.generateOptions([
                'today',
                'this week',
                'this month',
                'this year',
            ]),
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    generateOptions = (values) => {
        return values.map((value) => ({ value, key: value, text: value }));
    };

    addRow = () => {
        const plan = { ...this.context.plan };
        const { index, type } = this.props;
        plan['conditions'][index][type].push({
            ...FORM_DEFAULTS[type]['default'],
        });
        this.context.onContextChange('plan', plan);
    };

    handleAddOption = (e, { optiontype, value }) => {
        this.setState((prevState) => ({
            [optiontype]: [
                { value, key: value, text: value },
                ...prevState[optiontype],
            ],
        }));
    };

    handleOnChange = (e, { index, name, value }) => {
        if (name === 'diagnosis' && !this.state.active.has(index)) {
            this.toggleAccordion(index);
        }
        const plan = { ...this.context.plan };
        const data = plan['conditions'][this.props.index][this.props.type];
        data[index][name] = value;
        this.context.onContextChange('plan', plan);
    };

    togglePanel = () => {
        this.setState({
            expandPanels: !this.state.expandPanels,
        });
    };

    toggleAccordion = (idx) => {
        const { active } = this.state;
        if (active.has(idx)) {
            active.delete(idx);
        } else {
            active.add(idx);
        }
        this.setState({ active });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.index !== this.props.index) {
            this.setState({ expandPanels: false });
        }
    }

    convertToTitle = (type) => {
        return type
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, (text) =>
                text === 'and'
                    ? text
                    : text.charAt(0).toUpperCase() + text.substr(1)
            );
    };

    makeGridContent = (type, data) => {
        const gridBody = data.map((datum, idx) => {
            switch (type) {
                case 'differential_diagnosis':
                    return (
                        <Grid.Row key={idx}>
                            <Grid.Column width={6}>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    icon=''
                                    optiontype='mainOptions'
                                    name='diagnosis'
                                    index={idx}
                                    value={datum['diagnosis']}
                                    options={this.state.mainOptions}
                                    onChange={this.handleOnChange}
                                    onAddItem={this.handleAddOption}
                                    placeholder={'diagnosis'}
                                />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Input
                                    fluid
                                    placeholder='Comments'
                                    name='comment'
                                    index={idx}
                                    value={datum['comment']}
                                    onChange={this.handleOnChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    );
                case 'prescriptions':
                    return (
                        <Grid.Row key={idx}>
                            <Grid.Column>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    icon=''
                                    optiontype='mainOptions'
                                    name='recipe_type'
                                    index={idx}
                                    value={datum['recipe_type']}
                                    options={this.state.mainOptions}
                                    onChange={this.handleOnChange}
                                    onAddItem={this.handleAddOption}
                                    placeholder='Medication Name'
                                />
                                <Input
                                    fluid
                                    type='text'
                                    name='recipe_amount'
                                    index={idx}
                                    value={datum['recipe_amount']}
                                    onChange={this.handleOnChange}
                                    placeholder='e.g. 81 mg tablet'
                                    className='recipe-amount lg'
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <div className='ui form'>
                                    <TextArea
                                        name='signatura'
                                        index={idx}
                                        value={datum['signatura']}
                                        onChange={this.handleOnChange}
                                        placeholder='e.g. 1 tablet every 8 hours'
                                    />
                                </div>
                            </Grid.Column>
                            <Grid.Column>
                                <div className='ui form'>
                                    <TextArea
                                        name='comment'
                                        index={idx}
                                        value={datum['comment']}
                                        onChange={this.handleOnChange}
                                        placeholder='e.g. take with food'
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    );
                default:
                    return (
                        <Grid.Row key={idx}>
                            <Grid.Column>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    icon=''
                                    optiontype='mainOptions'
                                    index={idx}
                                    options={this.state.mainOptions}
                                    onChange={this.handleOnChange}
                                    onAddItem={this.handleAddOption}
                                    name={FORM_DEFAULTS[type]['main_value']}
                                    value={
                                        datum[FORM_DEFAULTS[type]['main_value']]
                                    }
                                    placeholder={
                                        FORM_DEFAULTS[type]['subheader']
                                    }
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    icon=''
                                    optiontype='whenOptions'
                                    index={idx}
                                    options={this.state.whenOptions}
                                    onChange={this.handleOnChange}
                                    onAddItem={this.handleAddOption}
                                    name='when'
                                    value={datum['when']}
                                    placeholder='When'
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <div className='ui form'>
                                    <TextArea
                                        name='comment'
                                        index={idx}
                                        value={datum['comment']}
                                        onChange={this.handleOnChange}
                                        placeholder='Comments'
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    );
            }
        });
        let subheaders;
        if (type === 'prescriptions') {
            subheaders = (
                <Grid.Row>
                    <Grid.Column> Rx </Grid.Column>
                    <Grid.Column> Signature (Sig) </Grid.Column>
                    <Grid.Column> Comments </Grid.Column>
                </Grid.Row>
            );
        } else if (type === 'procedures_and_services' || type === 'referrals') {
            subheaders = (
                <Grid.Row>
                    <Grid.Column>
                        {' '}
                        {FORM_DEFAULTS[type]['subheader']}{' '}
                    </Grid.Column>
                    <Grid.Column> When </Grid.Column>
                    <Grid.Column> Comments </Grid.Column>
                </Grid.Row>
            );
        }
        return (
            <Grid
                stackable
                columns={type === 'differential_diagnosis' ? 2 : 3}
                className='section-body'
            >
                {subheaders}
                {gridBody}
            </Grid>
        );
    };

    makeAccordionPanels = (type, data) => {
        return data.map((datum, idx) => {
            let title;
            let content;
            if (
                type === 'differential_diagnosis' ||
                type === 'procedures_and_services' ||
                type === 'referrals'
            ) {
                title = (
                    <Input
                        transparent
                        className='content-input-surgical content-dropdown medication plan-main-input'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            allowAdditions
                            icon=''
                            optiontype='mainOptions'
                            index={idx}
                            options={this.state.mainOptions}
                            onAddItem={this.handleAddOption}
                            onChange={this.handleOnChange}
                            name={FORM_DEFAULTS[type]['main_value']}
                            value={datum[FORM_DEFAULTS[type]['main_value']]}
                            placeholder={FORM_DEFAULTS[type]['subheader']}
                            className='side-effects'
                        />
                    </Input>
                );
            } else {
                title = (
                    <div className='recipe'>
                        Rx
                        <Input
                            transparent
                            className='content-input-surgical content-dropdown medication plan-main-input recipe'
                        >
                            <Dropdown
                                fluid
                                search
                                selection
                                allowAdditions
                                icon=''
                                name='recipe_type'
                                optiontype='mainOptions'
                                index={idx}
                                value={datum['recipe_type']}
                                options={this.state.mainOptions}
                                onAddItem={this.handleAddOption}
                                onChange={this.handleOnChange}
                                placeholder='Medication Name'
                                className='side-effects'
                            />
                        </Input>
                        <Input
                            fluid
                            transparent
                            type='text'
                            name='recipe_amount'
                            className='recipe-amount'
                            placeholder={'e.g. 81 mg tablet'}
                            value={datum['recipe_amount']}
                            index={idx}
                            onChange={this.handleOnChange}
                        />
                    </div>
                );
            }
            switch (type) {
                case 'differential_diagnosis':
                    content = (
                        <Input
                            fluid
                            transparent
                            name='comment'
                            index={idx}
                            value={datum['comment']}
                            onChange={this.handleOnChange}
                            placeholder='Comments'
                            className='plan-expanded-input'
                        />
                    );
                    break;
                case 'prescriptions':
                    content = (
                        <>
                            Signatura (Sig)
                            <Input
                                fluid
                                transparent
                                type='text'
                                name='signatura'
                                index={idx}
                                value={datum['signatura']}
                                onChange={this.handleOnChange}
                                placeholder='e.g. 1 tablet every 8 hours'
                                className='plan-expanded-input'
                            />
                            Comments
                            <Input
                                fluid
                                transparent
                                type='text'
                                name='comment'
                                index={idx}
                                value={datum['comment']}
                                onChange={this.handleOnChange}
                                placeholder='e.g. take with food'
                                className='plan-expanded-input'
                            />
                        </>
                    );
                    break;
                default:
                    content = (
                        <>
                            <Input
                                transparent
                                className='content-input-surgical content-dropdown medication plan-main-input'
                            >
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    icon=''
                                    optiontype='whenOptions'
                                    index={idx}
                                    options={this.state.whenOptions}
                                    onChange={this.handleOnChange}
                                    onAddItem={this.handleAddOption}
                                    name='when'
                                    value={datum['when']}
                                    placeholder='When'
                                    className='side-effects'
                                />
                            </Input>
                            <Input
                                fluid
                                transparent
                                name='comment'
                                index={idx}
                                value={datum['comment']}
                                onChange={this.handleOnChange}
                                placeholder='Comments'
                                className='plan-expanded-input'
                            />
                        </>
                    );
            }
            return {
                key: idx,
                active: this.state.active.has(idx),
                title: {
                    content: title,
                },
                onTitleClick: () => this.toggleAccordion(idx),
                content: { content },
            };
        });
    };

    render() {
        const { expandPanels } = this.state;
        const { index, mobile, type } = this.props;
        const allData = this.context.plan['conditions'][index][type];
        let active = true;
        if (mobile && type !== 'differential_diagnosis') {
            active = expandPanels;
        }

        const content = mobile ? (
            <Accordion
                panels={this.makeAccordionPanels(type, allData)}
                exclusive={false}
                fluid
                styled
                className={`plan-section_response ${type}`}
            />
        ) : (
            this.makeGridContent(type, allData)
        );

        return (
            <Accordion styled fluid className='plan-section'>
                <Accordion.Title
                    onClick={
                        mobile && type !== 'differential_diagnosis'
                            ? this.togglePanel
                            : () => {}
                    }
                    active={active}
                    className='section-title'
                >
                    <Header
                        as='h2'
                        content={this.convertToTitle(type)}
                        size='large'
                        attached
                    />
                </Accordion.Title>
                <Accordion.Content active={active}>
                    {content}
                    <AddRowButton
                        name={FORM_DEFAULTS[type]['add_button_label']}
                        onClick={this.addRow}
                    />
                </Accordion.Content>
            </Accordion>
        );
    }
}
