/* 
Combines like-sentences in hpi-note. 

Uses compare(strA, strB, n) to check between two strings - returns array if they are not combined, string of their combination

Uses takeString to split up HPI string every period - then removes unneeded spaces / null strings that can pop up; then applies compare(strA, strB, n)
to each string that is next to eachother.
*/

function removeDoubleWords(str: string) {
    const words = str.split(' ');
    const newWords = [];

    for (let i = 0; i < words.length; i++) {
        if (words[i] !== words[i + 1]) {
            newWords.push(words[i]);
        }
    }

    return newWords.join(' ');
}

function capitalizeFirstLetter(string: string) {
    const trimmedString = string.trim(); // Trim leading and trailing spaces
    return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
}

function removeItem(array: any, item: any) {
    let i = array.length;

    while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
    }
}

const returnWithConnectorWord = (
    stringA: Array<string>,
    stringB: Array<string>,
    n: number
) => {
    stringA.unshift('');
    const combinedArray = stringA;
    stringB = stringB.slice(n, stringB.length);
    const sentence = combinedArray.join(' ');
    const capitalizedSentence =
        sentence.charAt(0).toUpperCase() + sentence.slice(1);
    const combinedSentence = capitalizedSentence.concat(' ', stringB.join(' '));
    const sentenceWithPeriod = combinedSentence.endsWith('.')
        ? combinedSentence
        : combinedSentence + '.';
    return sentenceWithPeriod;
};

export function compare(strA: string, strB: string, n: number) {
    let hasAnd = 0;
    // counter for words that are the same
    let amtSame = 0;
    const splitA = strA.split(' ');
    const splitB = strB.split(' ');
    removeItem(splitA, '');
    removeItem(splitB, '');
    removeItem(splitA, ' ');
    removeItem(splitB, ' ');
    let index = 0;
    let combinedStr = '';
    // compares words that are the same, increments amtSame when they are equal, breaks when words are dissimilar
    for (let i = 0; i < splitA.length; i++) {
        // remove period at the end if present
        let wordA = splitA[i].toLowerCase();
        let wordB = splitB[i].toLowerCase();

        if (wordA.endsWith('.')) {
            wordA = wordA.slice(0, -1);
        }
        if (wordB.endsWith('.')) {
            wordB = wordB.slice(0, -1);
        }

        // compare words
        if (wordA !== wordB) {
            break;
        } else {
            amtSame++;
        }
    }
    // if amtSame is greater than or equal to n, combine the strings with and, starting at index amtSame.

    if (amtSame >= n) {
        // removes period from the first string to combine
        const oneD = splitA.length - 1;
        const twoD = splitA[splitA.length - 1].length - 1;
        const lastItem = splitA[oneD][twoD];
        const newSplitA = splitA;

        if (lastItem === '.') {
            const newString = splitA[oneD].slice(0, -1);
            newSplitA[oneD] = newString;
        }
        if (amtSame > n) {
            switch (splitB[amtSame]) {
                case 'and':
                case 'but':
                case 'so':
                case 'for':
                case 'with':
                    return returnWithConnectorWord(splitA, splitB, amtSame);
                default:
                    break;
            }
        }
        // makes sure that searchFrom is in bounds.
        const searchFrom = splitA.length > 4 ? 5 : 4;
        // checks last 4 words for and following a comma, saves 0-indexed location
        for (let i = splitA.length - searchFrom; i < splitA.length; i++) {
            if (newSplitA[i].indexOf(',') > -1 && newSplitA[i + 1] === 'and') {
                hasAnd = 1;
                index = i + 1;
            }
        }
        // checks if "not" or "denies" appears in second string.
        for (let i = n; i < splitB.length; i++) {
            if (splitB[i] === 'not' || splitB[i] === 'denies') {
                return [strA + '.', strB + '.'];
            }
        }
        // removes the and if it is there
        if (hasAnd) {
            newSplitA.splice(index, 1);
        }
        // gets the character at the last indice to check if it is a comma. If yes, doesn't add "and"
        if (hasAnd) {
            for (let i = 0; i < splitA.length; i++) {
                combinedStr += i === 0 ? splitA[i] : ' ' + splitA[i];
            }
            combinedStr += ',';
        } else {
            for (let i = 0; i < splitA.length; i++) {
                combinedStr += i === 0 ? newSplitA[i] : ' ' + newSplitA[i];
            }
            combinedStr += ' and';
        }
        // Accounts for empty string due to first space in sentences
        // Starts at indice amtSame

        for (let i = amtSame; i < splitB.length; i++) {
            combinedStr += splitB[i] === '.' ? '.' : ' ' + splitB[i];
        }

        if (combinedStr.charAt(combinedStr.length - 1) != '.') {
            combinedStr += '.';
        }

        return removeDoubleWords(' ' + capitalizeFirstLetter(combinedStr));
    } // otherwise return array containing the two strings.
    else {
        return [strA + '.', strB + '.'];
    }
}

export const combineHpiString = (str: string, n: number) => {
    let newStr = '';
    const stringArr = str.split('.');
    let tempComb;
    // remove invalid strings appearing in the text
    // (ideally there would be none in the first place, but rarely double periods can occur)
    removeItem(stringArr, ' ');
    removeItem(stringArr, '');
    removeItem(stringArr, undefined);
    // have to add space at beginning of first string to make comparison work.
    // if the combination is on the final iteration and there isn't two strings to compare, add that string to the end of the current combined.
    for (let i = 0; i < stringArr.length; i++) {
        if (i == stringArr.length - 1) {
            tempComb = stringArr[i] + '.';
            newStr += capitalizeFirstLetter(stringArr[i] + '.');
            return newStr;
        } else if (i === 0) {
            tempComb = compare(
                ' ' + capitalizeFirstLetter(stringArr[0]),
                stringArr[1],
                n
            );
        } else tempComb = compare(stringArr[i], stringArr[i + 1], n);
        // if the combination is on the final iteration and compare(str1, str2) returns an array, combine both and return that str
        if (Array.isArray(tempComb) && i === stringArr.length - 2) {
            newStr += tempComb[0] + tempComb[1];
            return newStr;
        }

        if (Array.isArray(tempComb)) {
            newStr += tempComb[0];
            continue;
        } else {
            newStr += tempComb;
            i++;
        }
    }
    return newStr;
};
