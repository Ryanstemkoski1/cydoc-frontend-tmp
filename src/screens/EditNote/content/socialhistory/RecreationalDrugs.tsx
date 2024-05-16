/* eslint-disable @typescript-eslint/explicit-function-return-type */
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import HistoryButtons from 'components/tools/ThreeButton/ThreeButtons';
import { DrugName, drugNames } from 'constants/SocialHistory/drugNames';
import modesOfDelivery, {
    ModeOfDelivery,
} from 'constants/SocialHistory/modesOfDelivery';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import _ from 'lodash';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    addRecreationalDrugUsed,
    deleteRecreationalDrugUsed,
    updateRecreationalDrugComments,
    updateRecreationalDrugInterestedInQuitting,
    updateRecreationalDrugQuitYear,
    updateRecreationalDrugTriedToQuit,
    updateRecreationalDrugUsage,
    updateRecreationalDrugUsedModesOfDelivery,
    updateRecreationalDrugUsedName,
    updateRecreationalDrugUsedPerWeek,
} from '@redux/actions/socialHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import { DrugUsage } from '@redux/reducers/socialHistoryReducer';
import { selectRecreationalDrugsState } from '@redux/selectors/socialHistorySelectors';
import {
    Button,
    Divider,
    Dropdown,
    Form,
    Grid,
    Input,
    Table,
    TextArea,
} from 'semantic-ui-react';
import '../familyhistory/FamilyHistory.css';
import '../hpi/knowledgegraph/css/Button.css';

/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;

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
                                Please enter a year between 1900 and{' '}
                                {this.state.currentYear}
                            </p>
                        )}
                    </Form.Field>
                </Grid.Column>
            );
        }
    }

    quittingQuestions() {
        const values = this.props.recreationalDrugs;
        if (values.usage === SubstanceUsageResponse.Yes) {
            return (
                <Grid stackable>
                    <Form className='family-hx-note-item bottom-space'>
                        <Form.Group inline className='condition-header'>
                            <div className='condition-name'>
                                Are you interested in quitting?
                            </div>
                            <div className='interested-in-quitting-buttons btn-wrapper'>
                                <HistoryButtons
                                    options={[
                                        {
                                            value: YesNoMaybeResponse.Yes,
                                            label: 'Yes',
                                        },
                                        {
                                            value: YesNoMaybeResponse.Maybe,
                                            label: 'Maybe',
                                        },
                                        {
                                            value: YesNoMaybeResponse.No,
                                            label: 'No',
                                        },
                                    ]}
                                    keyToCompare='interestedInQuitting'
                                    condition='Recreational Drugs'
                                    value={this.props.recreationalDrugs}
                                    onToggle={
                                        this.props
                                            .updateRecreationalDrugInterestedInQuitting
                                    }
                                />
                            </div>
                        </Form.Group>
                    </Form>
                    <Form className='family-hx-note-item'>
                        <Form.Group inline className='condition-header'>
                            <div className='condition-name'>
                                Have you tried to quit before?
                            </div>
                            <div className='tried-to-quit-buttons btn-wrapper'>
                                <HistoryButtons
                                    options={[
                                        {
                                            value: YesNoResponse.Yes,
                                            label: 'Yes',
                                        },
                                        {
                                            value: YesNoResponse.No,
                                            label: 'No',
                                        },
                                    ]}
                                    keyToCompare='triedToQuit'
                                    condition='Recreational Drugs'
                                    value={this.props.recreationalDrugs}
                                    onToggle={
                                        this.props
                                            .updateRecreationalDrugTriedToQuit
                                    }
                                />
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
                <Table.HeaderCell id='drugs-header' />
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
                    <RemoveButton
                        name='sw'
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
        const panels: {
            key: number;
            title: { content: React.JSX.Element };
            content: { content: React.JSX.Element };
        }[] = [];
        const usedDrugNames: string[] = [];

        for (let i = 0; i < drugsUsed.length; i++) {
            const availableDrugNames = drugNames.filter(
                (drug) => _.indexOf(usedDrugNames, drug.value) < 0
            );
            usedDrugNames.push(drugsUsed[i].name);

            const titleContent = (
                <Form className='inline-form'>
                    {/* <Input
                        transparent
                        className='content-input-surgical content-dropdown medication'
                    > */}
                    <div id='title-div'>
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
                            id='dropdown-display'
                        />
                        <Button
                            id='btn-hpi-type-delete'
                            aria-label='remove'
                            icon='close'
                            compact
                            onClick={() => {
                                this.props.deleteRecreationalDrugUsed(i);
                            }}
                            className='hpi-ph-button'
                        />
                    </div>
                    {/* </Input> */}
                </Form>
            );
            const modeOfDeliveryContent = (
                // <Input
                //     fluid
                //     transparent
                //     className='content-input content-dropdown'
                // >
                // <div style={{width: "100%", whiteSpace: "nowrap"}}>
                <>
                    <label>Mode of delivery:</label>
                    <Dropdown
                        fluid
                        search
                        selection
                        multiple
                        options={modesOfDelivery}
                        placeholder='Enter...'
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
                        id='mode-of-delivery'
                    />
                </>
                // </div>
                // </Input>
            );
            const numberPerWeekContent = (
                <div id='contents-div'>
                    <label id='contents-label'>Number Per Week:</label>
                    <TextArea
                        fluid
                        transparent
                        type='number'
                        className='content-input content-dropdown'
                        onChange={(_: any, { value }: any) => {
                            const numberInput = parseInt(value);
                            if (!isNaN(numberInput)) {
                                this.props.updateRecreationalDrugUsedPerWeek(
                                    i,
                                    numberInput
                                );
                            } else if (value == '') {
                                this.props.updateRecreationalDrugUsedPerWeek(
                                    i,
                                    -1
                                );
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
                        id='num-per-week'
                    />
                </div>
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
                    <Table.Cell
                        onClick={this.handleCellClick}
                        className='recreational-dropdown'
                    >
                        {this.getCell('Mode of Delivery', index)}
                    </Table.Cell>
                    <Table.Cell onClick={this.handleCellClick}>
                        {this.getCell('# Per Week', index)}
                    </Table.Cell>
                    <Table.Cell
                        id='drugs-header'
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

            const content = (
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

    render() {
        const values = this.props.recreationalDrugs;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>Recreational Drugs</div>
                        <div className='btn-wrapper'>
                            <HistoryButtons
                                options={[
                                    {
                                        value: SubstanceUsageResponse.Yes,
                                        label: 'Yes',
                                    },
                                    {
                                        value: SubstanceUsageResponse.InThePast,
                                        label: 'In the Past',
                                    },
                                    {
                                        value: SubstanceUsageResponse.NeverUsed,
                                        label: 'Never Used',
                                    },
                                ]}
                                keyToCompare='usage'
                                condition='Recreational Drugs'
                                value={this.props.recreationalDrugs}
                                onToggle={
                                    this.props.updateRecreationalDrugUsage
                                }
                            />
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
