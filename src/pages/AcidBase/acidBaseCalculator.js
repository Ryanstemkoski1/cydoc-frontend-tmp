

/**
 * The function simpleAcidBase describes acid base disorders for which the pH
 * is abnormal: either < 7.35 or > 7.45. This function does NOT produce any 
 * output for a normal pH in the range 7.35 <= pH <= 7.45. 
 * For pH < 7.35, this function produces detailed output and compensation 
 * calculations if HCO3 < 22 or PCO2 > 45, but does not do any compensation
 * calculations if HCO3 is higher or PCO2 is lower than those values.
 * For pH > 7.45, this function produces detailed output and compensation
 * calculations if HCO3 > 28 or PCO2 < 33, but does not do any compensation
 * calculations if HCO3 is lower or PCO2 is higher than those values.
 */
 function simpleAcidBase(pH, HCO3, PCO2) {
    var primary = "";
    var secondary = ""; // for metabolic or acute respiratory process
    var secondary_chronic = ""; // for chronic respiratory process

    if (pH < 7.35) {
        console.log("pH of "+pH.toString()+" is < 7.35. Acidemia: primary disorder is acidosis.");

        if (HCO3 < 22) {
            // Metabolic acidosis
            console.log("HCO3 of "+HCO3.toString()+" is < 22 so there is a metabolic acidosis.");
            primary = "metabolic acidosis";

            // Calculate expected compensation for metabolic acidosis
            mtAcidPCO2ExpLow = (1.5*HCO3) + 8 - 2;
            mtAcidPCO2ExpHigh = (1.5*HCO3) + 8 + 2;
            console.log("For primary metabolic acidosis, expected PCO2 is (1.5*HCO3) + 8 +/- 2 = "+mtAcidPCO2ExpLow.toString()+" to "+mtAcidPCO2ExpHigh.toString());

            if (PCO2 < mtAcidPCO2ExpLow) {
                console.log("PCO2 of "+PCO2.toString()+" is < expected PCO2 lower bound of "+mtAcidPCO2ExpLow.toString()+" so there is an additional respiratory alkalosis.");
                secondary = "respiratory alkalosis";
            } else if (PCO2 > mtAcidPCO2ExpHigh) {
                console.log("PCO2 of "+PCO2.toString()+" is > expected PCO2 upper bound of "+mtAcidPCO2ExpHigh.toString()+" so there is an additional respiratory acidosis.");
                secondary = "respiratory acidosis";
            } else {
                console.log("PCO2 of "+PCO2.toString()+" is within the expected range of "+mtAcidPCO2ExpLow.toString()+" to "+mtAcidPCO2ExpHigh.toString()+" so there is adequate respiratory compensation.");
                secondary = "adequate respiratory compensation";
            }
        }
      
        if (PCO2 > 45) {
            // Respiratory acidosis
            console.log("PCO2 of "+PCO2.toString()+" is > 45 so there is a respiratory acidosis.");
            primary = "respiratory acidosis";

            // Calculate expected compensation for acute respiratory acidosis
            rsAcidHCO3ExpAcute = 24 + (0.1*(PCO2 - 40));
            console.log("For acute respiratory acidosis, expected HCO3 is 24 + (0.1*(PCO2-40)) = "+rsAcidHCO3ExpAcute.toString());
        
            if (HCO3 < rsAcidHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is an additional metabolic acidosis.");
                secondary = "metabolic acidosis";
            } else if (HCO3 > rsAcidHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is an additional metabolic alkalosis.")
                secondary = "metabolic alkalosis";
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is adequate metabolic compensation.");
                secondary = "adequate metabolic compensation";
            }

            // Calculate expected compensation for chronic respiratory acidosis
            rsAcidHCO3ExpChronic = 24 + (0.35*(PCO2 - 40));
            console.log("For chronic respiratory acidosis, expected HCO3 is 24 + (0.35*(PCO2-40)) = "+rsAcidHCO3ExpChronic.toString());

            if (HCO3 < rsAcidHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is an additional metabolic acidosis.");
                secondary_chronic = "metabolic acidosis";
            } else if (HCO3 > rsAcidHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is an additional metabolic alkalosis.");
                secondary_chronic = "metabolic alkalosis";
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is adequate metabolic compensation.");
                secondary_chronic = "adequate metabolic compensation";
            }
        }
    } else if (pH > 7.45) {
        console.log("pH of "+pH.toString()+" is > 7.45. Alkalemia: primary disorder is alkalosis.");

        if (HCO3 > 28) {
            // Metabolic alkalosis
            console.log("HCO3 of "+HCO3.toString()+" is > 28 so there is a metabolic alkalosis.");
            primary = "metabolic alkalosis";

            // Calculate expected compensation for metabolic alkalosis
            mtAlkPCO2ExpLow = (0.7*(HCO3 - 24)) + 40 - 2;
            mtAlkPCO2ExpHigh = (0.7*(HCO3 - 24)) + 40 + 2;
            console.log("For primary metabolic alkalosis, expected PCO2 is (0.7*(HCO3-24)) + 40 +/- 2 = "+mtAlkPCO2ExpLow.toString()+" to "+mtAlkPCO2ExpHigh.toString());

            if (PCO2 < mtAlkPCO2ExpLow) {
                console.log("PCO2 of "+PCO2.toString()+" is < expected PCO2 lower bound of "+mtAlkPCO2ExpLow.toString()+" so there is an additional respiratory alkalosis.");
                secondary = "respiratory alkalosis";
            } else if (PCO2 > mtAlkPCO2ExpHigh) {
                console.log("PCO2 of "+PCO2.toString()+" is > expected PCO2 upper bound of "+mtAlkPCO2ExpHigh.toString()+" so there is an additional respiratory acidosis.");
                secondary = "respiratory acidosis";
            } else {
                console.log("PCO2 of "+PCO2.toString()+" is within the expected range of "+mtAlkPCO2ExpLow.toString()+" to "+mtAlkPCO2ExpHigh.toString()+" so there is adequate respiratory compensation.");
                secondary = "adequate respiratory compensation";
            }
        }

        if (PCO2 < 33) {
            // Respiratory alkalosis
            console.log("PCO2 of "+PCO2.toString()+" is < 33 so there is a respiratory alkalosis.");
            primary = "respiratory alkalosis";

            // Calculate expected compensation for acute respiratory alkalosis
            rsAlkHCO3ExpAcute = 24 - (0.2*(40 - PCO2));
            console.log("For acute respiratory alkalosis, expected HCO3 is 24 - (0.2*(40-PCO2)) = "+rsAlkHCO3ExpAcute.toString());

            if (HCO3 < rsAlkHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is an additional metabolic acidosis.");
                secondary = "metabolic acidosis";
            } else if (HCO3 > rsAlkHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is an additional metabolic alkalosis.");
                secondary = "metabolic alkalosis";
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is adequate metabolic compensation.");
                secondary = "adequate metabolic compensation";
            }

            // Calculate expected compensation for chronic respiratory alkalosis
            rsAlkHCO3ExpChronic = 24 - (0.4*(40 - PCO2));
            console.log("For chronic respiratory alkalosis, expected HCO3 is 24 - (0.4*(40-PCO2)) = "+rsAlkHCO3ExpChronic.toString());

            if (HCO3 < rsAlkHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is an additional metabolic acidosis.");
                secondary_chronic = "metabolic acidosis";
            } else if (HCO3 > rsAlkHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is an additional metabolic alkalosis.");
                secondary_chronic = "metabolic alkalosis";
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is adequate metabolic compensation.");
                secondary_chronic = "adequate metabolic compensation";
            }
        }
    }
    return [primary, secondary, secondary_chronic];
}

