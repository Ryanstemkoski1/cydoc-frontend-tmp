import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import NavMenu from '../../components/navigation/NavMenu';

class GenerateInpatientPlan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div>
                    <NavMenu className='landing-page-nav-menu' />
                </div>
                <div className='ui container active-tab-container'>
                    <div className='ui segment'></div>
                </div>
            </Fragment>
        );
    }
}

const mapStatetoProps = (state) => ({ currentNote: state });

const mapDispatchToProps = {};

export default connect(
    mapStatetoProps,
    mapDispatchToProps
)(GenerateInpatientPlan);
