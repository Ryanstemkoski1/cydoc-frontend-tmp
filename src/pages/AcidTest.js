import AcidTestInputBox from './AcidTestInputBox';
import React from 'react';
import { useState } from 'react';
import runAnalysis from './AcidBase/acidBaseCalculator';
import Calculations from './Calculations';
import { Button } from 'semantic-ui-react';
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
                ' ' +
                anionGap.expectedAnionGap +
                ' ' +
                anionGap.deltaAG +
                ' \n' +
                anionGap.deltaDeltaExp +
                ' ' +
                anionGap.deltaDelta +
                ' \n' +
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
    return (
        <>
            <NavMenu
                className='Acid Test'
                attached='top'
                displayNoteName={false}
            />
            <div
                style={{
                    display: 'flex',
                    height: '100vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '42%',
                        height: '94%',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        float: 'left',
                    }}
                >
                    <div
                        className='ui container'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h3
                            className='ui header'
                            style={{
                                color: 'rgba(7,126,157,255)',
                                position: 'absolute',
                                bottom: '70%',
                                marginLeft: '20px',
                            }}
                        >
                            Laboratory Data
                        </h3>
                        <h6
                            className='ui header small'
                            style={{
                                color: 'rgba(130,130,130,255',
                                position: 'absolute',
                                bottom: '65%',
                                marginLeft: '20px',
                                size: '20px',
                            }}
                        >
                            Please fill in the required fields below
                        </h6>
                        <div
                            className='ui container'
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                bottom: '15%',
                            }}
                        >
                            <br></br>
                            <AcidTestInputBox
                                callback={onPhChange}
                                label1='pH'
                                label2=''
                                subscript='Normal Range 7.38-7.44'
                            />
                            <AcidTestInputBox
                                callback={onHCChange}
                                label1='HCO3+'
                                label2='mEq/L'
                                subscript='Normal Range 23-28 mEq/L'
                            />
                            <AcidTestInputBox
                                callback={onPCChange}
                                label1='pCO2'
                                label2='mmHg'
                                subscript='Normal Range 38-42 mmHg'
                            />
                            <AcidTestInputBox
                                callback={onNaChange}
                                label1='Na'
                                label2='mEq/L'
                                subscript='Normal Range 126-145 mEq/L'
                            />
                            <AcidTestInputBox
                                callback={onClChange}
                                label1='Cl'
                                label2='mEq/L'
                                subscript='Normal Range 98-106 mEq/L'
                            />
                            <AcidTestInputBox
                                callback={onAlbuminChange}
                                label1='Albumin'
                                label2='mEq/L'
                                subscript='Normal Range 3.5 - 5.5 meq/L'
                            />
                        </div>
                        <button
                            className='ui button'
                            onClick={handleClick}
                            style={{
                                color: 'white',
                                backgroundColor: 'rgba(7,126,157,255)',
                                bottom: '5%',
                                position: 'absolute',
                            }}
                        >
                            Calculate Results
                        </button>
                    </div>
                </div>
                <div
                    className='acidBaseTest'
                    style={{
                        width: '42%',
                        height: '94%',
                        backgroundColor: '#fff',
                        float: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <h4
                        className='ui header'
                        style={{
                            color: 'rgba(7,126,157,255)',
                            position: 'absolute',
                            bottom: '70%',
                        }}
                    >
                        Interpretation
                    </h4>

                    <h6
                        style={{
                            color: 'rgba(130,130,130,255',
                            position: 'absolute',
                            bottom: '63%',
                            fontSize: '14px',
                        }}
                    >
                        See your results below
                    </h6>

                    {primaryExp != '' && (
                        <>
                            <h4
                                className='acidBaseTest'
                                style={{
                                    color: 'rgba(7,126,157,255)',
                                    marginTop: '5vh',
                                }}
                            >
                                Summary
                            </h4>
                            <span
                                className='acidBaseTest'
                                style={{ color: 'rgba(7,126,157,255)' }}
                            >
                                {summary}
                            </span>
                            <br></br>
                            <div
                                className='acidBaseTest'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    bottom: '0vh',
                                }}
                            >
                                <DifferentialDiagnoses
                                    text={text}
                                    description={description}
                                />
                                <br></br>
                                <Calculations
                                    style={{ marginTop: '5px' }}
                                    PrimaryDisorder={primaryExp}
                                    SecondaryDisorder={secondaryExp}
                                    AnionGap={anionString}
                                />
                            </div>
                        </>
                    )}
                    {primaryExp == '' && (
                        <h5
                            style={{
                                color: 'rgba(7,126,157,255)',
                                bottom: '40%',
                                position: 'absolute',
                            }}
                        >
                            Please fill in laboratory data to calculate results
                        </h5>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            position: 'absolute',
                            bottom: '5%',
                        }}
                    >
                        <Button
                            className='ui button'
                            onClick={handleCopyResultsClick}
                            style={{
                                color: 'black',
                                backgroundColor: 'gold',
                                marginTop: '40px',
                            }}
                        >
                            Copy Results
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AcidTest;
