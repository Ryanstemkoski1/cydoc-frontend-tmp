import NavigationButton from 'components/tools/NavigationButton/NavigationButton';
import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { selectReviewOfSystemsCategories } from 'redux/selectors/reviewOfSystemsSelectors';
import { selectPatientViewState } from 'redux/selectors/userViewSelectors';
import { Header, Segment } from 'semantic-ui-react';
import constants from '../../../../constants/review-of-systems-constants.json';
import { PatientViewProps } from '../hpi/knowledgegraph/src/components/ChiefComplaintsButton';
import './ReviewOfSystems.css';
import ReviewOfSystemsCategory from './ReviewOfSystemsCategory';

interface ContentProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
    setItem: (key: string, value: any) => void;
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

class ReviewOfSystemsContent extends Component<ROSContentProps> {
    previousFormClick = () => {
        this.props.previousFormClick();
        window.localStorage.this.setItem('activeIndex', 5);
        window.localStorage.this.setItem('activeTabName', 'Family History');
    };

    render() {
        const { nextFormClick, previousFormClick, patientView } = this.props;
        const numColumns = 3;

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
                            <Segment key={categories}>
                                <ReviewOfSystemsCategory
                                    key={categories}
                                    category={categories}
                                    selectManyOptions={[]}
                                    selectManyState={{}}
                                    node={''}
                                />
                            </Segment>
                        );
                    })}
                </Masonry>

                {patientView ? (
                    <NavigationButton previousClick={previousFormClick} />
                ) : (
                    <NavigationButton
                        previousClick={previousFormClick}
                        nextClick={nextFormClick}
                    />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, null)(ReviewOfSystemsContent);
