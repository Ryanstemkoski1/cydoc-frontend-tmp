import { compareAndCombine } from '../textGeneration/processing/combineHPIString';

test('combine regular sentences 1', () => {
    expect(
        compareAndCombine('The pain is sharp.', 'The pain is 8/10 severity.', 2)
    ).toBe(' The pain is sharp and 8/10 severity.');
});
test('combine regular sentences 2', () => {
    expect(
        compareAndCombine(
            'The patient is 26.',
            'The patient is undergoing treatment.',
            2
        )
    ).toBe(' The patient is 26 and undergoing treatment.');
});
test('combine regular sentences 3', () => {
    expect(
        compareAndCombine('The patient is waiting.', 'The dog is barking.', 2)
    ).toEqual(['The patient is waiting.', 'The dog is barking.']);
});
test('combine regular sentences 4', () => {
    expect(
        compareAndCombine(
            'The patient has a cellphone.',
            'The patient has a hangnail.',
            3
        )
    ).toBe(' The patient has a cellphone and hangnail.');
});
test('combine regular sentences 5', () => {
    expect(
        compareAndCombine(
            'The abdominal pain comes on every 60 minutes.',
            "The abdominal pain radiates to the patient's ear, pelvis, upper arm, and hand.",
            3
        )
    ).toBe(
        " The abdominal pain comes on every 60 minutes and radiates to the patient's ear, pelvis, upper arm, and hand."
    );
});
test('combine regular sentences 6', () => {
    expect(
        compareAndCombine(
            'The patient has traveled recently',
            'The patient has difficulty with falling asleep',
            2
        )
    ).toBe(
        ' The patient has traveled recently and difficulty with falling asleep.'
    );
});
test('combine regular sentences 7', () => {
    expect(
        compareAndCombine(
            ' The patient sleeps 8 hours every night.',
            ' The patient snores.',
            2
        )
    ).toBe(' The patient sleeps 8 hours every night and snores.');
});
test('combine regular sentences 8', () => {
    expect(
        compareAndCombine(
            'The patient feels refreshed when they wake up.',
            'The patient feels sleepy during the day.',
            2
        )
    ).toBe(
        ' The patient feels refreshed when they wake up and sleepy during the day.'
    );
});
test('combine regular sentences 9', () => {
    expect(
        compareAndCombine(
            'The patient is experiencing the following symptoms: dizziness.',
            'The patient denies the following symptoms: lightheadedness, fatigue, dyspnea, cold extremities, pale extremities, or bluish lips.',
            2
        )
    ).toEqual([
        'The patient is experiencing the following symptoms: dizziness.',
        'The patient denies the following symptoms: lightheadedness, fatigue, dyspnea, cold extremities, pale extremities, or bluish lips.',
    ]);
});
// When the sentences have similar starting words, but not to the N - 1 index,
// The function returns each sentence in an Array.
test('combine sentences with big N', () => {
    expect(
        compareAndCombine(
            'The patient feels refreshed when they wake up.',
            'The patient feels sleepy during the day.',
            4
        )
    ).toEqual([
        'The patient feels refreshed when they wake up.',
        'The patient feels sleepy during the day.',
    ]);
});

describe('compare function tests', () => {
    it('should combine similar sentences', () => {
        const result = compareAndCombine(
            'The patient monitors their blood sugar.',
            'The patient monitors their blood sugar with a continuous glucose monitor.',
            3
        );
        expect(result).toBe(
            ' The patient monitors their blood sugar with a continuous glucose monitor.'
        );
    });
    it('should work with multiple ands', () => {
        const result = compareAndCombine(
            'The patient drinks and snores.',
            'The patient needs help getting out of bed.',
            2
        );
        expect(result).toBe(
            ' The patient drinks and snores and needs help getting out of bed.'
        );
    });
});
describe('tests compare function_v2', () => {
    it('should combine: [A, B, C] + [D, E, F] -> A, B, C, D, E and F', () => {
        const result = compareAndCombine(
            'The patient reports dizziness, sore throat, and headache.',
            'The patient reports chest pain, nausea, and vomiting.',
            3
        );
        expect(result).toBe(
            ' The patient reports dizziness, sore throat, headache, chest pain, nausea, and vomiting.'
        );
    });
    it('should combine --> [A] + [B] -> A and B', () => {
        const result = compareAndCombine(
            'The patient reports dizziness.',
            'The patient reports chest pain.',
            2
        );
        expect(result).toBe(' The patient reports dizziness and chest pain.');
    });
});
describe('tests compare function_v3', () => {
    // TODO: they should be A, B and C
    it('incorrect combine --> [A, B] + [C] -> A and B and C', () => {
        const result = compareAndCombine(
            'The patient reports dizziness and vomiting.',
            'The patient reports chest pain.',
            2
        );
        expect(result).toBe(
            ' The patient reports dizziness and vomiting and chest pain.'
        );
    });
    it('incorrect combine --> [A] + [B, C] -> A and B and C', () => {
        const result = compareAndCombine(
            'The patient reports chest pain.',
            'The patient reports dizziness and vomiting.',
            2
        );
        expect(result).toBe(
            ' The patient reports chest pain and dizziness and vomiting.'
        );
    });
    it('incorrect combine --> [A, B] + [C, D] -> A and B and C', () => {
        const result = compareAndCombine(
            'The patient reports dizziness and vomiting.',
            'The patient reports chest pain and nausea.',
            2
        );
        expect(result).toBe(
            ' The patient reports dizziness and vomiting and chest pain and nausea.'
        );
    });
});
