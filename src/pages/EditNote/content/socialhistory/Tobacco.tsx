/* eslint-disable @typescript-eslint/explicit-function-return-type */
import tobaccoProducts, {
    TobaccoProduct,
} from 'constants/SocialHistory/tobaccoProducts';
import { SubstanceUsageResponse, YesNoMaybeResponse } from 'constants/enums';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
    updateTobaccoComments,
    updateTobaccoInterestedInQuitting,
    updateTobaccoNumberOfYears,
    updateTobaccoPacksPerDay,
    updateTobaccoProductUsed,
    updateTobaccoQuitYear,
    updateTobaccoTriedToQuit,
    updateTobaccoUsage,
} from 'redux/actions/socialHistoryActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectTobaccoState } from 'redux/selectors/socialHistorySelectors';
import { Divider, Dropdown, Form, Grid, Input } from 'semantic-ui-react';
import HistoryButtons from '../../../../components/tools/ThreeButton/ThreeButtons';
import '../familyhistory/FamilyHistory.css';
import '../hpi/knowledgegraph/css/Button.css';

/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;

interface State {
    invalidYear: boolean;
    inputType: string;
}

class Tobacco extends React.Component<Props, State> {
    currentYear: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            invalidYear: false,
            inputType: '',
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

    checkValidateStr = (testStr: string) => {
        const trimmedValue = testStr;
        let inputType = this.state.inputType;
        if (`${this.props.tobacco.packsPerDay}`.length > testStr.length) {
            if (this.state.inputType === 'DECIMAL' && testStr.indexOf('.')) {
                this.setState({ inputType: '' });
                inputType = '';
            }
            if (this.state.inputType === 'FRACTION' && testStr.indexOf('/')) {
                this.setState({ inputType: '' });
                inputType = '';
            }
            return true;
        }
        if (
            /^(?:\d+(?:\s+\d+\/\d+)?|\d+\/\d+|\d+(?:\.\d+)?|\d+\s+\d+)$/.test(
                trimmedValue
            )
        ) {
            return true;
        } else {
            if (
                testStr.length > 1 &&
                testStr[testStr.length - 1] == '.' &&
                inputType === '' &&
                testStr.indexOf(' ') === -1
            ) {
                this.setState({ inputType: 'DECIMAL' });
                return true;
            }
            if (
                testStr.length > 1 &&
                testStr[testStr.length - 1] == ' ' &&
                testStr.indexOf(' ') === testStr.lastIndexOf(' ') &&
                inputType !== 'DECIMAL' &&
                inputType !== 'FRACTION'
            ) {
                return true;
            }
            if (
                testStr.length > 1 &&
                testStr[testStr.length - 1] == '/' &&
                this.state.inputType === ''
            ) {
                this.setState({ inputType: 'FRACTION' });
                return true;
            }
            return false;
        }
    };

    validateInput = (input: string) => {
        input = input.trim();
        const pattern = /^(?:(?:\d+\s+)?\d+\/\d+|\d+(?:\.\d+)?|\d+)$/;
        return pattern.test(input) ? false : true;
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
                                Please enter a year between 1900 and{' '}
                                {this.currentYear}
                            </p>
                        )}
                    </Form.Field>
                </Grid.Column>
            );
        }
    }

    quittingQuestions() {
        const values = this.props.tobacco;
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
                                    keyToCompare={'interestedInQuitting'}
                                    condition={'Tobacco'}
                                    value={this.props.tobacco}
                                    onToggle={
                                        this.props
                                            .updateTobaccoInterestedInQuitting
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
                            <HistoryButtons
                                options={[
                                    {
                                        value: YesNoMaybeResponse.Yes,
                                        label: 'Yes',
                                    },
                                    {
                                        value: YesNoMaybeResponse.No,
                                        label: 'No',
                                    },
                                ]}
                                keyToCompare={'triedToQuit'}
                                condition={'Tobacco'}
                                value={this.props.tobacco}
                                onToggle={this.props.updateTobaccoTriedToQuit}
                            />
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
                                    type='string'
                                    field='Packs/Day'
                                    condition='Tobacco'
                                    value={
                                        values.packsPerDay === -1
                                            ? ''
                                            : values.packsPerDay
                                    }
                                    onChange={(_, { value }) => {
                                        if (this.checkValidateStr(value)) {
                                            this.props.updateTobaccoPacksPerDay(
                                                value
                                            );
                                        } else if (value == '') {
                                            this.props.updateTobaccoPacksPerDay(
                                                '-1'
                                            );
                                            this.setState({ inputType: '' });
                                        }
                                    }}
                                />
                                {this.validateInput(`${values.packsPerDay}`) &&
                                    `${values.packsPerDay}` !== '' &&
                                    values.packsPerDay !== -1 && (
                                        <div className='error-input'>
                                            Invalid input
                                        </div>
                                    )}
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

    render() {
        const values = this.props.tobacco;

        return (
            <Grid.Row>
                <Form className='family-hx-note-item'>
                    <Form.Group inline className='condition-header'>
                        <div className='condition-name'>Tobacco</div>
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
                                        label: 'Never used',
                                    },
                                ]}
                                keyToCompare={'usage'}
                                condition={'Tobacco'}
                                value={this.props.tobacco}
                                onToggle={this.props.updateTobaccoUsage}
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
                                    condition='Tobacco'
                                    value={values.comments}
                                    onChange={(_, { value }) => {
                                        this.props.updateTobaccoComments(
                                            value as string
                                        );
                                    }}
                                    rows={3}
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
