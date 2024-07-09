import NavigationButton from '@components/tools/NavigationButton/NavigationButton';
import { withDimensionsHook } from '@hooks/useDimensions';
import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import { ConnectedProps, connect } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import { selectReviewOfSystemsCategories } from '@redux/selectors/reviewOfSystemsSelectors';
import { selectPatientViewState } from '@redux/selectors/userViewSelectors';
import { Header, Segment } from 'semantic-ui-react';
import constants from '../../../../constants/review-of-systems-constants.json';
import './ReviewOfSystems.css';
import ReviewOfSystemsCategory from './ReviewOfSystemsCategory';

interface OwnProps {
    nextFormClick: () => void;
    previousFormClick: () => void;
    setItem: (key: string, value: any) => void;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps &
    ReduxProps & {
        dimensions: {
            windowWidth: number;
            windowHeight: number;
        };
    };

class ReviewOfSystemsContent extends Component<Props> {
    previousFormClick = () => {
        this.props.previousFormClick();
    };

    render() {
        const { dimensions, nextFormClick, previousFormClick, patientView } =
            this.props;

        const { windowWidth } = dimensions;

        let numColumns = 3;

        if (windowWidth < 768) {
            numColumns = 1;
        } else if (windowWidth < 992) {
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

const mapStateToProps = (state: CurrentNoteState) => ({
    ROSCategories: selectReviewOfSystemsCategories(state),
    patientView: selectPatientViewState(state),
});

const connector = connect(mapStateToProps);

export default withDimensionsHook(connector(ReviewOfSystemsContent));
