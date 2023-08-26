import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    selectManyHandleClick,
    SelectManyHandleClickAction,
} from 'redux/actions/hpiActions';
import {
    toggleROSOption,
    ToggleROSOptionAction,
} from 'redux/actions/reviewOfSystemsActions';
import { CurrentNoteState } from 'redux/reducers';
import { ReviewOfSystemsState } from 'redux/reducers/reviewOfSystemsReducer';
import {
    selectReviewOfSystemsOptions,
    selectReviewOfSystemsState,
} from 'redux/selectors/reviewOfSystemsSelectors';
import { Header } from 'semantic-ui-react';
import AllNegativeButton from './AllNegativeButton.js';
import './ReviewOfSystems.css';
import style from './ReviewOfSystemsCategory.module.scss';

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

    componentDidUpdate(prevProps: Props) {
        if (prevProps.ROSState !== this.props.ROSState) {
            this.setState({ ROSState: this.props.ROSState });
        }
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
            <div className={style.reviewOfSystems}>
                {!this.isSelectMany() && (
                    <Header
                        as='h3'
                        className={`header-titles ${style.reviewOfSystems__caption}`}
                    >
                        {this.breakWord(category)}
                    </Header>
                )}

                <AllNegativeButton handleClick={this.handleChange}>
                    {ROSOptions.map((option: string) => (
                        <div
                            className={`${style.reviewOfSystems__item} reviewOfSystemsItem flex align-center justify-between`}
                            key={option}
                        >
                            <YesAndNo
                                yesButtonActive={
                                    ROSState[category][option] ===
                                    YesNoResponse.Yes
                                }
                                handleYesButtonClick={() =>
                                    this.handleChange(option, YesNoResponse.Yes)
                                }
                                noButtonActive={
                                    ROSState[category][option] ===
                                    YesNoResponse.No
                                }
                                handleNoButtonClick={() => {
                                    this.handleChange(option, YesNoResponse.No);
                                }}
                            />
                            <p>{option.replace('Δ', 'Changes in')}</p>

                            <YesAndNo
                                yesButtonActive={
                                    ROSState[category][option] ===
                                    YesNoResponse.Yes
                                }
                                handleYesButtonClick={() =>
                                    this.handleChange(option, YesNoResponse.Yes)
                                }
                                noButtonActive={
                                    ROSState[category][option] ===
                                    YesNoResponse.No
                                }
                                handleNoButtonClick={() => {
                                    this.handleChange(option, YesNoResponse.No);
                                }}
                            />
                        </div>
                    ))}
                </AllNegativeButton>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewOfSystemsCategory);
