
/**
 * The function basicAcidBase describes acid base disorders for which the pH
 * is abnormal: either < 7.35 or > 7.45. This function does NOT produce any 
 * output for a normal pH in the range 7.35 <= pH <= 7.45. 
 * For pH < 7.35, this function produces detailed output and compensation 
 * calculations if HCO3 < 22 or PCO2 > 45, but does not do any compensation
 * calculations if HCO3 is higher or PCO2 is lower than those values.
 * For pH > 7.45, this function produces detailed output and compensation
 * calculations if HCO3 > 28 or PCO2 < 33, but does not do any compensation
 * calculations if HCO3 is lower or PCO2 is higher than those values.
 */
 function basicAcidBase(pH, HCO3, PCO2) {
    if (pH < 7.35) {
        console.log("pH of "+pH.toString()+" is < 7.35. Acidemia: primary disorder is acidosis.");

        if (HCO3 < 22) {
            // Metabolic acidosis
            console.log("HCO3 of "+HCO3.toString()+" is < 22 so there is a metabolic acidosis.");

            // Calculate expected compensation for metabolic acidosis
            mtAcidPCO2ExpLow = (1.5*HCO3) + 8 - 2;
            mtAcidPCO2ExpHigh = (1.5*HCO3) + 8 + 2;
            console.log("For primary metabolic acidosis, expected PCO2 is (1.5*HCO3) + 8 +/- 2 = "+mtAcidPCO2ExpLow.toString()+" to "+mtAcidPCO2ExpHigh.toString());

            if (PCO2 < mtAcidPCO2ExpLow) {
                console.log("PCO2 of "+PCO2.toString()+" is < expected PCO2 lower bound of "+mtAcidPCO2ExpLow.toString()+" so there is an additional respiratory alkalosis.");
            } else if (PCO2 > mtAcidPCO2ExpHigh) {
                console.log("PCO2 of "+PCO2.toString()+" is > expected PCO2 upper bound of "+mtAcidPCO2ExpHigh.toString()+" so there is an additional respiratory acidosis.");
            } else {
                console.log("PCO2 of "+PCO2.toString()+" is within the expected range of "+mtAcidPCO2ExpLow.toString()+" to "+mtAcidPCO2ExpHigh.toString()+" so there is NO additional respiratory acidosis or alkalosis.");
            }
        }
      
        if (PCO2 > 45) {
            // Respiratory acidosis
            console.log("PCO2 of "+PCO2.toString()+" is > 45 so there is a respiratory acidosis.");

            // Calculate expected compensation for acute respiratory acidosis
            rsAcidHCO3ExpAcute = 24 + (0.1*(PCO2 - 40));
            console.log("For acute respiratory acidosis, expected HCO3 is 24 + (0.1*(PCO2-40)) = "+rsAcidHCO3ExpAcute.toString());
        
            if (HCO3 < rsAcidHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is an additional metabolic acidosis.");
            } else if (HCO3 > rsAcidHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is an additional metabolic alkalosis.")
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAcidHCO3ExpAcute.toString()+" so there is NO additional metabolic acidosis or alkalosis.");
            }

            // Calculate expected compensation for chronic respiratory acidosis
            rsAcidHCO3ExpChronic = 24 + (0.35*(PCO2 - 40));
            console.log("For chronic respiratory acidosis, expected HCO3 is 24 + (0.35*(PCO2-40)) = "+rsAcidHCO3ExpChronic.toString());

            if (HCO3 < rsAcidHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is an additional metabolic acidosis.");
            } else if (HCO3 > rsAcidHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is an additional metabolic alkalosis.");
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAcidHCO3ExpChronic.toString()+" so there is NO additional metabolic acidosis or alkalosis.");
            }
        }
    } else if (pH > 7.45) {
        console.log("pH of "+pH.toString()+" is > 7.45. Alkalemia: primary disorder is alkalosis.");

        if (HCO3 > 28) {
            // Metabolic alkalosis
            console.log("HCO3 of "+HCO3.toString()+" is > 28 so there is a metabolic alkalosis.");

            // Calculate expected compensation for metabolic alkalosis
            mtAlkPCO2ExpLow = (0.7*(HCO3 - 24)) + 40 - 2;
            mtAlkPCO2ExpHigh = (0.7*(HCO3 - 24)) + 40 + 2;
            console.log("For primary metabolic alkalosis, expected PCO2 is (0.7*(HCO3-24)) + 40 +/- 2 = "+mtAlkPCO2ExpLow.toString()+" to "+mtAlkPCO2ExpHigh.toString());

            if (PCO2 < mtAlkPCO2ExpLow) {
                console.log("PCO2 of "+PCO2.toString()+" is < expected PCO2 lower bound of "+mtAlkPCO2ExpLow.toString()+" so there is an additional respiratory alkalosis.");
            } else if (PCO2 > mtAlkPCO2ExpHigh) {
                console.log("PCO2 of "+PCO2.toString()+" is > expected PCO2 upper bound of "+mtAlkPCO2ExpHigh.toString()+" so there is an additional respiratory acidosis.");
            } else {
                console.log("PCO2 of "+PCO2.toString()+" is within the expected range of "+mtAlkPCO2ExpLow.toString()+" to "+mtAlkPCO2ExpHigh.toString()+" so there is NO additional respiratory acidosis or alkalosis.");
            }
        }

        if (PCO2 < 33) {
            // Respiratory alkalosis
            console.log("PCO2 of "+PCO2.toString()+" is < 33 so there is a respiratory alkalosis.");

            // Calculate expected compensation for acute respiratory alkalosis
            rsAlkHCO3ExpAcute = 24 - (0.2*(40 - PCO2));
            console.log("For acute respiratory alkalosis, expected HCO3 is 24 - (0.2*(40-PCO2)) = "+rsAlkHCO3ExpAcute.toString());

            if (HCO3 < rsAlkHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is an additional metabolic acidosis.");
            } else if (HCO3 > rsAlkHCO3ExpAcute) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is an additional metabolic alkalosis.");
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAlkHCO3ExpAcute.toString()+" so there is NO additional metabolic acidosis or alkalosis.");
            }

            // Calculate expected compensation for chronic respiratory alkalosis
            rsAlkHCO3ExpChronic = 24 - (0.4*(40 - PCO2));
            console.log("For chronic respiratory alkalosis, expected HCO3 is 24 - (0.4*(40-PCO2)) = "+rsAlkHCO3ExpChronic.toString());

            if (HCO3 < rsAlkHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is < expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is an additional metabolic acidosis.");
            } else if (HCO3 > rsAlkHCO3ExpChronic) {
                console.log("\t HCO3 of "+HCO3.toString()+" is > expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is an additional metabolic alkalosis.");
            } else {
                console.log("\t HCO3 of "+HCO3.toString()+" is equal to expected HCO3 of "+rsAlkHCO3ExpChronic.toString()+" so there is NO additional metabolic acidosis or alkalosis.");
            }
        }
    }
}

