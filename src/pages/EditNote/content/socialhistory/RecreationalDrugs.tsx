import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    Accordion,
    Button,
    Divider,
    Dropdown,
    Form,
    Grid,
    Input,
    Table,
} from 'semantic-ui-react';
import { DrugName, drugNames } from 'constants/SocialHistory/drugNames';
import modesOfDelivery, {
    ModeOfDelivery,
} from 'constants/SocialHistory/modesOfDelivery';
import ToggleButton from 'components/tools/ToggleButton.js';
import AddRowButton from 'components/tools/AddRowButton';
import {
    updateRecreationalDrugUsage,
    addRecreationalDrugUsed,
    updateRecreationalDrugUsedName,
    updateRecreationalDrugUsedModesOfDelivery,
    updateRecreationalDrugUsedPerWeek,
    deleteRecreationalDrugUsed,
    updateRecreationalDrugQuitYear,
    updateRecreationalDrugComments,
    updateRecreationalDrugInterestedInQuitting,
    updateRecreationalDrugTriedToQuit,
} from 'redux/actions/socialHistoryActions';
import { selectRecreationalDrugsState } from 'redux/selectors/socialHistorySelectors';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import { DrugUsage } from 'redux/reducers/socialHistoryReducer';
import { CurrentNoteState } from 'redux/reducers';
import _ from 'lodash';

type OwnProps = {
    mobile: boolean;
};
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

interface State {
    invalidYear: boolean;
    currentYear: number;
}

