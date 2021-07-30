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
import drinkTypes, { DrinkType } from 'constants/SocialHistory/drinkTypes';
import drinkSizes, { DrinkSize } from 'constants/SocialHistory/drinkSizes';
import ToggleButton from 'components/tools/ToggleButton.js';
import AddRowButton from 'components/tools/AddRowButton';
import {
    updateAlcoholUsage,
    addAlcoholConsumption,
    updateAlcoholConsumptionType,
    updateAlcoholConsumptionSize,
    updateAlcoholConsumptionPerWeek,
    deleteAlcoholConsumption,
    updateAlcoholQuitYear,
    updateAlcoholComments,
    updateAlcoholInterestedInQuitting,
    updateAlcoholTriedToQuit,
} from 'redux/actions/socialHistoryActions';
import { AlcoholConsumption } from 'redux/reducers/socialHistoryReducer';
import { selectAlcoholState } from 'redux/selectors/socialHistorySelectors';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
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

class Alcohol extends React.Component<Props, State> {
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
        const values = this.props.alcohol;
        if (values.usage === SubstanceUsageResponse.InThePast) {
            return (
                <Grid.Column computer={5} tablet={8} mobile={16}>
                    <Form.Field className='table-year-input'>
                        Quit Year
                        <Input
                            type='number'
                            field='Quit Year'
                            onBlur={this.onYearChange}
                            condition='Alcohol'
                            value={values.quitYear == -1 ? '' : values.quitYear}
                            onChange={(_, { value }) => {
                                const numberInput = parseInt(value);
                                if (!isNaN(numberInput)) {
                                    this.props.updateAlcoholQuitYear(
                                        numberInput
                                    );
                                } else if (value == '') {
                                    this.props.updateAlcoholQuitYear(-1);
                                }
                            }}
                        />
                        {this.state.invalidYear && (
                            <p className='year-validation-error'>
                                Please enter a year between 1900 and{' '}
                                {this.state.currentYear}
                            </p>
                        )}
                    </Form.Field>
                </Grid.Column>
            );
        }
    }

    generateInterestedInQuittingButton(response: YesNoMaybeResponse) {
        const values = this.props.alcohol;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateAlcoholInterestedInQuitting(response);
                }}
                condition='Alcohol'
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
        const values = this.props.alcohol;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateAlcoholTriedToQuit(response);
                }}
                condition='Alcohol'
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
        const values = this.props.alcohol;
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
            if (innerInput.type !== 'delete') {
                // will ensure clicks near delete button will not automatically click
                innerInput.click();
            }
        }
    };

    makeHeader() {
        return (
            <Table.Row>
                <Table.HeaderCell>Drink Type</Table.HeaderCell>
                <Table.HeaderCell>Drink Size</Table.HeaderCell>
                <Table.HeaderCell># Per Week</Table.HeaderCell>
                <Table.HeaderCell style={{ borderLeft: 0 }} />
            </Table.Row>
        );
    }

    getCell(
        placeholder: string,
        rowindex: number,
        availableDrinkTypes?: typeof drinkTypes
    ) {
        const values = this.props.alcohol;
        let cell;

        switch (placeholder) {
            case 'Drink Type': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={availableDrinkTypes}
                            placeholder={placeholder}
                            onChange={(_, { value }) => {
                                this.props.updateAlcoholConsumptionType(
                                    rowindex,
                                    value as DrinkType
                                );
                            }}
                            rowindex={rowindex}
                            value={values.drinksConsumed[rowindex].type}
                            className='side-effects'
                            aria-label='Alcohol-Consumption-Type-Dropdown'
                        />
                    </Input>
                );
                break;
            }
            case 'Drink Size': {
                cell = (
                    <Input
                        fluid
                        className='content-input-computer content-dropdown'
                    >
                        <Dropdown
                            fluid
                            search
                            selection
                            options={drinkSizes}
                            placeholder={placeholder}
                            onChange={(_, { value }) => {
                                this.props.updateAlcoholConsumptionSize(
                                    rowindex,
                                    value as DrinkSize
                                );
                            }}
                            rowindex={rowindex}
                            value={values.drinksConsumed[rowindex].size}
                            aria-label='Alcohol-Consumption-Size-Dropdown'
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
                                this.props.updateAlcoholConsumptionPerWeek(
                                    rowindex,
                                    numberInput
                                );
                            } else if (value == '') {
                                this.props.updateAlcoholConsumptionPerWeek(
                                    rowindex,
                                    -1
                                );
                            }
                        }}
                        placeholder={placeholder}
                        rowindex={rowindex}
                        value={
                            values.drinksConsumed[rowindex].numberPerWeek == -1
                                ? ''
                                : values.drinksConsumed[rowindex].numberPerWeek
                        }
                        aria-label='Alcohol-Number-Per-Week-Input'
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
                            this.props.deleteAlcoholConsumption(rowindex);
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

    makeAccordionPanels(drinksConsumed: AlcoholConsumption[]) {
        const values = this.props.alcohol;
        const panels = [];

        for (let i = 0; i < drinksConsumed.length; i++) {
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
                            options={drinkTypes}
                            placeholder='Drink Type'
                            onChange={(_, { value }) => {
                                this.props.updateAlcoholConsumptionType(
                                    i,
                                    value as DrinkType
                                );
                            }}
                            rowindex={i}
                            value={values.drinksConsumed[i].type}
                            className='side-effects'
                            icon=''
                            onBlur={(event) => event.preventDefault()}
                            aria-label='Alcohol-Consumption-Type-Dropdown'
                        />
                        <Button
                            style={{ marginTop: 5, marginBottom: 5 }}
                            icon='close'
                            type='delete'
                            compact
                            basic
                            onClick={() => {
                                this.props.deleteAlcoholConsumption(i);
                            }}
                        />
                    </Input>
                </Form>
            );
            const drinkSizeContent = (
                <Input
                    fluid
                    transparent
                    className='content-input content-dropdown'
                >
                    <Dropdown
                        fluid
                        search
                        selection
                        icon=''
                        options={drinkSizes}
                        placeholder='Drink Size'
                        onChange={(_, { value }) => {
                            this.props.updateAlcoholConsumptionSize(
                                i,
                                value as DrinkSize
                            );
                        }}
                        rowindex={i}
                        value={values.drinksConsumed[i].size}
                        aria-label='Alcohol-Consumption-Size-Dropdown'
                        className='side-effects'
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
                            this.props.updateAlcoholConsumptionPerWeek(
                                i,
                                numberInput
                            );
                        } else if (value == '') {
                            this.props.updateAlcoholConsumptionPerWeek(i, -1);
                        }
                    }}
                    placeholder='# Per Week'
                    rowindex={i}
                    value={
                        values.drinksConsumed[i].numberPerWeek == -1
                            ? ''
                            : values.drinksConsumed[i].numberPerWeek
                    }
                    aria-label='Alcohol-Number-Per-Week-Input'
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
                            {drinkSizeContent} {numberPerWeekContent}
                        </>
                    ),
                },
            });
        }
        return panels;
    }

    makeTableBodyRows(drinksConsumed: AlcoholConsumption[]) {
        const consumedDrinkTypes: string[] = [];

        return drinksConsumed.map((_consumption, index) => {
            const availableDrinkTypes = drinkTypes.filter(
                (drink) => _.indexOf(consumedDrinkTypes, drink.value) < 0
            );
            consumedDrinkTypes.push(_consumption.type);

            return (
                <Table.Row key={index}>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('Drink Type', index, availableDrinkTypes)}
                    </Table.Cell>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('Drink Size', index)}
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
        const values = this.props.alcohol;

        if (
            values.usage === SubstanceUsageResponse.Yes ||
            values.usage === SubstanceUsageResponse.InThePast
        ) {
            const headerRow = this.makeHeader();
            const drinksConsumed = values.drinksConsumed;
            const rows = this.makeTableBodyRows(drinksConsumed);

            const content = this.props.mobile ? (
                <div>
                    <p>
                        {values.usage === SubstanceUsageResponse.InThePast
                            ? 'Please summarize what you used to drink:'
                            : 'Please summarize your current drinking habits:'}
                    </p>
                    <Accordion
                        panels={this.makeAccordionPanels(drinksConsumed)}
                        exclusive={false}
                        fluid
                        styled
                        aria-label='Alcohol-Consumption-Accordion'
                    />
                </div>
            ) : (
                <div>
                    {values.usage === SubstanceUsageResponse.InThePast
                        ? 'Please summarize what you used to drink:'
                        : 'Please summarize your current drinking habits:'}
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
                        ariaLabel='Add-Alcohol-Consumption-Button'
                        onClick={() => {
                            if (
                                values.drinksConsumed.length < drinkTypes.length
                            ) {
                                this.props.addAlcoholConsumption();
                            }
                        }}
                        name='drink type'
                    />
                </>
            );
        }
    }

    generateUsageButton(response: SubstanceUsageResponse) {
        const values = this.props.alcohol;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateAlcoholUsage(response);
                }}
                condition='Alcohol'
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
        const values = this.props.alcohol;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>Alcohol</div>
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
                                    condition='Alcohol'
                                    value={values.comments}
                                    onChange={(_, { value }) => {
                                        this.props.updateAlcoholComments(
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
            </Grid.Row>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    alcohol: selectAlcoholState(state),
});

const mapDispatchToProps = {
    updateAlcoholUsage,
    addAlcoholConsumption,
    updateAlcoholConsumptionType,
    updateAlcoholConsumptionSize,
    updateAlcoholConsumptionPerWeek,
    deleteAlcoholConsumption,
    updateAlcoholQuitYear,
    updateAlcoholComments,
    updateAlcoholInterestedInQuitting,
    updateAlcoholTriedToQuit,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Alcohol);