/**
 * The function anionGapWithDeltas calculates the anion gap, the 
 * delta-delta (delta ratio) and the delta gap.
 */
function anionGapWithDeltas(Na, Cl, HCO3, albumin) {
    // Since albumin has a default value of 4.8 specify if this value is being
    // used (if the user did not specify the albumin we need to tell them the
    // default value that was used.)
    if (albumin == 4.8) {
        console.log("Using albumin of "+albumin.toString());
    }
    
    var gapSummary = "";

    calculatedAnionGap = Na - Cl - HCO3;
    console.log("Calculated anion gap = Na "+Na.toString()+" - Cl "+Cl.toString()+" - HCO3 "+HCO3.toString()+" = "+calculatedAnionGap);

    expectedAnionGap = 2.5*albumin;
    console.log("Expected anion gap = 2.5*albumin = 2.5*"+albumin.toString()+" = "+expectedAnionGap.toString());
    
    // Calculate the parts of the delta-delta (delta ratio) and the delta gap
    deltaAG = calculatedAnionGap - expectedAnionGap;
    console.log("\tdeltaAG = calculated anion gap - expected anion gap = "+calculatedAnionGap.toString()+" - "+expectedAnionGap.toString()+" = "+deltaAG.toString());
    if (calculatedAnionGap > expectedAnionGap) {
        console.log("\tHigh anion gap: calculated anion gap is higher than expected anion gap.")
    } else {
        console.log("\tLow or normal anion gap: calculated anion gap is less than or equal to expected anion gap.")
    }

    deltaHCO3 = 24 - HCO3;
    console.log("\tdeltaHCO3 = 24 - HCO3 = 24 - "+HCO3.toString()+" = "+deltaHCO3.toString());

    // Calculate the delta-delta (delta ratio)
    // See https://www.timeofcare.com/the-delta-anion-gap-delta-bicarb-ratio/
    // for the formulas.
    // See https://litfl.com/delta-ratio/ for the interpretation.
    deltaDelta = deltaAG/deltaHCO3;
    console.log("Delta-delta (aka delta ratio) = deltaAG / deltaHCO3 = "+deltaAG.toString()+" / "+deltaHCO3.toString()+" = "+deltaDelta.toString());
    if (deltaDelta < 0.4) {
        console.log("Delta-delta < 0.4: NAGMA");
        gapSummary = "NAGMA";
    } else if (0.4 <= deltaDelta && deltaDelta <= 1) {
        console.log("Delta-delta between 0.4 and 1.0: consider combined HAGMA + NAGMA");
        gapSummary = "HAGMA + NAGMA";
    } else if (1 < deltaDelta && deltaDelta < 2) {
        console.log("Delta-delta between 1 and 2: HAGMA");
        gapSummary = "HAGMA";
    } else if (deltaDelta >= 2) {
        console.log("Delta-delta > 2: consider combined HAGMA + metabolic alkalosis, OR combined HAGMA + compensation for chronic respiratory acidosis");
        gapSummary = "HAGMA + metabolic alkalosis, OR HAGMA + compensation for chronic respiratory acidosis";
    }

    // // Calculate the delta gap
    // // See https://www.timeofcare.com/the-delta-gap/
    // // Note: there is an alternative formula for the delta gap
    // // in which they allow the HCO3 to cancel out, yielding Na-Cl-36 as the
    // // delta gap formula, but I am not implementing the delta gap that way since
    // // I think the HCO3 will almost always be available.
    // deltaGap = deltaAG - deltaHCO3;
    // console.log("Delta gap = deltaAG - deltaHCO3 = "+deltaAG.toString()+" - "+deltaHCO3.toString()+" = "+deltaGap.toString());

    // if (deltaGap < -6) {
    //     console.log("Delta gap is <-6: consider combined HAGMA + NAGMA.");
    // } else if (-6 <= deltaGap <= 6) {
    //     console.log("Delta gap is between -6 to 6: HAGMA.");
    // } else if (deltaGap > 6) {
    //     console.log("Delta gap is >6: consider combined HAGMA + metabolic alkalosis.")
    // }
    return gapSummary;
}

