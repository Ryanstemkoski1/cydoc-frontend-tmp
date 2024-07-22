import YesAndNo from '@components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from '@constants/enums';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { selectManyHandleClick } from '@redux/actions/hpiActions';
import { toggleROSOption } from '@redux/actions/reviewOfSystemsActions';
import { CurrentNoteState } from '@redux/reducers';
import { ReviewOfSystemsState } from '@redux/reducers/reviewOfSystemsReducer';
import {
    selectReviewOfSystemsOptions,
    selectReviewOfSystemsState,
} from '@redux/selectors/reviewOfSystemsSelectors';
import { Header } from 'semantic-ui-react';
import AllNegativeButton from './AllNegativeButton.js';
import './ReviewOfSystems.css';
import style from './ReviewOfSystemsCategory.module.scss';
import HandleWriteInInput from '../hpi/knowledgegraph/components/responseComponents/HandleWriteInInput';

interface OwnProps {
    category: string;
    key: string;
    node: string;
    selectManyState: ReviewOfSystemsState;
    selectManyOptions: string[];
}

type ReduxProps = ConnectedProps<typeof connector>;

interface State {
    ROSState: ReviewOfSystemsState;
}

type Props = ReduxProps & OwnProps;

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
        const slash = '/';
        if (category.includes(slash)) {
            return category.split('/').join(' / ');
        } else {
            return category;
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
                            className={`${style.reviewOfSystems__item} reviewOfSystemsItem flex flex-wrap align-center justify-between`}
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
                            {option.toLowerCase() === 'other' &&
                            ROSState[category][option] === YesNoResponse.Yes ? (
                                <HandleWriteInInput
                                    name={option}
                                    node={this.props.node}
                                    options={ROSOptions}
                                />
                            ) : (
                                <p>{option.replace('Δ', 'Changes in')}</p>
                            )}
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

const mapStateToProps = (state: CurrentNoteState, ownProps: OwnProps) => ({
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

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ReviewOfSystemsCategory);
