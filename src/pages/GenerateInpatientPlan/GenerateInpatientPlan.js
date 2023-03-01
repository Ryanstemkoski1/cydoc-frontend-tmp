import React, { Fragment, useEffect, useState } from 'react';
import { Input, Grid, Container, Segment, Header, Button } from 'semantic-ui-react';

import ToggleButton from 'components/tools/ToggleButton';
import NavMenu from 'components/navigation/NavMenu';
import './GenerateInpatientPlan.css';

const GenerateInpatientPlan = () => {

    const [isSmallBreakpoint, setIsSmallBreakpoint] = useState(false);
    const [isYesButtonPressed, setIsYesButtonPressed] = useState(false);
    const [isNoButtonPressed, setIsNoButtonPressed] = useState(false);

    const [values, setValues] = useState({
        temp: '',
        bp: '',
        hr: '',
        rr: '',
        o2sat: '',
        na: '',
        cl: '',
        bun: '',
        k: '',
        hco3: '',
        cr: '',
        glucose: '',
        hgb: '',
        wbc: '',
        plt: '',
        ph: '',
        pco2: '',
        albumin: '',
        ca: '',
        phosphate: ''
    });

    const [conditions, setConditions] = useState({
        anemia: false,
        hypercalcemia: false,
        hyperchloremia: false,
        hyperglycemia: false,
        hyperkalemia: false,
        hypernatremia: false,
        hyperphosphatemia: false,
        hypocalcemia: false,
        hypochloremia: false,
        hypokalemia: false,
        hyponatremia: false,
        hypophosphatemia: false,
        thrombocytopenia: false,
        sepsis: false,
        hypoglycemia: false
    });


    // Stores updated values
    function handleChange(event) {
        let value = event.target.value;
        // Since all inputs have type "number" we don't need to worry
        // about non number inputs aside from an empty string
        if (value.length > 0) {
            value = parseFloat(value);
        }
        setValues({
            ...values,
            [event.target.name]: value
        });
    }

     // Since all of the checks will be run one after the other, we 
    // use the updater function to avoid updates being batched and data
    // lost (see case 3 in this article: https://dev.to/anantbahuguna/3-mistakes-to-avoid-when-updating-react-state-45gp )
    function updateState(conditionName) {
        setConditions((prevState) => {
            return {
                ...prevState,
                [conditionName]: true
            }
        });
    }

    const checkAnemia = () => {
        const { hgb } = values;
        if (hgb.length != 0 && hgb < 12) {
            updateState('anemia');
        }
    }

    const anemia = (
        <Fragment>
            <div className='label'>Anemia</div>
            <div>{`Transfuse for Hg < 7`}</div>
            <div>{`F/U labs: CBC w/ peripheral smear, CMP`}</div>
        </Fragment>
    );

    const correctedCalcium = (ca, albumin) => {
        return ca + .8*(4 - albumin);
    }

    const checkHypocalcemia = () => {
        const {albumin, ca} = values;

        if (ca.length != 0 && albumin.length != 0 && (correctedCalcium(ca, albumin) < 8)) {
            updateState('hypocalcemia');
        }
    }

    const hypocalcemia = (
        <Fragment>
            <div className='label'>Hypocalcemia</div>
            <div>{`IV Ca if Ca < 7.5`}</div>
            <div>{`F/U labs: Mg, K+/BMP, PTH, albumin`}</div>
        </Fragment>
    )

    const checkHyperchloremia = () => {
        const {cl} = values;
        if (cl.length != 0 && cl > 107) {
            updateState('hyperchloremia');
        }
    }

    const hyperchloremia = (
        <Fragment>
            <div className='label'>Hyperchloremia</div>
            <div>{`F/U labs: BMP, albumin, arterial blood gas`}</div>
        </Fragment>
    )

    const checkHyperglycemia = () => {
        const {glucose} = values;
        if (glucose.length != 0 && glucose > 200) {
            updateState('hyperglycemia');
        }
    }

    const hyperglycemia = (
        <Fragment>
            <div className='label'>Hyperglycemia</div>
            <div>{`IV fluids if DKA or HHS`}</div>
            <div>{`IV K if DKA or HHS`}</div>
            <div>{`Insulin if DKA or HHS`}</div>
            <div>{`F/U labs: A1C (if not emergent), BMP, CBC, urinalysis, ABG, ECG`}</div>
        </Fragment>
    )

    const checkHyperkalemia = () => {
        const {k} = values;
        if (k.length != 0 && k > 5) {
            updateState('hyperkalemia');
        }
    }

    const hyperkalemia = (
        <Fragment>
            <div className='label'>Hyperkalemia</div>
            <div>{`IV Ca if K > 6.5`}</div>
            <div>{`IV insulin and glucose if K > 6.5`}</div>
            <div>{`Loop diuretics if K > 6.5`}</div>
            <div>{`Serial ECG`}</div>
            <div>{`F/U labs: Cardiac monitoring/ serial ECG, serial serum glucose, BMP`}</div>
        </Fragment>
    )

    const checkHypernatremia = () => {
        const {na} = values;
        if (na.length != 0 && na > 145) {
            updateState('hypernatremia');
        }
    }

    const hypernatremia = (
        <Fragment>
            <div className='label'>Hypernatremia</div>
            <div>{`IV D5W if Na > 145`}</div>
            <div>{`F/U labs: Serial Na/BMP`}</div>
        </Fragment>
    )

    const checkHyperphosphatemia = () => {
        const { phosphate } = values;
        if (phosphate.length != 0 && phosphate > 4.5) {
            updateState('hyperphosphatemia');
        }
    }

    const hyperphosphatemia = (
        <Fragment>
            <div className='label'>hyperphosphatemia</div>
            <div>{`BMP`}</div>
        </Fragment>
    )

    const checkHypercalcemia = () => {
        const {albumin, ca} = values;

        if (ca.length != 0 && albumin.length != 0 && (correctedCalcium(ca, albumin) > 10.5)) {
            updateState('hypercalcemia');
        }
    }

    const hypercalcemia = (
        <Fragment>
            <div className='label'>Hypercalcemia</div>
            <div>{`IV isotonic saline for Ca > 14`}</div>
            <div>{`F/U labs: Vitamin D, BMP`}</div>
        </Fragment>
    )

    const checkHypochloremia = () => {
        const { cl } = values;
        if (cl.length != 0 && cl < 95) {
            updateState('hypochloremia');
        }
    }

    const hypochloremia = (
        <Fragment>
            <div className='label'>Hypochloremia</div>
            <div>{`BMP`}</div>
        </Fragment>
    )
    
    const checkHypokalemia = () => {
        const { k } = values;
        if (k.length != 0 && k < 3.5) {
            updateState('hypokalemia');
        }
    }

    const hypokalemia = (
        <Fragment>
            <div className='label'>Hypokalemia</div>
            <div>{`Check Mg`}</div>
            <div>{`IV KCI if K < 2.5`}</div>
            <div>{`F/U labs: Serial ECG, BMP`}</div>
        </Fragment>
    )

    const checkHyponatremia = () => {
        const { na } = values;
        if (na.length != 0 && na < 135) {
            updateState('hyponatremia');
        }
    }

    const hyponatremia = (
        <Fragment>
            <div className='label'>Hyponatremia</div>
            <div>{`3% saline if Na < 130`}</div>
            <div>{`F/U labs: Serial BMP/NA+, urine osmality`}</div>
        </Fragment>
    )

    const checkHypophosphatemia = () => {
        const { phosphate } = values;
        if (phosphate.length != 0 && phosphate < 2.5) {
            updateState('hypophosphatemia');
        }
    }

    const hypophosphatemia = (
        <Fragment>
            <div className='label'>Hypophosphatemia</div>
            <div>{`F/U labs: 24hr urine or FEPO4, BMP`}</div>
        </Fragment>
    )

    const checkThrombocytopenia = () => {
        const { plt } = values;
        if (plt.length != 0 && plt < 150000) {
            updateState('thrombocytopenia');
        }
    }

    const thrombocytopenia = (
        <Fragment>
            <div className='label'>Thrombocytopenia</div>
            <div>{`F/U labs: Repeat CBC w/ peripheral blood smear`}</div>
        </Fragment>
    )

    const checkSepsis = () => {
        const { temp, hr, rr, pco2, wbc } = values;
        let trueCount = 0;
        if (temp.length != 0 && (temp < 36 || temp > 38)) {
            trueCount+=1;
        }
        if (hr.length != 0 && hr > 90) {
            trueCount+=1;
        }
        if ((rr.length != 0 && rr > 20) || (pco2.length != 0 && pco2 < 32)) {
            trueCount+=1;
        }
        if (wbc.length != 0 && (wbc > 12000 || wbc < 4000)) {
            trueCount+=1;
        }
        if (trueCount >= 2) {
            updateState('sepsis');
        }
    }

    const sepsis = (
        <Fragment>
            <div className='label'>Sepsis</div>
            <div>{`Antibiotics`}</div>
            <div>{`F/U blood cultures and urine cultures`}</div>
        </Fragment>
    )
    
    const checkHypoglycemia = () => {
        const { glucose } = values;
        if (glucose.length != 0 && glucose < 70) {
            updateState('hypoglycemia');
        }
    }

    const hypoglycemia = (
        <Fragment>
            <div className='label'>Hypoglycemia</div>
            <div>{`Juice`}</div>
            <div>{`IV dextrose`}</div>
        </Fragment>
    )

    const checkAndDisplay = [
        {check: conditions.anemia, display: anemia},
        {check: conditions.hypercalcemia, display: hypercalcemia},
        {check: conditions.hyperchloremia, display: hyperchloremia},
        {check: conditions.hyperglycemia, display: hyperglycemia},
        {check: conditions.hyperkalemia, display: hyperkalemia},
        {check: conditions.hypernatremia, display: hypernatremia},
        {check: conditions.hyperphosphatemia, display: hyperphosphatemia},
        {check: conditions.hypocalcemia, display: hypocalcemia},
        {check: conditions.hypochloremia, display: hypochloremia},
        {check: conditions.hypoglycemia, display: hypoglycemia},
        {check: conditions.hypokalemia, display: hypokalemia},
        {check: conditions.hyponatremia, display: hyponatremia},
        {check: conditions.hypophosphatemia, display: hypophosphatemia},
        {check: conditions.sepsis, display: sepsis},
        {check: conditions.thrombocytopenia, display: thrombocytopenia}
    ];

    const checkConditions = [checkAnemia, checkHypercalcemia, checkHyperchloremia, checkHyperglycemia, checkHyperkalemia, checkHypernatremia, checkHyperphosphatemia, checkHypocalcemia, checkHypochloremia, checkHypoglycemia, checkHypokalemia, checkHyponatremia, checkHypophosphatemia, checkSepsis, checkThrombocytopenia];

    function calculateResults() {
        for (let check of checkConditions) {
            check();
        }
    }

    const planDisplay = (
        checkAndDisplay.map((checkAndDisplay, i) => {
            if (checkAndDisplay.check) {
                return (
                    <div className='diagnosis-container' key={`planItem-${i}`}>
                        {checkAndDisplay.display}
                    </div>
                );
            }
        })
    );

    const handleResize = () => {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const isSmallBreakpoint = windowWidth < 1610;
        setIsSmallBreakpoint(isSmallBreakpoint);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        // Call handler right away so state is updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleInfectionButtons = (infection) => {
        setIsYesButtonPressed(infection);
        setIsNoButtonPressed(!infection);
    };

    const vitalsSubGrid = (
        <Grid columns={5} className={`${isSmallBreakpoint ? 'stack' : ''}`}>
            <div className='label-set'>
                <div className='label'>Temp</div>
                <Input
                    type='number'
                    step='.1'
                    size='mini'
                    className='extra-small-input'
                    name='temp'
                    value={values.temp}
                    onChange={handleChange}
                />
                <div className='normal-range'>Normal 36.1 - 37.2 C</div>
            </div>
            <div className='label-set'>
                <div className='label'>BP</div>
                <Input
                    type='number'
                    size='mini'
                    className='extra-small-input'
                    name='bp'
                    value={values.bp}
                    onChange={handleChange}
                />
                <div className='normal-range'>Normal 120/80 mmHg</div>
            </div>
            <div className='label-set'>
                <div className='label'>HR</div>
                <Input
                    type='number'
                    size='mini'
                    className='extra-small-input'
                    name='hr'
                    value={values.hr}
                    onChange={handleChange}
                />
                <div className='normal-range'>Normal 60 - 100 bpm</div>
            </div>
            <div className='label-set'>
                <div className='label'>RR</div>
                <Input
                    type='number'
                    size='mini'
                    className='extra-small-input'
                    name='rr'
                    value={values.rr}
                    onChange={handleChange}
                />
                <div className='normal-range'>Normal 12 - 20 bpm</div>
            </div>
            <div className='label-set'>
                <div className='label'>O2 Sat</div>
                <Input
                    type='number'
                    size='mini'
                    className='extra-small-input'
                    name='o2sat'
                    value={values.o2sat}
                    onChange={handleChange}
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
                    name='na'
                    value={values.na}
                    onChange={handleChange}
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
                    name='cl'
                    value={values.cl}
                    onChange={handleChange}
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
                    name='bun'
                    value={values.bun}
                    onChange={handleChange}
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
                    name='k'
                    value={values.k}
                    onChange={handleChange}
                />
                <div className='normal-range'>Normal 3.5 - 5 mmol/L</div>
            </div>
        </div>
    );

    const HCO3 = (
        <div className='label-set'>
            <div className='label'>HCO3</div>
            <div className='input-with-label-below'>
                <Input
                    type='number'
                    size='mini'
                    className='extra-small-input'
                    name='hco3'
                    value={values.hco3}
                    onChange={handleChange}
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
                    name='cr'
                    value={values.cr}
                    onChange={handleChange}
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
                    name='glucose'
                    value={values.glucose}
                    onChange={handleChange}
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
                        name='hgb'
                        value={values.hgb}
                        onChange={handleChange}
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
                        name='wbc'
                        value={values.wbc}
                        onChange={handleChange}
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
                        name='plt'
                        value={values.plt}
                        onChange={handleChange}
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
                        name='ph'
                        value={values.ph}
                        onChange={handleChange}
                    />
                    <div className='normal-range'>
                        Normal 7.35 - 7.45
                    </div>
                </div>
            </div>
            <div className='label-set'>
                <div className='label'>PCO2</div>
                <div className='input-with-label-below'>
                    <Input
                        type='number'
                        step='.1'
                        size='mini'
                        className='extra-small-input'
                        name='pco2'
                        value={values.pco2}
                        onChange={handleChange}
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
                        name='albumin'
                        value={values.albumin}
                        onChange={handleChange}
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
                        name='ca'
                        value={values.ca}
                        onChange={handleChange}
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
                        name='phosphate'
                        value={values.phosphate}
                        onChange={handleChange}
                    />
                    <div className='normal-range'>
                        Normal 2.8 - 4.5 mg/dL
                    </div>
                </div>
            </div>
        </Grid>
    );

    const conditionName = '';
    const infectionButtons = (
        <Grid.Row>
            <p>Suspected or present source of infection?</p>
            <ToggleButton
                active={isNoButtonPressed}
                condition={conditionName}
                title='No'
                onToggleButtonClick={() => toggleInfectionButtons(false)}
                className='no-button'>
            </ToggleButton>
            <ToggleButton
                active={isYesButtonPressed}
                condition={conditionName}
                title='Yes'
                onToggleButtonClick={() => toggleInfectionButtons(true)}>
            </ToggleButton>
        </Grid.Row>
    );

    const submitAndClearButtons = (
        <Fragment>
            <Grid.Row className='center calculate-button'>
                <Button type='submit' onClick={calculateResults}>Calculate Results</Button>
            </Grid.Row>
            <Grid.Row className='center'>
                <a role='button' href='#'>Clear data</a>
            </Grid.Row>
        </Fragment>
    );

    const labResults = (
        <Fragment>
            {conditions.anemia && {anemia}}
        </Fragment>
    )

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
                            <Grid.Row centered>
                                <Header as='h2' textAlign ='center'>
                                    Plan Outline
                                </Header>
                            </Grid.Row>
                            <Grid.Row className='subheader'>
                                Fill in the laboratory data on the left,
                                then press &lsquo;Calculate Results&rsquo;
                                to see your results.
                            </Grid.Row>
                            <Grid.Row>
                                { planDisplay }
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        </Fragment>
    );
}

export default GenerateInpatientPlan;