/**
 * The function runAnalysis runs a full acid base analysis by calling
 * simpleAcidBase and anionGapWithDeltas.
 * Note that the albumin argument is optional. The default value of 4.8
 * for albumin was obtained as follows:
 * normal albumin is 3.4 to 5.4 g/dL
 * normal anion gap is 10—16 mEq/L; the value typically chosen as the default
 * in delta-delta calculations is 12.
 * Solving for 2.5*albumin = 12 yields albumin = 4.8 so that is why we 
 * choose albumin of 4.8 as the default value for albumin.
 */
function runAnalysis(pH, HCO3, PCO2, Na, Cl, albumin=4.8){
    answers = simpleAcidBase(pH, HCO3, PCO2);
    primary = answers[0];
    secondary = answers[1];
    secondary_chronic = answers[2];
    
    gapSummary = anionGapWithDeltas(Na, Cl, HCO3, albumin=4.8);

    // Construct the summary string
    // If there is a secondary_chronic specified then there is a secondary
    // specified
    var overallSummary = primary;
    if (secondary_chronic != "") {
        if (secondary == secondary_chronic) {
            overallSummary = overallSummary+" with "+secondary.toString();
        } else {
            // secondary and secondary_chronic disagree meaning there is
            // a different secondary option depending on whether the
            // respiratory issue is acute or chronic
            overallSummary = overallSummary+" with "+secondary.toString()+" (acute respiratory) or "+secondary_chronic.toString()+" (chronic respiratory)";
        }
    } else if (secondary != "") {
        overallSummary = overallSummary+" with "+secondary.toString();
    }
    
    if (gapSummary != "") {
        overallSummary = overallSummary+". The metabolic acidosis is "+gapSummary;
    }
    
    console.log(overallSummary);
}

// runAnalysis(pH = 7.40, HCO3 = 23, PCO2 = 40, Na = 150, Cl = 87, albumin = 4.8);

runAnalysis(pH = 7.53, HCO3 = 12, PCO2 = 15, Na = 140, Cl = 108, albumin = 4.8);

// TODO - write unit tests that check the values of primary, secondary,
// secondary_chronic, and gapSummary. Ask the medical interns 
// to turn the case studies into an Excel table with the expected values of
// the different variables along with the input values so it's easy to
// write a bunch of unit tests.

// TODO: change this so instead of console.log, instead strings are returned.
// Do this so that the strings can be displayed on the site.

// TODO: add a differential diagnosis function that detects the different
// disorders specified in the summary string and then prints off the
// differential diagnosis for each disorder.
// So for example if HAGMA is in the string it lists off what causes
// HAGMA.

// in the UI: boxes to enter elements of the ABG, then below, the one-sentence
// summary appears, and then there are 2 plus buttons one for "Show Calculations"
// and another for "Show Differential Diagnosis" which will expand the
// additional material.

// add a footnote specifying what NAGMA and HAGMA stand for.

// maybe check work with https://www.mdcalc.com/arterial-blood-gas-abg-analyzer  ???