import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Dropdown from 'components/tools/OptimizedDropdown';
import { Accordion, Form, Icon, Input, Label, Table } from 'semantic-ui-react';
import {
    updateDrugName,
    updateStartYear,
    updateCurrentlyTaking,
    updateEndYear,
    updateSchedule,
    updateDose,
    updateReasonForTaking,
    updateSideEffects,
    updateComments,
} from 'redux/actions/medicationsActions';
import { selectMedicationsEntries } from 'redux/selectors/medicationsSelectors';
import { CurrentNoteState } from 'redux/reducers';
import { YesNoResponse } from 'constants/enums';
import { MedicationsItem } from 'redux/reducers/medicationsReducer';
import ToggleButton from 'components/tools/ToggleButton';
import { DropdownType } from './MedicationsContent';
import { OptionMapping } from '_processOptions';

interface OwnProps {
    mobile: boolean;
    isPreview: boolean;
    previewValue?: string;
    rowIndex: number;
    sideEffectsOptions: OptionMapping;
    medicationOptions: OptionMapping;
    diseaseOptions: OptionMapping;
    currentYear: number;
    handleAddition: (optionType: DropdownType, value: string) => void;
}
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

interface State {
    active: boolean;
    invalidStartYear: boolean;
    invalidEndYear: boolean;
}

