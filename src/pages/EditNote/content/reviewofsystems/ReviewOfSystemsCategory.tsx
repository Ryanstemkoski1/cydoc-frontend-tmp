import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    toggleROSOption,
    ToggleROSOptionAction,
} from 'redux/actions/reviewOfSystemsActions';
import {
    selectManyHandleClick,
    SelectManyHandleClickAction,
} from 'redux/actions/hpiActions';
import {
    selectReviewOfSystemsState,
    selectReviewOfSystemsOptions,
} from 'redux/selectors/reviewOfSystemsSelectors';
import { YesNoResponse } from 'constants/enums';
import { Grid, Button, Divider, Segment, Header } from 'semantic-ui-react';
import './ReviewOfSystems.css';
import { ReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import AllNegativeButton from './AllNegativeButton.js';

interface CategoryProps {
    key: string;
    category: string;
    selectManyState: ReviewOfSystemsState;
    node: string;
}

interface StateProps {
    ROSState: ReviewOfSystemsState;
    ROSOptions: string[];
}

interface OwnProps {
    category: string;
    selectManyState: ReviewOfSystemsState;
    selectManyOptions: string[];
}

interface DispatchProps {
    toggleROSOption: (
        category: string,
        option: string,
        yesOrNo: YesNoResponse
    ) => ToggleROSOptionAction;
    selectManyHandleClick: (
        medId: string,
        option: string,
        yesOrNo: YesNoResponse
    ) => SelectManyHandleClickAction;
}

interface OwnState {
    ROSState: ReviewOfSystemsState;
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: OwnProps
): StateProps => ({
    ROSState:
        Object.keys(ownProps.selectManyState).length == 0
            ? selectReviewOfSystemsState(state)
            : ownProps.selectManyState,
    ROSOptions:
        Object.keys(ownProps.selectManyState).length == 0
            ? selectReviewOfSystemsOptions(state, ownProps.category)
            : ownProps.selectManyOptions,
});

const mapDispatchToProps = {
    toggleROSOption: toggleROSOption,
    selectManyHandleClick: selectManyHandleClick,
};

type Props = CategoryProps & DispatchProps & StateProps;
type State = OwnState;

class ReviewOfSystemsCategory extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ROSState: this.props.ROSState };
    }
    handleChange = (option: string, value: YesNoResponse) => {
        if (!this.isSelectMany()) {
            this.props.toggleROSOption(this.props.category, option, value);
            this.setState({ ROSState: this.props.ROSState });
        } else {
            this.props.selectManyHandleClick(this.props.node, option, value);
            this.setState((prevState) => ({
                ROSState: {
                    ...prevState.ROSState,
                    ['']: {
                        ...prevState.ROSState[''],
                        [option]:
                            value === prevState.ROSState[''][option]
                                ? ''
                                : value,
                    },
                },
            }));
        }
    };

    isSelectMany = () => {
        return Object.keys(this.props.selectManyState).length != 0;
    };

    breakWord = (category: string): string | undefined => {
        let header = '';
        const slash = '/';
        if (category.includes(slash)) {
            return (header = category.split('/').join(' / '));
        } else {
            return (header = category);
        }
    };
    render() {
        const { category, ROSOptions } = this.props;
        let { ROSState } = this.props;
        if (this.isSelectMany()) {
            ROSState = this.state.ROSState;
        }
        return (
            <Segment className='ros-segments'>
                <Header as={'h3'} className='header-titles'>
                    {this.breakWord(category)}
                </Header>
                <Divider />
                <Grid padded>
                    <AllNegativeButton handleClick={this.handleChange}>
                        {ROSOptions.map((option: string) => (
                            <Grid.Row key={option}>
                                <Grid.Column width={4} className='no-padding'>
                                    <Button
                                        className={'pe-ros-button'}
                                        aria-label='no-button'
                                        compact
                                        floated='right'
                                        color={
                                            ROSState[category][option] ===
                                            YesNoResponse.No
                                                ? 'green'
                                                : undefined
                                        }
                                        value={YesNoResponse.No}
                                        active={
                                            ROSState[category][option] ===
                                            YesNoResponse.No
                                        }
                                        onClick={(_e, { value }) =>
                                            this.handleChange(option, value)
                                        }
                                    >
                                        No
                                    </Button>
                                </Grid.Column>
                                <Grid.Column
                                    width={7}
                                    verticalAlign='middle'
                                    className='ros-symptom no-padding'
                                >
                                    {option.replace('Δ', 'Changes in')}
                                </Grid.Column>
                                <Grid.Column width={4} className='no-padding'>
                                    <Button
                                        className={'pe-ros-button'}
                                        aria-label='yes-button'
                                        compact
                                        floated='left'
                                        color={
                                            ROSState[category][option] ===
                                            YesNoResponse.Yes
                                                ? 'red'
                                                : undefined
                                        }
                                        value={YesNoResponse.Yes}
                                        active={
                                            ROSState[category][option] ===
                                            YesNoResponse.Yes
                                        }
                                        onClick={(_e, { value }) =>
                                            this.handleChange(option, value)
                                        }
                                    >
                                        Yes
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        ))}
                    </AllNegativeButton>
                </Grid>
            </Segment>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewOfSystemsCategory);
