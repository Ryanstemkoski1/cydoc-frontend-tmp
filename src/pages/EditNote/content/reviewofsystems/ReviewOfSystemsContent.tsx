import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import './ReviewOfSystems.css';
import { ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP } from 'constants/breakpoints';
import { Button, Icon, Header } from 'semantic-ui-react';
import ReviewOfSystemsCategory from './ReviewOfSystemsCategory';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import { selectReviewOfSystemsCategories } from 'redux/selectors/reviewOfSystemsSelectors';
import { PatientViewProps } from '../hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import constants from '../../../../constants/review-of-systems-constants.json';

interface ContentProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
    setItem: (key: string, value: any) => void;
}

interface ContentState {
    windowWidth: number;
    windowHeight: number;
}

interface StateProps {
    ROSCategories: string[];
}

interface SectionProps {
    [category: string]: string[];
}

type ROSContentProps = ContentProps &
    SectionProps &
    StateProps &
    PatientViewProps;

const mapStateToProps = (
    state: CurrentNoteState
): StateProps & PatientViewProps => ({
    ROSCategories: selectReviewOfSystemsCategories(state),
    patientView: selectPatientViewState(state),
});

class ReviewOfSystemsContent extends Component<ROSContentProps, ContentState> {
    constructor(props: ROSContentProps) {
        super(props);
        this.state = {
            windowHeight: 0,
            windowWidth: 0,
        };
    }

    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateDimensions);
    };

    updateDimensions = () => {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    };

    previousFormClick = () => {
        this.props.previousFormClick();
        window.localStorage.this.setItem('activeIndex', 5);
        window.localStorage.this.setItem('activeTabName', 'Family History');
    };

    render() {
        const { nextFormClick, previousFormClick, patientView } = this.props;
        const { windowWidth } = this.state;
        let numColumns: number;
        numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }

        return (
            <>
                {/* Cannot use this.addMisc since it had used Context */}
                {/* <Button onClick={this.addMisc}>Add Misc</Button> */}
                {patientView && (
                    <Header
                        as='h2'
                        textAlign='center'
                        content={constants.sections.pageTitle}
                    />
                )}

                <Masonry
                    className='ros-container'
                    breakpointCols={numColumns}
                    columnClassName='ros-column'
                >
                    {this.props.ROSCategories.map((categories) => {
                        return (
                            <ReviewOfSystemsCategory
                                key={categories}
                                category={categories}
                                selectManyOptions={[]}
                                selectManyState={{}}
                                node={''}
                            />
                        );
                    })}
                </Masonry>
                <Button
                    icon
                    floated='left'
                    onClick={previousFormClick}
                    className='small-ros-previous-button'
                >
                    <Icon name='arrow left' />
                </Button>
                <Button
                    icon
                    labelPosition='left'
                    floated='left'
                    onClick={previousFormClick}
                    className='ros-previous-button'
                >
                    Prev
                    <Icon name='arrow left' />
                </Button>
                {patientView ? (
                    ''
                ) : (
                    <>
                        {' '}
                        <Button
                            icon
                            floated='right'
                            onClick={nextFormClick}
                            className='small-ros-next-button'
                        >
                            <Icon name='arrow right' />
                        </Button>
                        <Button
                            icon
                            labelPosition='right'
                            floated='right'
                            onClick={nextFormClick}
                            className='ros-next-button'
                        >
                            Next
                            <Icon name='arrow right' />
                        </Button>{' '}
                    </>
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, null)(ReviewOfSystemsContent);
