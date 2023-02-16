import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import NavMenu from '../../components/navigation/NavMenu';
import './GenerateInpatientPlan.css';

class GenerateInpatientPlan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <NavMenu className='landing-page-nav-menu' />
                <div className='ui container active-tab-container large-width'>
                    <div className='ui segment'>
                        <div className='ui two column grid divided relaxed'>
                            <div className='column'>
                                <h2 className='ui header row center'>Laboratory Data</h2>
                                <div className='row center subheader'>All values are optional. Including more values yields a more detailed plan.</div>
                                <h3 className='ui header row'>Vitals</h3>
                                <div className='ui five column grid stackable'>
                                    <div className='column label'>Temp</div>
                                    <div className='column label'>HR</div>
                                    <div className='column label'>BP</div>
                                    <div className='column label'>RR</div>
                                    <div className='column label'>O2 Sat.</div>
                                </div>
                                <h3 className='ui header row'>BMP</h3>
                                <div className='ui four column grid stackable'>
                                    <div className='row'>
                                        <div className='column label'>Na</div>
                                        <div className='column label'>Cl</div>
                                        <div className='column label'>BUM</div>
                                    </div>
                                    <div className='row tight'>
                                        <div className='right floated column short label'>Glucose</div>
                                    </div>
                                    <div className='row tight'>
                                        <div className='column label'>K</div>
                                        <div className='column label'>HCO3</div>
                                        <div className='column label'>Cr</div>
                                    </div>
                                </div>
                                <div className='ui four column grid stackable'>
                                    <div className='column'>
                                        <h3 className='ui header row padding-top'>CBC</h3>
                                        <div className='row label'>Hgb</div>
                                        <div className='row tall label'>Wrc</div>
                                        <div className='row tall padding-bottom label'>Pb</div>
                                    </div>
                                    <div className='column'>
                                        <h3 className='ui header row padding-top'>Other</h3>
                                        <div className='row label'>pH</div>
                                        <div className='row tall label'>PCO2</div>
                                        <div className='row tall label'>Albumin</div>
                                        <div className='row tall label'>Ca</div>
                                        <div className='row tall label'>Phosphate</div>
                                    </div>
                                </div>
                            </div>
                            <div className='column'>
                                <h2 className='ui header row center'>Plan Outline</h2>
                                <div className='row center subheader'>Fill in the laboratory data on the left, then press 'Calculate Results' to see your results.</div>
                            </div>
                        </div>
                    </div>
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
