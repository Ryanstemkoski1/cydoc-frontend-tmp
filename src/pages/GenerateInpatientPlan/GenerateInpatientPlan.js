import React, { Component, Fragment } from 'react';
import { Input, Grid, Container, Segment, Header, Button } from 'semantic-ui-react';

import NavMenu from '../../components/navigation/NavMenu';
import './GenerateInpatientPlan.css';

class GenerateInpatientPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSmallBreakpoint: false,
            isYesButtonPressed: false,
            isNoButtonPressed: false,
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
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const isSmallBreakpoint = windowWidth < 1610;
        this.setState({ isSmallBreakpoint });
    }

    render() {
        let { isSmallBreakpoint, isYesButtonPressed, isNoButtonPressed } = this.state;

        const vitalsSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
                <div className='label-set'>
                    <div className='label'>Temp</div>
                    <Input
                        type='number'
                        step='.1'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 36.1 - 37.2 C</div>
                </div>
                <div className='label-set'>
                    <div className='label'>BP</div>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 120/80 mmHg</div>
                </div>
                <div className='label-set'>
                    <div className='label'>HR</div>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 60 - 100 bpm</div>
                </div>
                <div className='label-set'>
                    <div className='label'>RR</div>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 12 - 20 bpm</div>
                </div>
                <div className='label-set'>
                    <div className='label'>O2 Sat</div>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 98 - 100%</div>
                </div>
            </Grid>
        );

        // Variables for BMP
        const Na = (
            <div className='label-set'>
                <div className='label'>Na</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 135 - 145 mmol/L</div>
                </div>
            </div>
        );

        const Cl = (
            <div className='label-set'>
                <div className='label'>Cl</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 98 - 108 mmol/L</div>
                </div>
            </div>
        );

        const BUN = (
            <div className='label-set'>
                <div className='label'>BUN</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 7 - 20 mg/dL</div>
                </div>
            </div>
        );

        const K = (
            <div className='label-set'>
                <div className='label'>K</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        step='.1'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 3.5 - 5 mmol/L</div>
                </div>
            </div>
        );

        const HCO3 = (
            <div className='label-set'>
                <div className='label'>HC03</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 21 - 30 mmol/L</div>
                </div>
            </div>
        );

        const Cr = (
            <div className='label-set'>
                <div className='label'>Cr</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        step='.01'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 0.4 - 1 mg/dL</div>
                </div>
            </div>
        );

        const Glucose = (
            <div className='label-set'>
                <div className='label'>Glucose</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        size='mini'
                        className='extra-small-input'
                    />
                    <div className='normal-range'>Normal 70 - 140 mg/dL</div>
                </div>
            </div>
        );

        /**
         * Since this grid should have a fishbone structure at the large
         * breakpoint versus a single column structure at the small breakpoint,
         * there are different HTML structures for each breakpoint.
         */
        const BMPSubGrid = isSmallBreakpoint ? (
            <Grid columns={5} className='stack'>
                {Na}
                {Cl}
                {BUN}
                {K}
                {HCO3}
                {Cr}
                {Glucose}
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
                <div className='middle-align'>{Glucose}</div>
            </Grid>
        );

        const CBCSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
                <div className='label-set'>
                    <div className='label'>Hgb</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 12 - 15.5 g/dL
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>WBC</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 3.2 - 9.8 x10<sup>9</sup>/L
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>Plt</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 150 - 450 x10<sup>9</sup>/L
                        </div>
                    </div>
                </div>
            </Grid>
        );

        const otherSubGrid = (
            <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
                <div className='label-set'>
                    <div className='label'>pH</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.01'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 7.35 - 7.45
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>PC02</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 35 - 45
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>Albumin</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 3.5 - 4.8 g/dL
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>Ca</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 8.7 - 10.2 mg/dL
                        </div>
                    </div>
                </div>
                <div className='label-set'>
                    <div className='label'>Phosphate</div>
                    <div className='input-with-label-below'>
                        <Input
                            type='number'
                            step='.1'
                            size='mini'
                            className='extra-small-input'
                        />
                        <div className='normal-range'>
                            Normal 2.8 - 4.5 mg/dL
                        </div>
                    </div>
                </div>
            </Grid>
        );

        const toggleInfectionButtons = (infection) => {
            this.setState({ isNoButtonPressed: !infection });
            this.setState({ isYesButtonPressed: infection });
        }

        const infectionButtons = (
            <Grid.Row>
                <p>Suspected or present source of infection?</p>
                <Button
                    className='no-button'
                    active={isNoButtonPressed}
                    basic={!isNoButtonPressed}
                    color={isNoButtonPressed ? 'blue': 'grey'}
                    onClick={() => toggleInfectionButtons(false)}>
                        No
                </Button>
                <Button
                    active={isYesButtonPressed}
                    basic={!isYesButtonPressed}
                    color={isYesButtonPressed ? 'blue': 'grey'}
                    onClick={() => toggleInfectionButtons(true)}>
                        Yes
                </Button>
            </Grid.Row>
        );

        const submitAndClearButtons = (
            <Grid.Row>
                <Button>Calculate Results</Button>
                <Button basic color='grey'>Clear data</Button>
            </Grid.Row>
        );

        return (
            <Fragment>
                <NavMenu className='landing-page-nav-menu' />
                <Container className='active-tab-container large-width'>
                    <Segment>
                        <Grid columns={2} divided relaxed stackable>
                            <Grid.Column
                                width={`${isSmallBreakpoint ? 8 : 11}`}
                            >
                                <Grid.Row centered>
                                    <Header as='h2' textAlign='center'>
                                        Laboratory Data
                                    </Header>
                                </Grid.Row>
                                <Grid.Row className='subheader'>
                                    All values are optional. Including more
                                    values yields a more detailed plan.
                                </Grid.Row>
                                <Grid.Row className='data-header'>
                                    <Header as='h3'>Vitals</Header>
                                </Grid.Row>
                                {vitalsSubGrid}
                                {infectionButtons}
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
                                {submitAndClearButtons}
                            </Grid.Column>
                            <Grid.Column width={`${isSmallBreakpoint ? 8 : 5}`}>
                                <h2 className='ui header row center'>
                                    Plan Outline
                                </h2>
                                <div className='row center subheader'>
                                    Fill in the laboratory data on the left,
                                    then press &lsquo;Calculate Results&rsquo;
                                    to see your results.
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