class MedicationsPanel extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const values = props.medications[props.rowIndex][1];
        this.state = {
            active: false,
            invalidStartYear:
                !props.isPreview &&
                values.startYear != -1 &&
                (values.startYear < 1900 ||
                    values.startYear > props.currentYear),
            invalidEndYear:
                !props.isPreview &&
                values.endYear != -1 &&
                (values.endYear < 1900 || values.endYear > props.currentYear),
        };

        this.onTitleClick = this.onTitleClick.bind(this);
        this.makePanel = this.makePanel.bind(this);
    }

    onTitleClick = (event: React.MouseEvent) => {
        if ((event.target as HTMLInputElement).type !== 'text') {
            this.setState({
                active: !this.state.active,
            });
        }
    };

    handleYearChange(value: string, type: string) {
        // Year validation
        if (type === 'Start Year') {
            const onset = +value;
            this.setState({
                invalidStartYear:
                    value !== '' &&
                    (isNaN(onset) ||
                        onset < 1900 ||
                        onset > this.props.currentYear),
            });
        } else if (type === 'End Year') {
            const endYear = +value;
            this.setState({
                invalidEndYear:
                    value !== '' &&
                    (isNaN(endYear) ||
                        endYear < 1900 ||
                        endYear > this.props.currentYear),
            });
        }
    }

    onChangeFormatter = <T,>(action: (value: T) => void) => {
        return (_e: any, { value }: { value: T }) => {
            this.setState({
                active: true,
            });
            action(value);
        };
    };

    onAddItemFormatter = (
        action: (type: DropdownType, value: string) => void
    ) => {
        return (
            _e: any,
            { optiontype, value }: { optiontype: DropdownType; value: string }
        ) => {
            action(optiontype, value as string);
        };
    };

    makePanel() {
        const { mobile, isPreview } = this.props;

        let titleContent, contentInputs;
        // TODO: Remove the preview logic from this component (and potentially others in Patient History)
        //       and make it an entirely separate component for more explicit typecasting and functional differences
        const medicationEntry = this.props.medications[this.props.rowIndex];

        const drugNameInput = (
            <Input
                disabled={isPreview}
                transparent={isPreview}
                className='content-input content-dropdown medication'
                value={
                    isPreview
                        ? this.props.previewValue
                        : (medicationEntry[1] as MedicationsItem).drugName
                }
            >
                {!isPreview && (
                    <Dropdown
                        fluid
                        search
                        selection
                        clearable
                        allowAdditions
                        icon=''
                        optiontype='medicationOptions'
                        type='Drug Name'
                        options={this.props.medicationOptions}
                        placeholder='medication'
                        onChange={this.onChangeFormatter((value) =>
                            this.props.updateDrugName(
                                medicationEntry[0],
                                value as string
                            )
                        )}
                        rowindex={this.props.rowIndex}
                        value={(medicationEntry[1] as MedicationsItem).drugName}
                        onAddItem={this.onAddItemFormatter(
                            (optiontype, value) =>
                                this.props.handleAddition(optiontype, value)
                        )}
                        aria-label='Drug-Name-Dropdown'
                        className='side-effects'
                    />
                )}
            </Input>
        );

        const reasonForTakingInput = (
            <Input
                transparent
                className='content-input content-dropdown medication reason'
            >
                {!isPreview && (
                    <Dropdown
                        fluid
                        search
                        selection
                        allowAdditions
                        icon=''
                        optiontype='diseaseOptions'
                        type='Reason for Taking'
                        options={this.props.diseaseOptions}
                        placeholder='e.g. arthritis'
                        onChange={this.onChangeFormatter((value) =>
                            this.props.updateReasonForTaking(
                                medicationEntry[0],
                                value as string
                            )
                        )}
                        rowindex={this.props.rowIndex}
                        value={
                            (medicationEntry[1] as MedicationsItem)[
                                'reasonForTaking'
                            ]
                        }
                        onAddItem={this.onAddItemFormatter(
                            (optiontype, value) =>
                                this.props.handleAddition(optiontype, value)
                        )}
                        className='side-effects medication'
                        aria-label='Reason-For-Taking-Dropdown'
                        direction='left'
                    />
                )}
            </Input>
        );

        const scheduleInput = (
            <Input
                fluid
                transparent
                rowindex={this.props.rowIndex}
                disabled={isPreview}
                type='Schedule'
                label={
                    mobile && {
                        basic: true,
                        content: 'Schedule: ',
                        className: 'medications-content-input-label',
                    }
                }
                placeholder='e.g. once a day'
                onChange={this.onChangeFormatter((value) =>
                    this.props.updateSchedule(medicationEntry[0], value)
                )}
                value={
                    isPreview
                        ? ''
                        : (medicationEntry[1] as MedicationsItem)['schedule']
                }
                aria-label='Schedule-Input'
                className='content-input'
            />
        );

        const doseInput = (
            <Input
                fluid
                transparent
                rowindex={this.props.rowIndex}
                disabled={isPreview}
                type='Dose'
                label={
                    mobile && {
                        basic: true,
                        content: 'Dose: ',
                        className: 'medications-content-input-label',
                    }
                }
                placeholder='e.g. 81 mg tablet'
                onChange={this.onChangeFormatter((value) =>
                    this.props.updateDose(medicationEntry[0], value)
                )}
                value={
                    isPreview
                        ? ''
                        : (medicationEntry[1] as MedicationsItem)['dose']
                }
                aria-label='Dose-Input'
                className='content-input'
            />
        );

        const startYearInput = (
            <>
                <Input
                    fluid
                    transparent
                    rowindex={this.props.rowIndex}
                    disabled={isPreview}
                    type='Start Year'
                    label={{
                        basic: true,
                        content: 'Start Year:',
                        className: 'medications-content-input-label',
                    }}
                    placeholder='e.g. 2020'
                    value={
                        isPreview ||
                        (medicationEntry[1] as MedicationsItem).startYear == -1
                            ? ''
                            : (medicationEntry[1] as MedicationsItem).startYear
                    }
                    onBlur={(e: Event) => {
                        this.handleYearChange(
                            (e.target as HTMLInputElement).value,
                            'Start Year'
                        );
                    }}
                    onChange={(_event, { value }) => {
                        const numberInput = parseInt(value);
                        if (!isNaN(numberInput)) {
                            this.props.updateStartYear(
                                medicationEntry[0],
                                numberInput
                            );
                        } else if (value == '') {
                            this.props.updateStartYear(medicationEntry[0], -1);
                        }
                    }}
                    aria-label='Start-Year-Input'
                    className='content-input content-dropdown'
                />
                {this.state.invalidStartYear && (
                    <p className='year-validation-mobile-error'>
                        Please enter a valid year between 1900 and{' '}
                        {this.props.currentYear}
                    </p>
                )}
            </>
        );

        const currentlyTakingInput = (
            <div>
                <Label
                    basic
                    className='ui input content-input medications-content-input-label'
                    content='Currently Taking: '
                ></Label>
                <ToggleButton
                    active={
                        !isPreview &&
                        (medicationEntry[1] as MedicationsItem)
                            .isCurrentlyTaking === YesNoResponse.Yes
                    }
                    disabled={isPreview}
                    condition={this.props.rowIndex}
                    title='Yes'
                    onToggleButtonClick={() => {
                        this.props.updateCurrentlyTaking(
                            medicationEntry[0],
                            YesNoResponse.Yes
                        );
                    }}
                    ariaLabel='Currently-Taking-Yes-Button'
                />
                <ToggleButton
                    active={
                        !isPreview &&
                        (medicationEntry[1] as MedicationsItem)
                            .isCurrentlyTaking === YesNoResponse.No
                    }
                    disabled={isPreview}
                    condition={this.props.rowIndex}
                    title='No'
                    onToggleButtonClick={() => {
                        this.props.updateCurrentlyTaking(
                            medicationEntry[0],
                            YesNoResponse.No
                        );
                    }}
                    ariaLabel='Currently-Taking-No-Button'
                />
            </div>
        );

        const endYearInput = (
            <>
                {!isPreview &&
                    (medicationEntry[1] as MedicationsItem)
                        .isCurrentlyTaking === 'NO' && (
                        <div>
                            <Input
                                fluid
                                transparent
                                rowindex={this.props.rowIndex}
                                disabled={isPreview}
                                type='End Year'
                                label={{
                                    basic: true,
                                    content: 'End Year:',
                                    className:
                                        'medications-content-input-label',
                                }}
                                placeholder='e.g. 2020'
                                value={
                                    isPreview ||
                                    (medicationEntry[1] as MedicationsItem)
                                        .endYear == -1
                                        ? ''
                                        : (medicationEntry[1] as MedicationsItem)
                                              .endYear
                                }
                                onBlur={(e: Event) => {
                                    this.handleYearChange(
                                        (e.target as HTMLInputElement).value,
                                        'End Year'
                                    );
                                }}
                                onChange={(_event, { value }) => {
                                    const numberInput = parseInt(value);
                                    if (!isNaN(numberInput)) {
                                        this.props.updateEndYear(
                                            medicationEntry[0],
                                            numberInput
                                        );
                                    } else if (value == '') {
                                        this.props.updateEndYear(
                                            medicationEntry[0],
                                            -1
                                        );
                                    }
                                }}
                                aria-label='End-Year-Input'
                                className='content-input content-dropdown'
                            />
                            {this.state.invalidEndYear && (
                                <p className='year-validation-mobile-error'>
                                    Please enter a valid year between 1900 and{' '}
                                    {this.props.currentYear}
                                </p>
                            )}
                        </div>
                    )}
            </>
        );

        const sideEffectsInput = (
            <>
                <Input fluid className='content-input content-dropdown'>
                    <Label
                        basic
                        className={'medications-content-input-label'}
                        content={'Side Effects: '}
                    />
                    {!isPreview && (
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            allowAdditions
                            icon=''
                            options={this.props.sideEffectsOptions}
                            optiontype='sideEffectsOptions'
                            type='Side Effects'
                            placeholder='Click here to select side effect(s)'
                            onChange={this.onChangeFormatter((value) =>
                                this.props.updateSideEffects(
                                    medicationEntry[0],
                                    value as string[]
                                )
                            )}
                            rowindex={this.props.rowIndex}
                            value={
                                (medicationEntry[1] as MedicationsItem)
                                    .sideEffects
                            }
                            onAddItem={this.onAddItemFormatter(
                                (optiontype, value) =>
                                    this.props.handleAddition(optiontype, value)
                            )}
                            aria-label='Side-Effects-Dropdown'
                            className='side-effects'
                        />
                    )}
                </Input>
            </>
        );

        const commentsInput = (
            <Input
                fluid
                transparent
                rowindex={this.props.rowIndex}
                disabled={isPreview}
                type='Comments'
                label={{
                    basic: true,
                    content: 'Comments: ',
                    className: 'medications-content-input-label',
                }}
                placeholder='e.g. take with food'
                onChange={(_event, data) => {
                    this.props.updateComments(medicationEntry[0], data.value);
                }}
                value={
                    isPreview
                        ? ''
                        : (medicationEntry[1] as MedicationsItem).comments
                }
                aria-label='Comments-Input'
                className='content-input'
            />
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
            );
        } else {
            titleContent = (
                <Table className={'medications-desktop-accordion-title'}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={3}>{drugNameInput}</Table.Cell>
                            <Table.Cell width={3}>{doseInput}</Table.Cell>
                            <Table.Cell width={3}>{scheduleInput}</Table.Cell>
                            <Table.Cell width={1}>
                                <i>for</i>
                            </Table.Cell>
                            <Table.Cell width={3}>
                                {reasonForTakingInput}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            );

            contentInputs = (
                <>
                    {startYearInput}
                    {currentlyTakingInput}
                    {endYearInput}
                    {sideEffectsInput}
                    {commentsInput}
                </>
            );
        }

        return {
            titleContent,
            contentInputs,
        };
    }

    render() {
        const { titleContent, contentInputs } = this.makePanel();
        return (
            <>
                <Accordion.Title
                    active={this.state.active}
                    onClick={this.onTitleClick}
                >
                    <Icon
                        name='dropdown'
                        corner='top left'
                        className='medications-desktop-accordion-dropdown-icon'
                    />
                    {titleContent}
                </Accordion.Title>
                <Accordion.Content active={this.state.active}>
                    {contentInputs}
                </Accordion.Content>
            </>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    medications: selectMedicationsEntries(state),
});

const mapDispatchToProps = {
    updateDrugName,
    updateStartYear,
    updateCurrentlyTaking,
    updateEndYear,
    updateSchedule,
    updateDose,
    updateReasonForTaking,
    updateSideEffects,
    updateComments,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(MedicationsPanel);
