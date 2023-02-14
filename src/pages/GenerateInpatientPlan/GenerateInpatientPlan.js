import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { deleteNote } from '../../redux/actions/currentNoteActions';

import { LANDING_PAGE_MOBLE_BP } from 'constants/breakpoints.js';

class GenerateInpatientPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1000,
            windowHeight: 0,
            redirect: '',
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;
            
        return (
            <>
                {stack ? (
                    <div>This is mobile</div>
                ) : (
                    <div>This is desktop</div>
                )}
            </>
        );
    }
}

const mapStatetoProps = (state) => ({ currentNote: state });

const mapDispatchToProps = {
    deleteNote,
};

export default connect(mapStatetoProps, mapDispatchToProps)(GenerateInpatientPlan);
