import React, { Component } from 'react';
import Masonry from 'react-masonry-css';
import './ReviewOfSystems.css';
import ReviewOfSystemsCategory from './ReviewOfSystemsCategory';
import ReviewOfSystemsCategoryMisc from './ReviewOfSystemsCategoryMisc';
import { sections } from 'constants/review-of-systems-constants';
import { ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP } from 'constants/breakpoints';
import { Button, Icon } from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';

//Component that manages the content for the Review of Systems section of the note
export default class ReviewOfSystemsContent extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    generateList = (systemsCategories) => {
        //Generates the list for the original categories
        const original = Object.keys(systemsCategories).map((label) => (
            <ReviewOfSystemsCategory
                key={label}
                category={label}
                options={systemsCategories[label]}
            />
        ));

        //Generates the list for the miscellaneous catgeories
        const values = this.context['Review of Systems'];
        if (!values['Misc']) {
            values['Misc'] = {};
            values['Misc'] = [{ name: '', options: [] }];
        }
        const misc = values['Misc'].map((misc, index) => (
            <ReviewOfSystemsCategoryMisc key={index} index={index} />
        ));
        return misc.concat(original);
    };

    addMisc = () => {
        const values = this.context['Review of Systems'];
        values['Misc'].push({ name: '', options: [] });
        this.context.onContextChange('Review of Systems', values);
    };

    previousFormClick = () => {
        this.props.previousFormClick();
        window.localStorage.setItem('activeIndex', 5);
        window.localStorage.setItem('activeTabName', 'Family History');
    };

    render() {
        const { windowWidth } = this.state;

        let numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }
        return (
            <>
                <Button onClick={this.addMisc}>Add Misc</Button>
                <Masonry
                    className='ros-container'
                    breakpointCols={numColumns}
                    columnClassName='ros-column'
                >
                    {this.generateList(sections)}
                </Masonry>

                <Button
                    icon
                    floated='left'
                    onClick={this.previousFormClick}
                    className='small-ros-previous-button'
                >
                    <Icon name='left arrow' />
                </Button>
                <Button
                    icon
                    labelPosition='left'
                    floated='left'
                    onClick={this.previousFormClick}
                    className='ros-previous-button'
                >
                    Previous
                    <Icon name='left arrow' />
                </Button>

                <Button
                    icon
                    floated='right'
                    onClick={this.props.nextFormClick}
                    className='small-ros-next-button'
                >
                    <Icon name='right arrow' />
                </Button>
                <Button
                    icon
                    labelPosition='right'
                    floated='right'
                    onClick={this.props.nextFormClick}
                    className='ros-next-button'
                >
                    Next
                    <Icon name='right arrow' />
                </Button>
            </>
        );
    }
}
