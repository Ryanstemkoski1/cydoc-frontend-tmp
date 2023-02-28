import AcidTestInputBox from './AcidTestInputBox';
import React from 'react';
import { useState, useEffect } from 'react';
import runAnalysis from './AcidBase/acidBaseCalculator';
import Calculations from './Calculations';
import {
    Accordion,
    Button,
    Container,
    Grid,
    Icon,
    Segment,
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
    const [text, setText] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAccordionClick = () => {
        activeIndex === 0 ? setActiveIndex(1) : setActiveIndex(0);
    };
    const handleClick = () => {
        let acidBaseCalcReturn = runAnalysis(pH, HC, PC, nA, Cl, Albumin);
        let acidTest = acidBaseCalcReturn.acidTest;
        let anionGap = acidBaseCalcReturn.anion;
        setText(acidBaseCalcReturn.acidTest.differentialDiagnoses.text);
        setDescription(
            acidBaseCalcReturn.acidTest.differentialDiagnoses.description
        );

        setAnionString(
            anionGap.calculatedAnionGap +
                '. \n' +
                anionGap.expectedAnionGap +
                '. \n' +
                anionGap.deltaAG +
                '. \n' +
                anionGap.deltaDeltaExp +
                '. \n' +
                anionGap.deltaDelta +
                '. \n' +
                anionGap.deltaHCO3
        );

        setPrimaryExp(acidTest.primaryExp);
        setSecondaryExp(acidTest.secondaryExp);
        acidBaseCalcReturn.summary =
            acidBaseCalcReturn.summary.charAt(0).toUpperCase() +
            acidBaseCalcReturn.summary.slice(1);
        setSummary(acidBaseCalcReturn.summary);
    };

    const formatStringForCopy = () => {
        let str =
            'Summary: \n' +
            summary +
            '\n' +
            'Differential Diagnoses: \n' +
            text +
            '\n' +
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
                <Grid columns={1} textAlign='center'>
                    <br></br>
                    <Grid.Row>
                        <h3
                            className='ui header'
                            style={{
                                color: 'rgba(7,126,157,255)',
                                position: 'absolute',
                            }}
                        >
                            Laboratory Data
                        </h3>
                    </Grid.Row>
                    <br></br>
                    <Grid.Row>
                        <h6
                            className='ui header small'
                            style={{
                                color: 'rgba(130,130,130,255',
                                size: '20px',
                            }}
                        >
                            Please fill in the required fields below
                        </h6>
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onPhChange}
                            label1='pH'
                            label2=''
                            subscript='Normal Range 7.38-7.44'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onHCChange}
                            label1='HCO3+'
                            label2='mEq/L'
                            subscript='Normal Range 23-28 mEq/L'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onPCChange}
                            label1='pCO2'
                            label2='mmHg'
                            subscript='Normal Range 38-42 mmHg'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onNaChange}
                            label1='Na'
                            label2='mEq/L'
                            subscript='Normal Range 126-145 mEq/L'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onClChange}
                            label1='Cl'
                            label2='mEq/L'
                            subscript='Normal Range 98-106 mEq/L'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <AcidTestInputBox
                            callback={onAlbuminChange}
                            label1='Albumin'
                            label2='mEq/L'
                            subscript='Normal Range 3.5 - 5.5 meq/L'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <button
                            className='ui button'
                            onClick={handleClick}
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
                <Grid columns={1} textAlign='center'>
                    <Grid.Row>
                        <h4
                            style={{
                                color: 'rgba(7,126,157,255)',
                            }}
                        >
                            Interpretation
                        </h4>
                    </Grid.Row>
                    <Grid.Row>
                        {primaryExp == '' && (
                            <h6
                                style={{
                                    color: 'rgba(130,130,130,255',
                                    fontSize: '14px',
                                }}
                            >
                                See your results below
                            </h6>
                        )}
                    </Grid.Row>

                    {primaryExp != '' && (
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
                                <Grid.Row>
                                    <DifferentialDiagnoses
                                        text={text}
                                        description={description}
                                    />
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
                    {primaryExp == '' && (
                        <Grid.Row>
                            <h5
                                style={{
                                    color: 'rgba(7,126,157,255)',
                                }}
                            >
                                Please fill in laboratory data to calculate
                                results
                            </h5>
                        </Grid.Row>
                    )}
                    {primaryExp != '' && (
                        <Grid.Row>
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
                <Container className='active-tab-container large-width'>
                    <Segment>
                        <Grid columns={2} divided relaxed stackable>
                            <Grid.Column width={`${!isMobile ? 8 : 11}`}>
                                <div
                                    className='flexParent'
                                    style={{
                                        backgroundColor: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        float: 'left',
                                        textAlign: 'center',
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
                                        float: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        overflowY: 'hidden',
                                        overflowX: 'hidden',
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
