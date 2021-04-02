import React, { Component } from 'react';
import {
    Grid,
    Button,
    Divider,
    Segment,
    Header,
    Accordion,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import HPIContext from 'contexts/HPIContext.js';
import './ReviewOfSystems.css';
import AllNegativeButton from './AllNegativeButton';
import { ROS_SMALL_BP } from 'constants/breakpoints';

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class ReviewOfSystemsCategory extends Component {
    static contextType = HPIContext;

    constructor(props) {
        super(props);

        this.category = this.props.category;
        this.options = this.props.options;
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

    handleChange = (option, value) => {
        const values = this.context['Review of Systems'];
        if (values[this.category][option] === value) {
            values[this.category][option] = '';
        } else if (
            values[this.category][option] === '' ||
            values[this.category][option] !== value
        ) {
            values[this.category][option] = value;
        }
        this.context.onContextChange('Review of Systems', values);
    };
    state = { activeIndex: 0 };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };
    render() {
        //check if screen width is small and in mobile view
        const { windowWidth } = this.state;
        let isMobileView;
        if (windowWidth < ROS_SMALL_BP) {
            isMobileView = true;
        }
        //renders component with accordion
        if (isMobileView) {
            const { activeIndex } = this.state;
            return (
                <Segment>
                    <Accordion>
                        <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={this.handleClick}
                        >
                            {this.category}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <Divider />
                            <Grid padded>
                                <AllNegativeButton
                                    handleClick={this.handleChange}
                                >
                                    {this.options.map((option) => (
                                        <Grid.Row key={option}>
                                            <Grid.Column
                                                width={4}
                                                className='no-padding'
                                            >
                                                <Button
                                                    compact
                                                    floated='right'
                                                    color={
                                                        this.context[
                                                            'Review of Systems'
                                                        ][this.category][
                                                            option
                                                        ] === 'n'
                                                            ? 'green'
                                                            : null
                                                    }
                                                    value='n'
                                                    active={
                                                        this.context[
                                                            'Review of Systems'
                                                        ][this.category][
                                                            option
                                                        ] === 'n'
                                                    }
                                                    onClick={(e, { value }) =>
                                                        this.handleChange(
                                                            option,
                                                            value
                                                        )
                                                    }
                                                >
                                                    NO
                                                </Button>
                                            </Grid.Column>
                                            <Grid.Column
                                                width={7}
                                                verticalAlign='middle'
                                                className='ros-symptom no-padding'
                                            >
                                                {option.replace(
                                                    'Δ',
                                                    'Changes in'
                                                )}
                                            </Grid.Column>
                                            <Grid.Column
                                                width={4}
                                                className='no-padding'
                                            >
                                                <Button
                                                    compact
                                                    floated='left'
                                                    color={
                                                        this.context[
                                                            'Review of Systems'
                                                        ][this.category][
                                                            option
                                                        ] === 'y'
                                                            ? 'red'
                                                            : null
                                                    }
                                                    value='y'
                                                    active={
                                                        this.context[
                                                            'Review of Systems'
                                                        ][this.category][
                                                            option
                                                        ] === 'y'
                                                    }
                                                    onClick={(e, { value }) =>
                                                        this.handleChange(
                                                            option,
                                                            value
                                                        )
                                                    }
                                                >
                                                    YES
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ))}
                                </AllNegativeButton>
                            </Grid>
                        </Accordion.Content>
                    </Accordion>
                    {/* <Header as={'h2'}>{this.category}</Header> */}
                </Segment>
            );
        } else
            return (
                <Segment>
                    <Header as={'h2'}>{this.category}</Header>
                    <Divider />
                    <Grid padded>
                        <AllNegativeButton handleClick={this.handleChange}>
                            {this.options.map((option) => (
                                <Grid.Row key={option}>
                                    <Grid.Column
                                        width={4}
                                        className='no-padding'
                                    >
                                        <Button
                                            compact
                                            floated='right'
                                            color={
                                                this.context[
                                                    'Review of Systems'
                                                ][this.category][option] === 'n'
                                                    ? 'green'
                                                    : null
                                            }
                                            value='n'
                                            active={
                                                this.context[
                                                    'Review of Systems'
                                                ][this.category][option] === 'n'
                                            }
                                            onClick={(e, { value }) =>
                                                this.handleChange(option, value)
                                            }
                                        >
                                            NO
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column
                                        width={7}
                                        verticalAlign='middle'
                                        className='ros-symptom no-padding'
                                    >
                                        {option.replace('Δ', 'Changes in')}
                                    </Grid.Column>
                                    <Grid.Column
                                        width={4}
                                        className='no-padding'
                                    >
                                        <Button
                                            compact
                                            floated='left'
                                            color={
                                                this.context[
                                                    'Review of Systems'
                                                ][this.category][option] === 'y'
                                                    ? 'red'
                                                    : null
                                            }
                                            value='y'
                                            active={
                                                this.context[
                                                    'Review of Systems'
                                                ][this.category][option] === 'y'
                                            }
                                            onClick={(e, { value }) =>
                                                this.handleChange(option, value)
                                            }
                                        >
                                            YES
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

ReviewOfSystemsCategory.propTypes = {
    category: PropTypes.string.isRequired, //Heading that goes over the divider
    options: PropTypes.array.isRequired, //Options to choose from the category
};
