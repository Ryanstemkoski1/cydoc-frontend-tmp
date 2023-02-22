import React, { Component, Fragment } from 'react';
import { Input, Grid, Container, Segment, Header } from 'semantic-ui-react';

import NavMenu from '../../components/navigation/NavMenu';
import './GenerateInpatientPlan.css';

class GenerateInpatientPlan extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            isSmallBreakpoint: false
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateDimensions);
    };

    updateDimensions() {
        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const isSmallBreakpoint = windowWidth < 1610;
        this.setState({ isSmallBreakpoint });
    }

    render() {
        const { isSmallBreakpoint } = this.state;

        const vitalsSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
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
        );


        // Variables for BMP
        const Na = (
            <div className='label-set'>
                <div className='label'>Na</div>
                <div className='input-with-label-below'>
                    <Input type='number' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>
        );

        const Cl = (
            <div className='label-set'>
                <div className='label'>Cl</div>
                <div className='input-with-label-below'>
                    <Input type='number' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>            
        );

        const BUN = (
            <div className='label-set'>
                <div className='label'>BUN</div>
                <div className='input-with-label-below'>
                    <Input type='number' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>
        );

        const K = (
            <div className='label-set'>
                <div className='label'>K</div>
                <div className='input-with-label-below'>
                    <Input type='number' step='.1' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>    
        );

        const HCO3 = (
            <div className='label-set'>
                <div className='label'>HC03</div>
                <div className='input-with-label-below'>
                    <Input type='number' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>
        );

        const Cr = (
            <div className='label-set'>
                <div className='label'>Cr</div>
                <div className='input-with-label-below'>
                    <Input type='number' step='.01' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>  
        );

        const Glucose = (
            <div className='label-set'>
                <div className='label'>Glucose</div>
                <div className='input-with-label-below'>
                    <Input type='number' size='mini' className='extra-small-input' />
                    <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                </div>                                    
            </div>
        );

        /** 
         * Since this grid should have a fishbone structure at the large
         * breakpoint versus a single column structure at the small breakpoint, 
         * there are different HTML structures for each breakpoint.
         */
        const BMPSubGrid = (
            isSmallBreakpoint ? (
                <Grid columns={5} className='stack'>
                    {Na}
                    {Cl}
                    {BUN}
                    {Glucose}
                    {K}
                    {HCO3}
                    {Cr}   
                </Grid>
            ) : (
                <Grid columns={5} stackable>
                <div>
                    {Na}
                    <br />
                    {K}
                </div>
                <div>
                    {Cl}
                    <br />
                    {HCO3}
                </div>
                <div>
                    {BUN}
                    <br />
                    {Cr}    
                </div>
                <div className='middle-align'>
                    {Glucose}
                </div>
            </Grid>
            )
        );

        const CBCSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
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
                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
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
        );

        const otherSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
                <div className='label-set'>
                    <div className='label'>pH</div>
                    <div className='input-with-label-below'>
                        <Input type='number' step='.01' size='mini' className='extra-small-input' />
                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>PC02</div>
                    <div className='input-with-label-below'>
                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>Albumin</div>
                    <div className='input-with-label-below'>
                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                    </div>                                    
                </div>
                <div className='label-set'>
                    <div className='label'>Ca</div>
                    <div className='input-with-label-below'>
                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                    </div>                                    
                </div>
                <div className='label-set'>
                    <div className='label'>Phosphate</div>
                    <div className='input-with-label-below'>
                        <Input type='number' step='.1' size='mini' className='extra-small-input' />
                        <div className='normal-range'>Normal 135 - 145 mEg/L</div>
                    </div>                                   
                </div>
            </Grid>
        );

        return (
            <Fragment>
                <NavMenu className='landing-page-nav-menu' />
                <Container className='active-tab-container large-width'>
                    <Segment>
                        <Grid columns={2} divided relaxed>
                            <Grid.Column width={`${isSmallBreakpoint ? 8 : 11}`}>
                                <Grid.Row centered>
                                    <Header as='h2' textAlign='center'>
                                        Laboratory Data
                                    </Header>
                                </Grid.Row>
                                <Grid.Row className='subheader'>
                                    All values are optional. Including more values yields a more detailed plan.
                                </Grid.Row>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>Vitals</Header>
                                </Grid.Row>
                                {vitalsSubGrid}
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>BMP</Header>
                                </Grid.Row>
                                {BMPSubGrid}
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>CBC</Header>
                                </Grid.Row>
                                {CBCSubGrid}
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>Other</Header>
                                </Grid.Row>
                                {otherSubGrid}
                            </Grid.Column>
                            <Grid.Column width={`${isSmallBreakpoint ? 8 : 5}`}>
                                <h2 className='ui header row center'>
                                    Plan Outline
                                </h2>
                                <div className='row center subheader'>
                                    Fill in the laboratory data on the left, then press 'Calculate Results' to see your results.
                                </div>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Container>
            </Fragment>
        );
    }
}

export default GenerateInpatientPlan;