class RecreationalDrugs extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            invalidYear: false,
            currentYear: new Date(Date.now()).getFullYear(),
        };
        this.additionalFields = this.additionalFields.bind(this);
        this.makeAccordionPanels = this.makeAccordionPanels.bind(this);
    }

    onYearChange = (e: React.SyntheticEvent) => {
        const numberYear = +(e.target as HTMLInputElement).value;
        this.setState({
            invalidYear:
                (e.target as HTMLInputElement).value != '' &&
                (isNaN(numberYear) ||
                    numberYear < 1900 ||
                    numberYear > this.state.currentYear),
        });
    };

    includeQuitYear() {
        const values = this.props.recreationalDrugs;
        if (values.usage === SubstanceUsageResponse.InThePast) {
            return (
                <Grid.Column computer={5} tablet={8} mobile={16}>
                    <Form.Field className='table-year-input'>
                        Quit Year
                        <Input
                            type='number'
                            field='Quit Year'
                            onBlur={this.onYearChange}
                            condition='Recreational Drugs'
                            value={
                                values.quitYear === -1 ? '' : values.quitYear
                            }
                            onChange={(_, { value }) => {
                                const numberInput = parseInt(value);
                                if (!isNaN(numberInput)) {
                                    this.props.updateRecreationalDrugQuitYear(
                                        numberInput
                                    );
                                } else if (value == '') {
                                    this.props.updateRecreationalDrugQuitYear(
                                        -1
                                    );
                                }
                            }}
                        />
                        {this.state.invalidYear && (
                            <p className='year-validation-error'>
                                Please enter a year between 1900 and 2020
                            </p>
                        )}
                    </Form.Field>
                </Grid.Column>
            );
        }
    }

    generateInterestedInQuittingButton(response: YesNoMaybeResponse) {
        const values = this.props.recreationalDrugs;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateRecreationalDrugInterestedInQuitting(
                        response
                    );
                }}
                condition='Recreational Drugs'
                title={
                    response === YesNoMaybeResponse.Yes
                        ? 'Yes'
                        : response === YesNoMaybeResponse.Maybe
                        ? 'Maybe'
                        : response === YesNoMaybeResponse.No
                        ? 'No'
                        : ''
                }
                size='small'
                compact={true}
                active={values.interestedInQuitting === response}
            />
        );
    }

    generateTriedQuittingButton(response: YesNoResponse) {
        const values = this.props.recreationalDrugs;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateRecreationalDrugTriedToQuit(response);
                }}
                condition='Recreational Drugs'
                title={
                    response === YesNoResponse.Yes
                        ? 'Yes'
                        : response === YesNoResponse.No
                        ? 'No'
                        : ''
                }
                size='small'
                compact={true}
                active={values.triedToQuit === response}
            />
        );
    }

    quittingQuestions() {
        const values = this.props.recreationalDrugs;
        if (values.usage === SubstanceUsageResponse.Yes) {
            return (
                <Grid stackable>
                    <Form className='family-hx-note-item'>
                        <Form.Group inline className='condition-header'>
                            <div className='condition-name'>
                                Are you interested in quitting?
                            </div>
                            <div className='interested-in-quitting-buttons'>
                                {this.generateInterestedInQuittingButton(
                                    YesNoMaybeResponse.Yes
                                )}
                                {this.generateInterestedInQuittingButton(
                                    YesNoMaybeResponse.Maybe
                                )}
                                {this.generateInterestedInQuittingButton(
                                    YesNoMaybeResponse.No
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                    <Form className='family-hx-note-item'>
                        <Form.Group inline className='condition-header'>
                            <div className='condition-name'>
                                Have you tried to quit before?
                            </div>
                            <div className='tried-to-quit-buttons'>
                                {this.generateTriedQuittingButton(
                                    YesNoResponse.Yes
                                )}
                                {this.generateTriedQuittingButton(
                                    YesNoResponse.No
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                </Grid>
            );
        }
    }

    handleCellClick = (e: React.MouseEvent) => {
        const innerInput = (e.target as HTMLElement)
            .lastElementChild as HTMLInputElement;
        // Handles clicks outside of the "clickable area" (padding) of the input component within a cell
        if (innerInput !== null) {
            if (innerInput.type !== 'submit') {
                // will ensure clicks near delete button will not automatically click
                innerInput.click();
            }
        }
    };

    makeHeader() {
        return (
            <Table.Row>
                <Table.HeaderCell>Drug Name</Table.HeaderCell>
                <Table.HeaderCell>Mode of Delivery</Table.HeaderCell>
                <Table.HeaderCell># Per Week</Table.HeaderCell>
                <Table.HeaderCell style={{ borderLeft: 0 }} />
            </Table.Row>
        );
    }

    getOnChange = (
        rowindex: number,
        action: (idx: number, value: any) => any
    ) => {
        return (_e: any, { value }: { value: string }) => {
            action(rowindex, value);
        };
    };

    getCell(
        placeholder: string,
        rowindex: number,
        availableDrugNames?: typeof drugNames
    ) {
        const values = this.props.recreationalDrugs;
        let cell;

        switch (placeholder) {
            case 'Drug Name': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={availableDrugNames}
                            placeholder={placeholder}
                            onChange={(_, { value }) =>
                                this.props.updateRecreationalDrugUsedName(
                                    rowindex,
                                    value as DrugName
                                )
                            }
                            rowindex={rowindex}
                            value={values.drugsUsed[rowindex].name}
                            aria-label='Recreational-Drug-Consumption-Name-Dropdown'
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case 'Mode of Delivery': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            options={modesOfDelivery}
                            placeholder={placeholder}
                            onChange={(_, { value }) =>
                                this.props.updateRecreationalDrugUsedModesOfDelivery(
                                    rowindex,
                                    value as ModeOfDelivery[]
                                )
                            }
                            rowindex={rowindex}
                            value={values.drugsUsed[rowindex].modesOfDelivery}
                            aria-label='Recreational-Drug-Consumption-Modes-Of-Delivery-Dropdown'
                            className='side-effects'
                        />
                    </Input>
                );
                break;
            }
            case '# Per Week': {
                cell = (
                    <Input
                        fluid
                        type='number'
                        className='content-input-computer content-dropdown'
                        onChange={(_, { value }) => {
                            const numberInput = parseInt(value);
                            if (!isNaN(numberInput)) {
                                this.props.updateRecreationalDrugUsedPerWeek(
                                    rowindex,
                                    numberInput
                                );
                            } else if (value == '') {
                                this.props.updateRecreationalDrugUsedPerWeek(
                                    rowindex,
                                    -1
                                );
                            }
                        }}
                        placeholder={placeholder}
                        rowindex={rowindex}
                        value={
                            values.drugsUsed[rowindex].numberPerWeek === -1
                                ? ''
                                : values.drugsUsed[rowindex].numberPerWeek
                        }
                        aria-label='Recreational-Drug-Consumption-Number-Per-Week-Input'
                    />
                );
                break;
            }
            case 'delete': {
                cell = (
                    <Button
                        rowindex={rowindex}
                        circular
                        icon='close'
                        size='mini'
                        type='delete'
                        basic
                        onClick={() => {
                            this.props.deleteRecreationalDrugUsed(rowindex);
                        }}
                    />
                );
                break;
            }
            default: {
                break;
            }
        }
        return cell;
    }

    makeAccordionPanels(drugsUsed: DrugUsage[]) {
        const values = this.props.recreationalDrugs;
        const panels = [];
        const usedDrugNames: string[] = [];

        for (let i = 0; i < drugsUsed.length; i++) {
            const availableDrugNames = drugNames.filter(
                (drug) => _.indexOf(usedDrugNames, drug.value) < 0
            );
            usedDrugNames.push(drugsUsed[i].name);

            const titleContent = (
                <Form className='inline-form'>
                    <Input
                        transparent
                        className='content-input-surgical content-dropdown medication'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={availableDrugNames}
                            placeholder='Drug Name'
                            onChange={(_, { value }) =>
                                this.props.updateRecreationalDrugUsedName(
                                    i,
                                    value as DrugName
                                )
                            }
                            rowindex={i}
                            value={values.drugsUsed[i].name}
                            aria-label='Recreational-Drug-Consumption-Name-Dropdown'
                            className='side-effects'
                            icon=''
                        />
                        <Button
                            style={{ marginTop: 5, marginBottom: 5 }}
                            icon='close'
                            type='delete'
                            compact
                            basic
                            onClick={() => {
                                this.props.deleteRecreationalDrugUsed(i);
                            }}
                        />
                    </Input>
                </Form>
            );
            const modeOfDeliveryContent = (
                <Input
                    fluid
                    transparent
                    className='content-input content-dropdown'
                >
                    <Dropdown
                        fluid
                        search
                        selection
                        multiple
                        options={modesOfDelivery}
                        placeholder='Mode of Delivery'
                        onChange={(_, { value }) =>
                            this.props.updateRecreationalDrugUsedModesOfDelivery(
                                i,
                                value as ModeOfDelivery[]
                            )
                        }
                        rowindex={i}
                        value={values.drugsUsed[i].modesOfDelivery}
                        aria-label='Recreational-Drug-Consumption-Modes-Of-Delivery-Dropdown'
                        className='side-effects'
                        icon=''
                    />
                </Input>
            );
            const numberPerWeekContent = (
                <Input
                    fluid
                    transparent
                    type='number'
                    className='content-input content-dropdown'
                    onChange={(_, { value }) => {
                        const numberInput = parseInt(value);
                        if (!isNaN(numberInput)) {
                            this.props.updateRecreationalDrugUsedPerWeek(
                                i,
                                numberInput
                            );
                        } else if (value == '') {
                            this.props.updateRecreationalDrugUsedPerWeek(i, -1);
                        }
                    }}
                    placeholder='# Per Week'
                    rowindex={i}
                    value={
                        values.drugsUsed[i].numberPerWeek === -1
                            ? ''
                            : values.drugsUsed[i].numberPerWeek
                    }
                    aria-label='Recreational-Drug-Consumption-Number-Per-Week-Input'
                />
            );

            panels.push({
                key: i,
                title: {
                    content: titleContent,
                },
                content: {
                    content: (
                        <>
                            {modeOfDeliveryContent} {numberPerWeekContent}
                        </>
                    ),
                },
            });
        }
        return panels;
    }

    makeTableBodyRows(drugsUsed: DrugUsage[]) {
        const usedDrugNames: string[] = [];

        return drugsUsed.map((_used, index) => {
            const availableDrugNames = drugNames.filter(
                (drug) => _.indexOf(usedDrugNames, drug.value) < 0
            );
            usedDrugNames.push(_used.name);

            return (
                <Table.Row key={index}>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('Drug Name', index, availableDrugNames)}
                    </Table.Cell>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('Mode of Delivery', index)}
                    </Table.Cell>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('# Per Week', index)}
                    </Table.Cell>
                    <Table.Cell
                        collapsing
                        style={{ borderLeft: 0 }}
                        onClick={this.handleCellClick}
                    >
                        {this.getCell('delete', index)}
                    </Table.Cell>
                </Table.Row>
            );
        });
    }

    additionalFields() {
        const values = this.props.recreationalDrugs;

        if (
            values.usage === SubstanceUsageResponse.Yes ||
            values.usage === SubstanceUsageResponse.InThePast
        ) {
            const headerRow = this.makeHeader();
            const drugsUsed = values.drugsUsed;
            const rows = this.makeTableBodyRows(drugsUsed);

            const content = this.props.mobile ? (
                <div>
                    <p>
                        {values.usage === SubstanceUsageResponse.InThePast
                            ? 'Please summarize what recreational drugs you previously used:'
                            : 'Please summarize your current drug use:'}
                    </p>
                    <Accordion
                        panels={this.makeAccordionPanels(drugsUsed)}
                        exclusive={false}
                        fluid
                        styled
                        aria-label='Recreational-Drugs-Consumption-Accordion'
                    />
                </div>
            ) : (
                <div>
                    {values.usage === SubstanceUsageResponse.InThePast
                        ? 'Please summarize what recreational drugs you previously used:'
                        : 'Please summarize your current drug use:'}
                    <Table celled>
                        <Table.Header content={headerRow} />
                        <Table.Body>{rows}</Table.Body>
                    </Table>
                </div>
            );

            return (
                <>
                    {content}
                    <AddRowButton
                        onClick={() => {
                            if (values.drugsUsed.length < drugNames.length) {
                                this.props.addRecreationalDrugUsed();
                            }
                        }}
                        name='drug'
                        ariaLabel='Add-Recreational-Drug-Consumption-Button'
                    />
                </>
            );
        }
    }

    generateUsageButton(response: SubstanceUsageResponse) {
        const values = this.props.recreationalDrugs;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateRecreationalDrugUsage(response);
                }}
                condition='Recreational Drugs'
                title={
                    response === SubstanceUsageResponse.Yes
                        ? 'Yes'
                        : response === SubstanceUsageResponse.InThePast
                        ? 'In the Past'
                        : response === SubstanceUsageResponse.NeverUsed
                        ? 'Never Used'
                        : ''
                }
                size='small'
                compact={true}
                active={values.usage === response}
            />
        );
    }

    render() {
        const values = this.props.recreationalDrugs;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>Recreational Drugs</div>
                        <div>
                            {this.generateUsageButton(
                                SubstanceUsageResponse.Yes
                            )}
                            {this.generateUsageButton(
                                SubstanceUsageResponse.InThePast
                            )}
                            {this.generateUsageButton(
                                SubstanceUsageResponse.NeverUsed
                            )}
                        </div>
                    </Form.Group>
                    {(values.usage === SubstanceUsageResponse.Yes ||
                        values.usage === SubstanceUsageResponse.InThePast) && (
                        <div>
                            <Divider hidden />
                            <Grid stackable>{this.includeQuitYear()}</Grid>
                            <Divider hidden />
                            {this.additionalFields()}
                            <Divider hidden />
                            {this.quittingQuestions()}
                            <Divider hidden />
                            <Grid.Row>
                                <div className='condition-name'>Comments</div>
                                <Form.TextArea
                                    inline
                                    className='condition-header'
                                    field={'Comments'}
                                    condition='Recreational Drugs'
                                    value={values.comments}
                                    onChange={(_, { value }) => {
                                        this.props.updateRecreationalDrugComments(
                                            value as string
                                        );
                                    }}
                                    placeholder={
                                        this.props.mobile ? 'Comments' : null
                                    }
                                />
                            </Grid.Row>
                        </div>
                    )}
                    {values.usage === SubstanceUsageResponse.Yes ||
                    values.usage === SubstanceUsageResponse.InThePast ? (
                        <Divider hidden />
                    ) : null}
                </Form>

                <Divider className='divider-style' />
            </Grid.Row>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    recreationalDrugs: selectRecreationalDrugsState(state),
});

const mapDispatchToProps = {
    updateRecreationalDrugUsage,
    addRecreationalDrugUsed,
    updateRecreationalDrugUsedName,
    updateRecreationalDrugUsedModesOfDelivery,
    updateRecreationalDrugUsedPerWeek,
    deleteRecreationalDrugUsed,
    updateRecreationalDrugQuitYear,
    updateRecreationalDrugComments,
    updateRecreationalDrugInterestedInQuitting,
    updateRecreationalDrugTriedToQuit,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(RecreationalDrugs);