/**
 * The function anionGapDeltaDelta calculates the anion gap, the 
 * delta-delta (delta ratio) and the delta gap.
 * Note that the albumin argument is optional. The default value of 4.8
 * for albumin was obtained as follows:
 * normal albumin is 3.4 to 5.4 g/dL
 * normal anion gap is 10—16 mEq/L; the value typically chosen as the default
 * in delta-delta calculations is 12.
 * Solving for 2.5*albumin = 12 yields albumin = 4.8 so that is why we 
 * choose albumin of 4.8 as the default value for albumin.
 */
function anionGapDeltaDelta(Na, Cl, HCO3, albumin=4.8) {
    if (albumin == 4.8) {
        console.log("Using albumin of "+albumin.toString());
    }

    expectedAnionGap = 2.5*albumin;
    console.log("Expected anion gap = 2.5*albumin = 2.5*"+albumin.toString()+" = "+expectedAnionGap.toString());
  
    calculatedAnionGap = Na - Cl - HCO3;
    console.log("Calculated anion gap = Na "+Na.toString()+" - Cl "+Cl.toString()+" - HCO3 "+HCO3.toString()+" = "+calculatedAnionGap);

    if (calculatedAnionGap > expectedAnionGap) {
        console.log("High anion gap: calculated anion gap is higher than expected anion gap.")
    } else {
        console.log("Low or normal anion gap: calculated anion gap is less than or equal to expected anion gap.")
    }
    
    // Calculate the components of the delta-delta (delta ratio) and the
    // delta gap
    deltaAG = calculatedAnionGap - expectedAnionGap;
    deltaHCO3 = 24 - HCO3;
    console.log("The components of the delta-delta (delta ratio) and the delta gap are deltaAG and deltaHCO3.");
    console.log("\tdeltaAG = calculated anion gap - expected anion gap = "+calculatedAnionGap.toString()+" - "+expectedAnionGap.toString()+" = "+deltaAG.toString());
    console.log("\tdeltaHCO3 = 24 - HCO3 = 24 - "+HCO3.toString()+" = "+deltaHCO3.toString());

    // Calculate the delta-delta (delta ratio)
    // See https://www.timeofcare.com/the-delta-anion-gap-delta-bicarb-ratio/
    deltaDelta = deltaAG/deltaHCO3;
    console.log("Delta-delta (aka delta ratio) = deltaAG / deltaHCO3 = "+deltaAG.toString()+" / "+deltaHCO3.toString());

    if (1 <= deltaDelta <= 2) {
        console.log("Delta-delta is between 1-2: pure anion gap metabolic acidosis");
    } else if (deltaDelta < 1) {
        console.log("Delta-delta is <1: anion gap metabolic acidosis and a simultaneous non-anion gap metabolic acidosis.")
    } else if (deltaDelta > 2) {
        console.log("Delta-delta is >2: anion gap metabolic acidosis and a simultaneous metabolic alkalosis.")
    }

    // Calculate the delta gap
    // See https://www.timeofcare.com/the-delta-gap/
    // Note: there is an alternative formula for the delta gap
    // in which they allow the HCO3 to cancel out, yielding Na-Cl-36 as the
    // delta gap formula, but I am not implementing the delta gap that way since
    // I think the HCO3 will almost always be available.
    deltaGap = deltaAG - deltaHCO3;
    console.log("Delta gap = deltaAG - deltaHCO3 = "+deltaAG.toString()+" - "+deltaHCO3.toString()+" = "+deltaGap.toString());

    if (deltaGap < -6) {
        console.log("Delta gap is <-6: mixed high and normal anion gap acidosis.");
    } else if (-6 <= deltaGap <= 6) {
        console.log("Delta gap is between -6 to 6: only a high anion gap acidosis is present.");
    } else if (deltaGap > 6) {
        console.log("Delta gap is >6: mixed high anion gap acidosis and metabolic alkalosis.")
    }
}


basicAcidBase(pH, HCO3, PCO2);
anionGapDeltaDelta(Na, Cl, HCO3, albumin=4.8);

// TODO - in order to facilitate unit tests, have these functions return
// booleans indicating the acid base disorders that are present/absent.
// also, have a big summary print off at the end based on the values
// returned from these functions e.g. a one liner like "metabolic acidosis
// with adequate respiratory compensation"
// TODO add in whether the compensation is adequate

//TODO - after you figure out what variables you are going to use
// for binary presence/absence of different disorders, ask the medical interns 
// to turn the case studies into an Excel table with true or false in 
// the different variables along with the input values so it's easy to
// write a bunch of unit tests.