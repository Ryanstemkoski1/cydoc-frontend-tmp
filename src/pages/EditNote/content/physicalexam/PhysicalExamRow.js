import React, { Fragment } from 'react';
import { Button, Grid, Dropdown } from "semantic-ui-react";
import HPIContext from 'contexts/HPIContext.js'
import SelectAllButton from './SelectAllButton'
import LRButton from './LRButton'
import LungSounds from './widgets/LungSounds'
import AbdomenExam from './widgets/AbdomenExam';
import RightLeftWidget from './widgets/RightLeftWidget';
import HeartMurmurs from './widgets/HeartMurmurs';


export default class PhysicalExamRow extends React.Component {

    static contextType = HPIContext

    state = {
        dropdownSelected: []
    }

    handleDropdownChange = (e, { value }) => {

        const prevContext = this.context["Physical Exam"]

        let newValues = value.filter(v => !this.state.dropdownSelected.includes(v))
        let oldValues = this.state.dropdownSelected.filter(v => !value.includes(v))
        let toggleCallback = this.props.row.needsRightLeft ? this.props.handleLRToggle.bind(this, null) : this.props.handleToggle

        newValues.forEach(v => toggleCallback(v, true))
        oldValues.forEach(v => toggleCallback(v, false))

        this.setState({ dropdownSelected: value });
    }

    generateButtons = ({ findings, includeSelectAll, normalOrAbnormal, needsRightLeft }) => {

        let buttons, SelectAllCallBack

        if (needsRightLeft) {
            buttons = findings.map((finding) => {
                return <LRButton
                    content={finding}
                    name={finding}
                    group={this.props.group}
                    active={this.context["Physical Exam"][this.props.group][finding].active}
                    color={this.context["Physical Exam"][this.props.group][finding].active ? (normalOrAbnormal == 'normal' ? 'green' : 'red') : null}
                    onClick={this.props.handleLRToggle}
                />
            })
            SelectAllCallBack = this.props.handleLRToggle.bind(this, 'all')
        } else {
            buttons = findings.map((finding) => {
                return <Button 
                    content={finding}
                    name={finding}
                    active={this.context["Physical Exam"][this.props.group][finding]}
                    color={this.context["Physical Exam"][this.props.group][finding] ? (normalOrAbnormal == 'normal' ? 'green' : 'red') : null}
                    onClick={(e, { name, active }) => this.props.handleToggle(name, !active)}
                />
            })
            SelectAllCallBack = this.props.handleToggle
        }

        if (includeSelectAll) {
            return <SelectAllButton handleClick={SelectAllCallBack}>
                {buttons}
            </SelectAllButton>
        } else {
            return buttons
        }
    }

    generateOptions = (findings) => {
        return (
            findings.map((finding) => ({ key: finding, value: finding, text: finding }))
        )
    }

    generateDropdown = ({ findings, includeSelectAll, normalOrAbnormal, needsRightLeft }) => {
        return (
            <Fragment>
                <Grid.Row style={{ paddingTop: '10px', paddingBelow: '10px' }}>
                    <Dropdown
                        search
                        selection
                        multiple
                        options={this.generateOptions(findings)}
                        value={this.state.dropdownSelected}
                        onChange={this.handleDropdownChange}
                    />
                </Grid.Row>
                <Grid.Row style={{ paddingTop: '10px', paddingBelow: '10px' }}>
                    {this.generateButtons({ findings: this.state.dropdownSelected, includeSelectAll, normalOrAbnormal, needsRightLeft })}
                </Grid.Row>
            </Fragment>

        )
    }

    generateWidget = (widget) => {
        switch (widget) {
            case 'LUNG_WIDGET':
                return <LungSounds />
            case 'PULSES_WIDGET':
                return <RightLeftWidget type='Pulses' />
            case 'ABDOMEN_WIDGET':
                return <AbdomenExam />
            case 'REFLEXES_WIDGET':
                return <RightLeftWidget type='Reflexes' />
            case 'MURMUR_WIDGET':
                return <HeartMurmurs type= 'Murmurs'/>
            default:
                return null
        }
    }

    render() {

        if (this.props.row.display === 'widget') {
            return (
                <Grid.Row style={{ paddingTop: '10px', paddingBelow: '10px' }}>
                    <Grid.Column>
                        {this.generateWidget(this.props.row.widget)}
                    </Grid.Column>
                </Grid.Row>
            )
        } else if (this.props.row.display === 'autocompletedropdown') {
            return (
                <Grid.Row style={{ paddingTop: '10px', paddingBelow: '10px' }}>
                    <Grid.Column>
                        {this.generateDropdown(this.props.row)}
                    </Grid.Column>
                </Grid.Row>
            )
        } else {
            return (
                <Grid.Row style={{ paddingTop: '10px', paddingBelow: '10px' }}>
                    <Grid.Column>
                        {this.generateButtons(this.props.row)}
                    </Grid.Column>
                </Grid.Row>
            )
        }


    }
}