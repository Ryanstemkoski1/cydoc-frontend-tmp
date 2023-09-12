import React, { useCallback, useState } from 'react';
import { Accordion } from 'semantic-ui-react';
import runAnalysis from './AcidBase/acidBaseCalculator';
import style from './AcidTest.module.scss';
import AcidTestInputBox from './AcidTestInputBox';
import Calculations from './Calculations';
import DifferentialDiagnoses from './DifferentialDiagnoses';

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
    const [arr, setArray] = useState([]);
    const [copyStatus, setCopyStatus] = useState('not copied');

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
    }, [pH, HC, PC, nA, Cl, Albumin, description]);

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
                        setCopyStatus('copied');
                    },
                    (err) => {
                        setCopyStatus('Error writing to clipboard' + err);
                    }
                );
        } else {
            setCopyStatus('Clipboard API not supported');
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
                <h2>Laboratory Data</h2>

                <p>Please fill in the required fields below</p>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onPhChange}
                        label1='pH'
                        subscript='Normal Range 7.35-7.45'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onHCChange}
                        label1='HCO3+'
                        subscript='Normal Range 21-30 mEq/L'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onPCChange}
                        label1='pCO2'
                        subscript='Normal Range 35-45 mmHg'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onNaChange}
                        label1='Na'
                        subscript='Normal Range 135-145 mEq/L'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onClChange}
                        label1='Cl'
                        subscript='Normal Range 98-108 mEq/L'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <div className={style.acidPage__input}>
                    <AcidTestInputBox
                        callback={onAlbuminChange}
                        label1='Albumin'
                        subscript='Normal Range 3.5 - 4.8 meq/L'
                        onKeyPress={onKeyPress}
                    />
                </div>
                <button
                    className='button pill'
                    onClick={handleClick}
                    type='submit'
                >
                    Calculate Results
                </button>
            </>
        );
    };

    const summarySubSection = () => {
        return (
            <>
                <h2>Interpretation</h2>
                {description == '' && (
                    <p>
                        Fill in the laboratory data on the left, then press
                        &lsquo;Calculate Results&rsquo; to see your results.
                    </p>
                )}
                {description != '' && (
                    <>
                        <Accordion className='accordion-ui'>
                            <Accordion.Title
                                active={activeIndex === 1}
                                onClick={handleAccordionClick}
                            >
                                Summary
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                {summary}
                            </Accordion.Content>
                        </Accordion>

                        <DifferentialDiagnoses description={arr} />
                        <Calculations
                            PrimaryDisorder={primaryExp}
                            SecondaryDisorder={secondaryExp}
                            AnionGap={anionString}
                        />
                    </>
                )}
                <div className={style.acidPage__bottom}>
                    {summary.length != '' && (
                        <button
                            className='button pill'
                            onClick={handleCopyResultsClick}
                        >
                            {copyStatus == 'copied'
                                ? 'Copied!'
                                : 'Copy Results'}
                        </button>
                    )}
                    {copyStatus != 'copied' && copyStatus != 'not copied' && (
                        <p>{copyStatus}</p>
                    )}
                </div>
            </>
        );
    };

    const acidTest = () => {
        return (
            <>
                <div className='centering'>
                    <div className={`${style.acidPage} flex-wrap`}>
                        <div className={style.acidPage__col}>
                            {acidBaseSubsection()}
                        </div>

                        <div className={style.acidPage__col}>
                            {summarySubSection()}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return acidTest();
};

export default AcidTest;
