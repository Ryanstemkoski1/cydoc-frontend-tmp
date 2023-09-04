import React, { Fragment, useState } from 'react';
import {
    Button,
    Container,
    Grid,
    Header,
    Input,
    Segment,
} from 'semantic-ui-react';

import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import {
    initialConditionsState,
    initialValuesState,
} from 'constants/generateInpatientPlan';
import './GenerateInpatientPlan.css';

const GenerateInpatientPlan = () => {
    // State for the Y/N infection toggle buttons
    const [isYesInfectionPressed, setIsYesInfectionPressed] = useState(false);
    const [isNoInfectionPressed, setIsNoInfectionPressed] = useState(false);

    // Values tracks each input value
    const [values, setValues] = useState(initialValuesState);

    // Tracks which conditions the patient has
    const [conditions, setConditions] = useState(initialConditionsState);

    /*************************************************************************
     * This section of code contains all the check functions for each condition
     * and the plan text to render for each condition.
     *************************************************************************/
    // Updates the conditions state array when 'Calculate Results' is pressed
    function setCondition(conditionName, conditionStatus) {
        setConditions((prevState) => {
            return {
                ...prevState,
                [conditionName]: conditionStatus,
            };
        });
    }

    const checkAnemia = () => {
        const { hgb } = values;
        const hasCondition = hgb.length != 0 && hgb < 12;
        setCondition('anemia', hasCondition);
    };

    const anemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Anemia
            </div>
            <div>{`Transfuse for Hg < 7`}</div>
            <div>{`F/U labs: CBC w/ peripheral smear, CMP`}</div>
        </Fragment>
    );

    const correctedCalcium = (ca, albumin) => {
        return ca + 0.8 * (4 - albumin);
    };

    const checkHypocalcemia = () => {
        const { albumin, ca } = values;
        const hasCondition =
            ca.length != 0 &&
            albumin.length != 0 &&
            correctedCalcium(ca, albumin) < 8;
        setCondition('hypocalcemia', hasCondition);
    };

    const hypocalcemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypocalcemia
            </div>
            <div>{`IV Ca if Ca < 7.5`}</div>
            <div>{`F/U labs: Mg, K+/BMP, PTH, albumin`}</div>
        </Fragment>
    );

    const checkHyperchloremia = () => {
        const { cl } = values;
        const hasCondition = cl.length != 0 && cl > 107;
        setCondition('hyperchloremia', hasCondition);
    };

    const hyperchloremia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hyperchloremia
            </div>
            <div>{`F/U labs: BMP, albumin, arterial blood gas`}</div>
        </Fragment>
    );

    const checkHyperglycemia = () => {
        const { glucose } = values;
        const hasCondition = glucose.length != 0 && glucose > 200;
        setCondition('hyperglycemia', hasCondition);
    };

    const hyperglycemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hyperglycemia
            </div>
            <div>{`IV fluids if DKA or HHS`}</div>
            <div>{`IV K if DKA or HHS`}</div>
            <div>{`Insulin if DKA or HHS`}</div>
            <div>{`F/U labs: A1C (if not emergent), BMP, CBC, urinalysis, ABG, ECG`}</div>
        </Fragment>
    );

    const checkHyperkalemia = () => {
        const { k } = values;
        const hasCondition = k.length != 0 && k > 5;
        setCondition('hyperkalemia', hasCondition);
    };

    const hyperkalemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hyperkalemia
            </div>
            <div>{`IV Ca if K > 6.5`}</div>
            <div>{`IV insulin and glucose if K > 6.5`}</div>
            <div>{`Loop diuretics if K > 6.5`}</div>
            <div>{`Serial ECG`}</div>
            <div>{`F/U labs: Cardiac monitoring/ serial ECG, serial serum glucose, BMP`}</div>
        </Fragment>
    );

    const checkHypernatremia = () => {
        const { na } = values;
        const hasCondition = na.length != 0 && na > 145;
        setCondition('hypernatremia', hasCondition);
    };

    const hypernatremia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypernatremia
            </div>
            <div>{`IV D5W if Na > 145`}</div>
            <div>{`F/U labs: Serial Na/BMP`}</div>
        </Fragment>
    );

    const checkHyperphosphatemia = () => {
        const { phosphate } = values;
        const hasCondition = phosphate.length != 0 && phosphate > 4.5;
        setCondition('hyperphosphatemia', hasCondition);
    };

    const hyperphosphatemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hyperphosphatemia
            </div>
            <div>{`BMP`}</div>
        </Fragment>
    );

    const checkHypercalcemia = () => {
        const { albumin, ca } = values;

        const hasCondition =
            ca.length != 0 &&
            albumin.length != 0 &&
            correctedCalcium(ca, albumin) > 10.5;
        setCondition('hypercalcemia', hasCondition);
    };

    const hypercalcemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypercalcemia
            </div>
            <div>{`IV isotonic saline for Ca > 14`}</div>
            <div>{`F/U labs: Vitamin D, BMP`}</div>
        </Fragment>
    );

    const checkHypochloremia = () => {
        const { cl } = values;
        const hasCondition = cl.length != 0 && cl < 95;
        setCondition('hypochloremia', hasCondition);
    };

    const hypochloremia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypochloremia
            </div>
            <div>{`BMP`}</div>
        </Fragment>
    );

    const checkHypokalemia = () => {
        const { k } = values;
        const hasCondition = k.length != 0 && k < 3.5;
        setCondition('hypokalemia', hasCondition);
    };

    const hypokalemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypokalemia
            </div>
            <div>{`Check Mg`}</div>
            <div>{`IV KCI if K < 2.5`}</div>
            <div>{`F/U labs: Serial ECG, BMP`}</div>
        </Fragment>
    );

    const checkHyponatremia = () => {
        const { na } = values;
        const hasCondition = na.length != 0 && na < 135;
        setCondition('hyponatremia', hasCondition);
    };

    const hyponatremia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hyponatremia
            </div>
            <div>{`3% saline if Na < 130`}</div>
            <div>{`F/U labs: Serial BMP/NA+, urine osmality`}</div>
        </Fragment>
    );

    const checkHypophosphatemia = () => {
        const { phosphate } = values;
        const hasCondition = phosphate.length != 0 && phosphate < 2.5;
        setCondition('hypophosphatemia', hasCondition);
    };

    const hypophosphatemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypophosphatemia
            </div>
            <div>{`F/U labs: 24hr urine or FEPO4, BMP`}</div>
        </Fragment>
    );

    const checkThrombocytopenia = () => {
        const { plt } = values;
        let hasCondition = false;
        if (plt.length != 0) {
            // Plt is entered x10^9, convert for correct comparison
            const actualCount = plt * 1000000000;
            hasCondition = actualCount < 150000;
        }
        setCondition('thrombocytopenia', hasCondition);
    };

    const thrombocytopenia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Thrombocytopenia
            </div>
            <div>{`F/U labs: Repeat CBC w/ peripheral blood smear`}</div>
        </Fragment>
    );

    const checkSepsis = () => {
        const { temp, hr, rr, pco2, wbc } = values;
        let trueCount = 0;
        if (temp.length != 0 && (temp < 36 || temp > 38)) {
            trueCount += 1;
        }
        if (hr.length != 0 && hr > 90) {
            trueCount += 1;
        }
        if ((rr.length != 0 && rr > 20) || (pco2.length != 0 && pco2 < 32)) {
            trueCount += 1;
        }
        if (wbc.length != 0) {
            // WBC is entered with units X10^9 so we convert it
            // before making the comparison
            const actualCount = wbc * 1000000000;
            if (actualCount > 12000 || wbc < 4000) {
                trueCount += 1;
            }
        }
        if (trueCount >= 2 && isYesInfectionPressed) {
            setCondition('sepsis', true);
        } else {
            setCondition('sepsis', false);
        }
    };

    const sepsis = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Sepsis
            </div>
            <div>{`Antibiotics`}</div>
            <div>{`F/U blood cultures and urine cultures`}</div>
        </Fragment>
    );

    const checkHypoglycemia = () => {
        const { glucose } = values;
        const hasCondition = glucose.length != 0 && glucose < 70;
        setCondition('hypoglycemia', hasCondition);
    };

    const hypoglycemia = (
        <Fragment>
            <div data-clipboard-header='1' className='label'>
                Hypoglycemia
            </div>
            <div>{`Juice`}</div>
            <div>{`IV dextrose`}</div>
        </Fragment>
    );

    /******************************************************************************
     * Submit button & displaying plan
     *****************************************************************************/

    const checkAndDisplay = [
        { check: conditions.anemia, display: anemia },
        { check: conditions.hypercalcemia, display: hypercalcemia },
        { check: conditions.hyperchloremia, display: hyperchloremia },
        { check: conditions.hyperglycemia, display: hyperglycemia },
        { check: conditions.hyperkalemia, display: hyperkalemia },
        { check: conditions.hypernatremia, display: hypernatremia },
        { check: conditions.hyperphosphatemia, display: hyperphosphatemia },
        { check: conditions.hypocalcemia, display: hypocalcemia },
        { check: conditions.hypochloremia, display: hypochloremia },
        { check: conditions.hypoglycemia, display: hypoglycemia },
        { check: conditions.hypokalemia, display: hypokalemia },
        { check: conditions.hyponatremia, display: hyponatremia },
        { check: conditions.hypophosphatemia, display: hypophosphatemia },
        { check: conditions.sepsis, display: sepsis },
        { check: conditions.thrombocytopenia, display: thrombocytopenia },
    ];

    const checkConditions = [
        checkAnemia,
        checkHypercalcemia,
        checkHyperchloremia,
        checkHyperglycemia,
        checkHyperkalemia,
        checkHypernatremia,
        checkHyperphosphatemia,
        checkHypocalcemia,
        checkHypochloremia,
        checkHypoglycemia,
        checkHypokalemia,
        checkHyponatremia,
        checkHypophosphatemia,
        checkSepsis,
        checkThrombocytopenia,
    ];

    function calculateResults() {
        for (let check of checkConditions) {
            check();
        }
    }

    function checkHasResults() {
        let hasResults = false;
        Object.values(conditions).map((val) => {
            if (val) {
                hasResults = true;
            }
        });
        return hasResults;
    }

    const planDisplay = checkAndDisplay.map((checkAndDisplay, i) => {
        if (checkAndDisplay.check) {
            return (
                <div className='diagnosis-container' key={`planItem-${i}`}>
                    {checkAndDisplay.display}
                </div>
            );
        }
    });

    const submitButton = (
        <Grid.Row className='center calculate-button'>
            <Button type='submit' onClick={calculateResults}>
                Calculate Results
            </Button>
        </Grid.Row>
    );

    /*************************************************************************
     * Infection buttons
     ************************************************************************/
    const toggleInfectionButtons = (infection) => {
        setIsYesInfectionPressed(infection);
        setIsNoInfectionPressed(!infection);
    };

    // The ToggleButton requires a 'conditionName' variable
    const conditionName = '';
    const infectionButtons = (
        <Grid.Row>
            <p>Suspected or present source of infection?</p>
            <ToggleButton
                active={isNoInfectionPressed}
                condition={conditionName}
                title='No'
                onToggleButtonClick={() => toggleInfectionButtons(false)}
                className='no-button'
            ></ToggleButton>
            <ToggleButton
                active={isYesInfectionPressed}
                condition={conditionName}
                title='Yes'
                onToggleButtonClick={() => toggleInfectionButtons(true)}
            ></ToggleButton>
        </Grid.Row>
    );

    /*************************************************************************
     * Clear and copy buttons
     *************************************************************************/
    const clearButton = (
        <Grid.Row className='center'>
            <a role='button' href='#' onClick={clearResults}>
                Clear data
            </a>
        </Grid.Row>
    );

    function clearResults() {
        setConditions(initialConditionsState);
        setValues(initialValuesState);
    }

    const copyButton = (
        <Grid.Row className='center copy-button'>
            <Button color='yellow' onClick={copyResults}>
                Copy Plan
            </Button>
        </Grid.Row>
    );

    function copyResults() {
        const note = document.querySelectorAll('.diagnosis-container > *');
        let text = '';
        for (let i = 0; i < note.length; i++) {
            if (
                Object.prototype.hasOwnProperty.call(
                    note[i].dataset,
                    'clipboardHeader'
                )
            ) {
                text += '\n';
            }
            text += `${note[i].innerText}\r\n`;
        }
        navigator.clipboard.writeText(text);
    }

    /*************************************************************************
     * All grids shown in 'Laboratory Data' section, and code to update
     * <input> controls
     ************************************************************************/

    function handleInputChange(event) {
        let value = event.target.value;

        // Since all inputs other than blood pressure have type 'number', we
        // should parse them into floats for ease of use.
        if (event.target.name !== 'bp' && value.length > 0) {
            value = parseFloat(value);
        }

        setValues({
            ...values,
            [event.target.name]: value,
        });
    }

    const vitalsSubGrid = (
        <Grid columns={5}>
            <div className='label-set'>
                <div className='label'>Temp</div>
                <Input
                    type='number'
                    step='.1'
                    size='mini'
                    className='extra-small-input'
                    name='temp'
                    value={values.temp}
                    onChange={handleInputChange}
                />
                <div className='normal-range'>Normal 36.1 - 37.2 C</div>
            </div>
            <div className='label-set'>
                <div className='label'>BP</div>
                <Input
                    type='text'
                    size='mini'
                    className='extra-small-input'
                    name='bp'
                    value={values.bp}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                />
                <div className='normal-range'>Normal 98 - 100%</div>
            </div>
        </Grid>
    );

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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
    const BMPSubGrid = (
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
        <Grid columns={5}>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 12 - 15.5 g/dL</div>
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>
                        Normal 150 - 450 x10<sup>9</sup>/L
                    </div>
                </div>
            </div>
        </Grid>
    );

    const otherSubGrid = (
        <Grid columns={5}>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 7.35 - 7.45</div>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 35 - 45</div>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 3.5 - 4.8 g/dL</div>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 8.7 - 10.2 mg/dL</div>
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
                        onChange={handleInputChange}
                    />
                    <div className='normal-range'>Normal 2.8 - 4.5 mg/dL</div>
                </div>
            </div>
        </Grid>
    );

    /*************************************************************************
     * The full layout
     ************************************************************************/
    return (
        <Fragment>
            <Container className='active-tab-container large-width'>
                <Segment>
                    <Grid columns={2} divided relaxed stackable>
                        <Grid.Column width={11}>
                            <Grid.Row centered>
                                <Header as='h2' textAlign='center'>
                                    Laboratory Data
                                </Header>
                            </Grid.Row>
                            <Grid.Row className='subheader'>
                                All values are optional. Including more values
                                yields a more detailed plan.
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
                            {submitButton}
                            {clearButton}
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Grid.Row centered>
                                <Header as='h2' textAlign='center'>
                                    Plan Outline
                                </Header>
                            </Grid.Row>
                            <Grid.Row className='subheader'>
                                Fill in the laboratory data on the left, then
                                press &lsquo;Calculate Results&rsquo; to see
                                your results.
                            </Grid.Row>
                            <Grid.Row>{planDisplay}</Grid.Row>
                            {checkHasResults() && copyButton}
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        </Fragment>
    );
};

export default GenerateInpatientPlan;
