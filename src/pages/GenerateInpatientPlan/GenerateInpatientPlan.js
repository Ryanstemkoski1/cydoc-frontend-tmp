import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Input, Grid, GridColumn, GridRow, Container, Segment, Header } from 'semantic-ui-react';

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
                <Container className='active-tab-container large-width'>
                    <Segment>
                        <Grid columns={2} divided relaxed>
                            <Grid.Column width={11}>
                                <Grid.Row centered>
                                    <Header as='h2' textAlign='center'>Laboratory Data</Header>
                                </Grid.Row>
                                <Grid.Row className='subheader'>All values are optional. Including more values yields a more detailed plan.</Grid.Row>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>Vitals</Header>
                                </Grid.Row>
                                <Grid columns={5} stackable>
                                    <div className='label-set'>
                                        <div className='label'>Temp</div>
                                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
                                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>BP</div>
                                        <Input type='number' size='mini' className='extra-small-input' />
                                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>HR</div>
                                        <Input type='number' size='mini' className='extra-small-input' />
                                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>RR</div>
                                        <Input type='number' size='mini' className='extra-small-input' />
                                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>O2 Sat</div>
                                        <Input type='number' size='mini' className='extra-small-input' />
                                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                    </div>
                                </Grid>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>BMP</Header>
                                </Grid.Row>
                                <Grid columns={5} stackable>
                                    <Grid.Column>
                                        <div className='label-set'>
                                            <div className='label'>Na</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                        <br />
                                        <div className='label-set right'>
                                            <div className='label'>K</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className='label-set'>
                                            <div className='label'>Cl</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                        <br />
                                        <div className='label-set right'>
                                            <div className='label'>HC03</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className='label-set'>
                                            <div className='label'>BUN</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                        <br />
                                        <div className='label-set right'>
                                            <div className='label'>Cr</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>    
                                    </Grid.Column>
                                    <Grid.Column verticalAlign='middle'>
                                        <div className='label-set right'>
                                            <div className='label'>Glucose</div>
                                            <div className='input-with-label-below'>
                                                <Input type='number' size='mini' className='extra-small-input' />
                                                <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                            </div>                                    
                                        </div>
                                    </Grid.Column>
                                </Grid>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>CBC</Header>
                                </Grid.Row>
                                <Grid columns={5} stackable>
                                    <div className='label-set'>
                                        <div className='label'>Hgb</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' step='.1' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>WBC</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>Plt</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>                                    
                                    </div>                                  
                                </Grid>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>Other</Header>
                                </Grid.Row>
                                <Grid columns={5} stackable>
                                    <div className='label-set'>
                                        <div className='label'>pH</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' step='.1' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>PC02</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>Albumin</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>                                    
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>Ca</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>                                    
                                    </div>
                                    <div className='label-set'>
                                        <div className='label'>Phosphate</div>
                                        <div className='input-with-label-below'>
                                            <Input type='number' size='mini' className='extra-small-input' />
                                            <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                                        </div>                                   
                                    </div>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <h2 className='ui header row center'>Plan Outline</h2>
                                <div className='row center subheader'>Fill in the laboratory data on the left, then press 'Calculate Results' to see your results.</div>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Container>
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
