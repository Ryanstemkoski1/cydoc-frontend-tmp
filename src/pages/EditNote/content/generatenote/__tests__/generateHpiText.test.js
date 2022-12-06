// import { PatientPronouns } from 'constants/patientInformation';
import {
    abbreviate,
    capitalize,
    // createHPI,
    // definePatientNameAndPronouns,
    fillAnswers,
    fillMedicalTerms,
    // fillNameAndPronouns,
    fullClean,
} from '../generateHpiText';

// const EXAMPLE = {
//     1: ['the patient has hypertension', ''],
//     2: ['the patient has had hypertension for ANSWER', '10 years'],
//     3: [
//         'The patient suffers from the following comorbid conditions: ANSWER',
//         'diabetes, high cholesterol, heart attack',
//     ],
//     4: ['their usual blood pressure reading is ANSWER', '150/110'],
//     5: [
//         'the patient reports that recently their blood pressure has ANSWER',
//         'increased',
//     ],
//     6: ['the patient monitors their blood pressure from home', ''],
//     7: [
//         'the patient has the following questions about monitoring their blood pressure: ANSWER',
//         'how many times per day should I check my blood pressure',
//     ],
//     9: [
//         'the patient is taking antihypertensive medications',
//         'atenolol, torsemide',
//     ],
//     10: ['The patient is suffering from medication side effects', ''],
//     11: [
//         'the patient has experienced ANSWER.',
//         'dizziness and headaches sometimes in the morning',
//     ],
//     12: [
//         'The patient has the following questions about their medications: ANSWER',
//         'can I stop taking torsemide',
//     ],
//     13: ['The patient is actively trying to reduce their blood pressure.', ''],
//     14: [
//         'To reduce their blood pressure, the patient tries: ANSWER',
//         'I do yoga on Tuesdays and I try to stop eating salty foods',
//     ],
//     15: ['The patient reports a stress level of ANSWER out of 10', '5'],
//     16: ["The patient's sources of stress are ANSWER", 'my job'],
//     17: [
//         'Additionally, the patient has a family history of ANSWER',
//         'high blood pressure',
//     ],
//     18: [
//         'The following barriers make it difficult for the patient to reduce their blood pressure: ANSWER',
//         'I work really long hours',
//     ],
//     19: [
//         'The patient believes that the clinician can help them overcome these barriers by: ANSWER',
//         'giving me better medicine',
//     ],
// };

