import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Divider, Form, Grid, Input, Dropdown } from 'semantic-ui-react';
import tobaccoProducts from 'constants/SocialHistory/tobaccoProducts';
import ToggleButton from 'components/tools/ToggleButton.js';
import { selectTobaccoState } from 'redux/selectors/socialHistorySelectors';
import {
    updateTobaccoUsage,
    updateTobaccoPacksPerDay,
    updateTobaccoNumberOfYears,
    updateTobaccoProductUsed,
    updateTobaccoQuitYear,
    updateTobaccoComments,
    updateTobaccoInterestedInQuitting,
    updateTobaccoTriedToQuit,
} from 'redux/actions/socialHistoryActions';
import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import { CurrentNoteState } from 'redux/reducers';
import { TobaccoProduct } from 'constants/SocialHistory/tobaccoProducts';

import '../familyhistory/FamilyHistory.css';

type OwnProps = {
    mobile: boolean;
};
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

interface State {
    invalidYear: boolean;
}

class Tobacco extends React.Component<Props, State> {
    currentYear: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            invalidYear: false,
        };
        this.currentYear = new Date(Date.now()).getFullYear();
        this.additionalFields = this.additionalFields.bind(this);
    }

    onYearChange = (e: React.SyntheticEvent) => {
        const numberYear = +(e.target as HTMLInputElement).value;
        this.setState({
            invalidYear:
                (e.target as HTMLInputElement).value != '' &&
                (isNaN(numberYear) ||
                    numberYear < 1900 ||
                    numberYear > this.currentYear),
        });
    };

    includeQuitYear() {
        const values = this.props.tobacco;
        if (values.usage === SubstanceUsageResponse.InThePast) {
            return (
                <Grid.Column computer={5} tablet={8} mobile={16}>
                    <Form.Field className='table-year-input'>
                        Quit Year
                        <Input
                            type='number'
                            field='Quit Year'
                            onBlur={this.onYearChange}
                            condition='Tobacco'
                            value={
                                values.quitYear === -1 ? '' : values.quitYear
                            }
                            onChange={(_, { value }) => {
                                const numberInput = parseInt(value);
                                if (!isNaN(numberInput)) {
                                    this.props.updateTobaccoQuitYear(
                                        numberInput
                                    );
                                } else if (value == '') {
                                    this.props.updateTobaccoQuitYear(-1);
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
        const values = this.props.tobacco;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateTobaccoInterestedInQuitting(response);
                }}
                condition='Tobacco'
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
        const values = this.props.tobacco;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateTobaccoTriedToQuit(response);
                }}
                condition='Tobacco'
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
        const values = this.props.tobacco;
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

    // asks for packs per day, number of years, and products used
    additionalFields() {
        const values = this.props.tobacco;

        if (
            values.usage === SubstanceUsageResponse.Yes ||
            values.usage === SubstanceUsageResponse.InThePast
        ) {
            return (
                <Grid stackable>
                    <Grid.Row columns='equal'>
                        <Grid.Column>
                            <Form.Field>
                                Packs/Day
                                <Input
                                    type='number'
                                    field='Packs/Day'
                                    condition='Tobacco'
                                    value={
                                        values.packsPerDay === -1
                                            ? ''
                                            : values.packsPerDay
                                    }
                                    onChange={(_, { value }) => {
                                        const numberInput = parseInt(value);
                                        if (!isNaN(numberInput)) {
                                            this.props.updateTobaccoPacksPerDay(
                                                numberInput
                                            );
                                        } else if (value == '') {
                                            this.props.updateTobaccoPacksPerDay(
                                                -1
                                            );
                                        }
                                    }}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                Number of Years
                                {/* TODO: require numerical value, type=number might not work on all browsers? */}
                                <Input
                                    type='number'
                                    field='Number of Years'
                                    condition='Tobacco'
                                    value={
                                        values.numberOfYears === -1
                                            ? ''
                                            : values.numberOfYears
                                    }
                                    onChange={(_, { value }) => {
                                        const numberInput = parseInt(value);
                                        if (!isNaN(numberInput)) {
                                            this.props.updateTobaccoNumberOfYears(
                                                numberInput
                                            );
                                        } else if (value == '') {
                                            this.props.updateTobaccoNumberOfYears(
                                                -1
                                            );
                                        }
                                    }}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            Products Used
                            <Dropdown
                                placeholder='Products Used'
                                fluid
                                multiple
                                search
                                selection
                                options={tobaccoProducts}
                                onChange={(_, { value }) => {
                                    this.props.updateTobaccoProductUsed(
                                        value as TobaccoProduct[]
                                    );
                                }}
                                value={values.productsUsed}
                                aria-label='Tobacco-Products-Used-Dropdown'
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
    }

    generateUsageButton(response: SubstanceUsageResponse) {
        const values = this.props.tobacco;

        return (
            <ToggleButton
                onToggleButtonClick={() => {
                    this.props.updateTobaccoUsage(response);
                }}
                condition='Tobacco'
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
        const values = this.props.tobacco;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>Tobacco</div>
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
                                    condition='Tobacco'
                                    value={values.comments}
                                    onChange={(_, { value }) => {
                                        this.props.updateTobaccoComments(
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
    tobacco: selectTobaccoState(state),
});

const mapDispatchToProps = {
    updateTobaccoUsage,
    updateTobaccoPacksPerDay,
    updateTobaccoNumberOfYears,
    updateTobaccoProductUsed,
    updateTobaccoQuitYear,
    updateTobaccoComments,
    updateTobaccoInterestedInQuitting,
    updateTobaccoTriedToQuit,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Tobacco);
