const numerals = {
    ' i': ' 1',
    ' ii': ' 2',
    ' iii': ' 3',
    ' iv': ' 4',
    ' v': ' 5',
    ' vi': ' 6',
    ' vii': ' 7',
    ' viii': ' 8',
    ' ix': ' 9',
    ' x': ' 10',
    ' xi': ' 11',
    ' xii': ' 12',
    ' xiii': ' 13',
    ' xiv': ' 14',
    ' xv': ' 15',
    ' xvi': ' 16',
    ' xvii': ' 17',
    ' xviii': ' 18',
    ' xix': ' 19',
    ' xx': ' 20',
    ' I': ' 1',
    ' II': ' 2',
    ' III': ' 3',
    ' IV': ' 4',
    ' V': ' 5',
    ' VI': ' 6',
    ' VII': ' 7',
    ' VIII': ' 8',
    ' IX': ' 9',
    ' X': ' 10',
    ' XI': ' 11',
    ' XII': ' 12',
    ' XIII': ' 13',
    ' XIV': ' 14',
    ' XV': ' 15',
    ' XVI': ' 16',
    ' XVII': ' 17',
    ' XVIII': ' 18',
    ' XIX': ' 19',
    ' XX': ' 20',
};

const preserveAcronyms = (name) => {
    if (name !== name.toUpperCase()) {
        let parts = name.split(' ');
        parts = parts.map((value) => {
            if (value !== value.toUpperCase() || ' ' + value in numerals) {
                return value.toLowerCase();
            } else {
                return value;
            }
        });
        name = parts.join(' ');
    }
    return name;
};

const standardizeDiseaseNames = (disease) => {
    let name = disease;
    name = preserveAcronyms(name);
    const match = name.match(' [ivx]+');
    if (match !== null) {
        const nextIndex = match.index + match[0].length;
        if (match.input.charAt(nextIndex) === ' ' && match[0] in numerals) {
            name = name.replace(/ [ivx]+/g, numerals[match[0]]);
        }
    }
    return name;
};

/*
The extra functionality here is to make the end of a word a roman numeral.
However, we should only do this on blur so that a phrase like
i am v turns into i am 5 until user is finished.
*/
const standardizeDiseaseNamesOnBlur = (disease) => {
    let name = disease;
    name = preserveAcronyms(name);
    const match = name.match(' [ivx]+');
    if (match !== null) {
        //it is a roman numeral if the next letter is a space or last in string.
        const nextIndex = match.index + match[0].length;
        if (
            (nextIndex >= match.input.length ||
                match.input.charAt(nextIndex) === ' ') &&
            match[0] in numerals
        ) {
            name = name.replace(/ [ivx]+/g, numerals[match[0]]);
        }
    }
    return name;
};

export { standardizeDiseaseNames, standardizeDiseaseNamesOnBlur };
