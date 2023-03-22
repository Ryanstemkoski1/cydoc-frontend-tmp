import AcidTestInputBox from './AcidTestInputBox';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import runAnalysis from './AcidBase/acidBaseCalculator';
import Calculations from './Calculations';
import {
    Accordion,
    Button,
    Container,
    Grid,
    Icon,
    Segment,
    Header,
} from 'semantic-ui-react';
import DifferentialDiagnoses from './DifferentialDiagnoses';
import NavMenu from './../components/navigation/NavMenu';

const AcidTest = () => {
    const [pH, setPH] = useState(0);
    const [HC, setHC] = useState(0);
    const [PC, setPC] = useState(0);
    const [nA, setNA] = useState(0);
    const [Cl, setCl] = useState(0);
    const [Albumin, setAlbumin] = useState(0);
    const [primaryExp, setPrimaryExp] = useState('');
    const [secondaryExp, setSecondaryExp] = useState('');
    const [anionString, setAnionString] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [activeIndex, setActiveIndex] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [arr, setArray] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [pH, HC, PC, nA, Cl, Albumin]);

    const handleAccordionClick = () => {
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);
    };
    const handleClick = useCallback(() => {
        let acidBaseCalcReturn, acidTestResults, anionGap;
        acidBaseCalcReturn = runAnalysis(pH, HC, PC, nA, Cl, Albumin);
        setArray(acidBaseCalcReturn.acidTest.differentialDiagnoses.description);
        acidTestResults = acidBaseCalcReturn.acidTest;
        anionGap = acidBaseCalcReturn.anion;

        acidBaseCalcReturn.acidTest.differentialDiagnoses.description.forEach(
            (str) => {
                setDescription(description + str);
            }
        );

        setAnionString(
            anionGap.calculatedAnionGap +
                anionGap.expectedAnionGap +
                anionGap.deltaAG +
                '\n' +
                anionGap.deltaDeltaExp +
                '\n' +
                anionGap.deltaDelta +
                '\n' +
                anionGap.deltaHCO3
        );
        setPrimaryExp(acidTestResults.primaryExp);
        setSecondaryExp(acidTestResults.secondaryExp);
        acidBaseCalcReturn.summary =
            acidBaseCalcReturn.summary.charAt(0).toUpperCase() +
            acidBaseCalcReturn.summary.slice(1);
        setSummary(acidBaseCalcReturn.summary);
        // Reset the state variables to their initial values
    }, [pH, HC, PC, nA, Cl, Albumin]);

    const formatStringForCopy = () => {
        let str =
            'Summary: \n' +
            summary +
            '\n' +
            'Differential Diagnoses: \n' +
            description +
            '\n Calculations: \n' +
            'Primary Disorder: ' +
            primaryExp +
            '\nSecondary Disorder: ' +
            secondaryExp +
            '\nAnion Gap: ' +
            anionString;
        return str;
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleClick();
        }
    };

    // todo: get CopyResultsClick to work as intended
    const handleCopyResultsClick = () => {
        const blob = new Blob([formatStringForCopy()], { type: 'text/plain' });

        // check if the Clipboard API is supported
        if (navigator.clipboard && navigator.clipboard.write) {
            navigator.clipboard
                .write([
                    new window.ClipboardItem({
                        [blob.type]: blob,
                    }),
                ])
                .then(
                    () => {
                        alert('Successfully copied Acid-Base test');
                    },
                    (err) => {
                        alert('Error writing to clipboard' + err);
                    }
                );
        } else {
            alert('Clipboard API not supported');
        }
    };

    const onPhChange = (number) => {
        setPH(number);
    };
    const onHCChange = (number) => {
        setHC(number);
    };
    const onPCChange = (number) => {
        setPC(number);
    };
    const onNaChange = (number) => {
        setNA(number);
    };
    const onClChange = (number) => {
        setCl(number);
    };
    const onAlbuminChange = (number) => {
        setAlbumin(number);
    };

    const acidBaseSubsection = () => {
        return (
            <>
                <Grid
                    columns={1}
                    display='flex'
                    justifyContent='center'
                    flexDirection='column'
                >
                    <br></br>
                    <Grid.Row centered>
                        <Header
                            as='h2'
                            textAlign='center'
                            color='rgba(7, 126, 157, 255)'
                        >
                            Laboratory Data
                        </Header>
                    </Grid.Row>
                    <Grid.Row
                        className='subheader'
                        color='rgba(130,130,130,255)'
                    >
                        Please fill in the required fields below
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onPhChange}
                            label1='pH'
                            subscript='Normal Range 7.35-7.45'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onHCChange}
                            label1='HCO3+'
                            subscript='Normal Range 21-30 mEq/L'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onPCChange}
                            label1='pCO2'
                            subscript='Normal Range 35-45 mmHg'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onNaChange}
                            label1='Na'
                            subscript='Normal Range 135-145 mEq/L'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onClChange}
                            label1='Cl'
                            subscript='Normal Range 98-108 mEq/L'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onAlbuminChange}
                            label1='Albumin'
                            subscript='Normal Range 3.5 - 4.8 meq/L'
                            onKeyPress={onKeyPress}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <button
                            className='ui button'
                            onClick={handleClick}
                            type='submit'
                            style={{
                                color: 'white',
                                backgroundColor: 'rgba(7,126,157,255)',
                            }}
                        >
                            Calculate Results
                        </button>
                    </Grid.Row>
                </Grid>
            </>
        );
    };

    const summarySubSection = () => {
        return (
            <>
                <Grid columns={1}>
                    <Grid.Row centered>
                        <Header
                            as='h2'
                            textAlign='center'
                            color='rgba(7, 126, 157, 255)'
                        >
                            Interpretation
                        </Header>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        {description == '' && (
                            <div className='row center subheader'>
                                Fill in the laboratory data on the left, then
                                press &lsquo;Calculate Results&rsquo; to see
                                your results.
                            </div>
                        )}
                    </Grid.Row>

                    {description != '' && (
                        <>
                            <br></br>
                            <div
                                className='acidBaseTest'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    bottom: '0vh',
                                    marginLeft: '5px',
                                }}
                            >
                                <Grid.Row>
                                    <Accordion style={{ textAlign: 'start' }}>
                                        <Accordion.Title
                                            active={activeIndex === 1}
                                            style={{
                                                color: 'rgba(7,126,157,255)',
                                                fontWeight: 'bold',
                                            }}
                                            onClick={handleAccordionClick}
                                        >
                                            <Icon name='dropdown' />
                                            Summary
                                        </Accordion.Title>
                                        <Accordion.Content
                                            active={activeIndex === 1}
                                            style={{
                                                color: 'rgba(7,126,157,255)',
                                            }}
                                        >
                                            {summary}
                                        </Accordion.Content>
                                    </Accordion>
                                </Grid.Row>
                                <br></br>
                                <Grid.Row className='css-fix'>
                                    <DifferentialDiagnoses description={arr} />
                                </Grid.Row>
                                <br></br>
                                <Grid.Row>
                                    <Calculations
                                        style={{ marginTop: '5px' }}
                                        PrimaryDisorder={primaryExp}
                                        SecondaryDisorder={secondaryExp}
                                        AnionGap={anionString}
                                    />
                                </Grid.Row>
                            </div>
                        </>
                    )}
                    {primaryExp != '' && (
                        <Grid.Row centered>
                            <Button
                                className='ui button'
                                onClick={handleCopyResultsClick}
                                style={{
                                    marginTop: '5px',
                                    color: 'black',
                                    backgroundColor: 'gold',
                                }}
                            >
                                Copy Results
                            </Button>
                        </Grid.Row>
                    )}
                </Grid>
            </>
        );
    };

    const acidTest = () => {
        return (
            <>
                <NavMenu
                    className='Acid Test'
                    attached='top'
                    displayNoteName={false}
                />
                <Container
                    className='active-tab-container large-width'
                    style={{ width: '90%' }}
                >
                    <Segment>
                        <Grid columns={2} divided relaxed stackable>
                            <Grid.Column
                                alignItems='center'
                                justifyContent='center'
                                width={`${!isMobile ? 8 : 11}`}
                            >
                                <div
                                    className='flexParent'
                                    style={{
                                        backgroundColor: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {acidBaseSubsection()}
                                </div>
                            </Grid.Column>
                            <Grid.Column width={`${!isMobile ? 8 : 11}`}>
                                <div
                                    className='acidBaseTest flexParent'
                                    style={{
                                        backgroundColor: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {summarySubSection()}
                                </div>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Container>
            </>
        );
    };

    return acidTest();
};

export default AcidTest;