describe('generateHpiText', () => {
    describe('fillAnswers', () => {
        it('handles empty hpi', () => {
            expect(fillAnswers({})).toEqual('');
        });

        // // TODO: Fix below tests
        // it('handles single yes/no question', () => {
        //     const hpi = {
        //         22: ['the patient has hypertension', 'dummy answer'],
        //     };
        //     // ignores the answer if yes/no as it should have been blank
        //     const expected = 'the patient has hypertension. ';
        //     expect(fillAnswers(hpi)).toEqual(expected);
        // });

        // it('handles single short response question', () => {
        //     const hpi = {
        //         22: ['stress level of ANSWER out of 10', ' 5! '],
        //     };
        //     const expected = 'stress level of 5 out of 10. ';
        //     expect(fillAnswers(hpi)).toEqual(expected);
        // });

        // it('handles negative response question', () => {
        //     const hpi = {
        //         22: ['does not experience NOTANSWER', 'a, b, or c'],
        //     };
        //     const expected = 'does not experience a, b, or c. ';
        //     expect(fillAnswers(hpi)).toEqual(expected);
        // });

        // it('cleanses inputs', () => {
        //     const hpi = {
        //         22: ['  stress LevEl!!   of ANSWER out of 10', ' 5! '],
        //     };
        //     const expected = 'stress level of 5 out of 10. ';
        //     expect(fillAnswers(hpi)).toEqual(expected);
        // });

        // it('handles multiple questions in the correct order', () => {
        //     const hpi = {
        //         22: ['the patient   has  hypertension?', ''],
        //         5: ['  the   patient SUFFERS from: ANSWER', ' chills, fevers!'],
        //         10: ['it has been   ANSWER  ', ' 10 YEARS'],
        //     };
        //     const expected =
        //         'the patient suffers from: chills, fevers. ' +
        //         'it has been 10 years. ' +
        //         'the patient has hypertension. ';
        //     expect(fillAnswers(hpi)).toEqual(expected);
        // });
    });

    describe('definePatientNameAndPronouns', () => {
        // // TODO: Fix below tests
        // it('handles general title, M', () => {
        //     const title = 'general';
        //     const lastname = 'Foo';
        //     const gender = 'M';
        //     const expected = {
        //         name: 'Mr. Foo',
        //         objPronoun: 'he',
        //         posPronoun: 'his',
        //     };
        //     expect(
        //         definePatientNameAndPronouns(title, lastname, gender)
        //     ).toEqual(expected);
        // });
        // it('handles general title, F', () => {
        //     const title = 'general';
        //     const lastname = 'Foo';
        //     const gender = 'F';
        //     const expected = {
        //         name: 'Ms. Foo',
        //         objPronoun: 'she',
        //         posPronoun: 'her',
        //     };
        //     expect(
        //         definePatientNameAndPronouns(title, lastname, gender)
        //     ).toEqual(expected);
        // });
        // it('handles specified title', () => {
        //     const title = 'Dr.';
        //     const lastname = '  Foo  ';
        //     const gender = 'F';
        //     const expected = {
        //         name: 'Dr. Foo',
        //         objPronoun: 'she',
        //         posPronoun: 'her',
        //     };
        //     expect(
        //         definePatientNameAndPronouns(title, lastname, gender)
        //     ).toEqual(expected);
        // });
    });

    describe('fillNameAndPronouns', () => {
        // // TODO: Fix below tests
        // it('handles empty empty', () => {
        //     expect(
        //         fillNameAndPronouns('', {
        //             name: '',
        //             objPronoun: '',
        //             posPronoun: '',
        //         })
        //     ).toEqual('');
        // });
        // it('replaces possessives', () => {
        //     const inp = "their name? the patient's age?";
        //     const patient = {
        //         name: 'foo',
        //         objPronoun: 'she',
        //         posPronoun: 'her',
        //     };
        //     const expected = 'her name? her age?';
        //     expect(fillNameAndPronouns(inp, patient)).toEqual(expected);
        // });
        // it('replaces "the patient" with either name or pronoun', () => {
        //     const inp =
        //         'the patient is tired. the patient slept, and the ' +
        //         'patient feels better. the patient recovered';
        //     const patient = {
        //         name: 'foo',
        //         objPronoun: 'she',
        //         posPronoun: 'her',
        //     };
        //     const expected =
        //         'foo is tired. she slept, and she feels better.' +
        //         ' foo recovered';
        //     expect(fillNameAndPronouns(inp, patient)).toEqual(expected);
        // });
    });

    describe('fillMedicalTerms', () => {
        it('handles empty string', () => {
            expect(fillMedicalTerms('')).toEqual('');
        });

        // // TODO: Fix below tests
        // it('replaces based on word map', () => {
        //     const inp = "the patient's chest pain?";
        //     const expected = "the patient's angina?";
        //     expect(fillMedicalTerms(inp)).toEqual(expected);
        // });

        it('does not replace nested substrings', () => {
            const inp = 'schest paint';
            const expected = 'schest paint';
            expect(fillMedicalTerms(inp)).toEqual(expected);
        });
    });

    describe('abbreviate', () => {
        it('handles empty string', () => {
            expect(abbreviate('')).toEqual('');
        });

        it('abbreviates based on word map', () => {
            const inp = 'the pulmonary embolism?';
            const expected = 'the PE?';
            expect(abbreviate(inp)).toEqual(expected);
        });

        it('does not abbreviate nested substrings', () => {
            const inp = 'spulmonary embolisme';
            const expected = 'spulmonary embolisme';
            expect(abbreviate(inp)).toEqual(expected);
        });
    });

    describe('capitalize', () => {
        it('handles empty string', () => {
            expect(capitalize('')).toEqual('');
        });

        it('handles pronoun i correctly', () => {
            const inp = 'iiii i i ii i ii';
            const expected = 'Iiii I I ii I ii';
            expect(capitalize(inp)).toEqual(expected);
        });

        it('capitalizes multiple sentences', () => {
            const inp = 'the: quick, brown fox. jumped! over the? yellow';
            const expected = 'The: quick, brown fox. Jumped! Over the? Yellow';
            expect(capitalize(inp)).toEqual(expected);
        });
    });

    describe('fullClean', () => {
        it('handles empty string', () => {
            expect(fullClean('')).toEqual('');
        });

        it('lowercases string', () => {
            const inp = 'Foo BAR';
            const expected = 'foo bar';
            expect(fullClean(inp)).toEqual(expected);
        });

        it('cleans whitespace', () => {
            const inp = '   foo    bar  24  \n';
            const expected = 'foo bar 24';
            expect(fullClean(inp)).toEqual(expected);
        });

        it('removes appropriate punctuation', () => {
            const inp = 'foo!:;? bar, 42. 24.';
            const expected = 'foo: bar, 42. 24';
            expect(fullClean(inp)).toEqual(expected);
        });

        it('chains the rules', () => {
            const inp = '  foo?  BAR!! 42?   24,  eom.';
            const expected = 'foo bar 42 24, eom';
            expect(fullClean(inp)).toEqual(expected);
        });
    });

    describe('createHPI', () => {
        // // TODO: Fix below tests
        // it('chains everything together', () => {
        //     const hpi = {
        //         55: [
        //             "  Additionally, the patient's family has a history of ANSWER",
        //             'high blood pressure!!!',
        //         ],
        //         22: ['the patient has osteoarthritis', ''],
        //         100: [
        //             'barriers that make it difficult for the patient: ANSWER',
        //             'so i work long hours',
        //         ],
        //     };
        //     const patientName = 'Dr. Foo';
        //     const expected =
        //         'Dr. Foo has OA. ' +
        //         'Additionally, his family has a history of hypertension. ' +
        //         // TODO: need to account for direct object pronouns
        //         'Barriers that make it difficult for he: so I work long hours. ';
        //     expect(createHPI(hpi, patientName, PatientPronouns.He)).toEqual(
        //         expected
        //     );
        // });
        // it('generates text for the example', () => {
        //     const patientName = 'Ms. Lee';
        //     expect(
        //         createHPI(EXAMPLE, patientName, PatientPronouns.She)
        //     ).toMatchSnapshot();
        // });
    });
});
