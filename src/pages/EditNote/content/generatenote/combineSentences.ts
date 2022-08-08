/* 
Combines like-sentences in hpi-note. 

Uses compare(strA, strB, n) to check between two strings - returns array if they are not combined, string of their combination

Uses takeString to split up HPI string every period - then removes unneeded spaces / null strings that can pop up; then applies compare(strA, strB, n)
to each string that is next to eachother.

*/

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeItem(array: any, item: any) {
    let i = array.length;

    while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
    }
}

export function compare(strA: string, strB: string, n: number) {
    // counter for words that are the same

    let hasAnd = 0;
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
        if (splitA[i].toLowerCase() != splitB[i].toLowerCase()) {
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
                if (i == 0) {
                    combinedStr += newSplitA[i];
                } else {
                    combinedStr += ' ' + newSplitA[i];
                }
            }
            combinedStr += ',';
        } else {
            for (let i = 0; i < splitA.length; i++) {
                if (i == 0) {
                    combinedStr += newSplitA[i];
                } else {
                    combinedStr += ' ' + newSplitA[i];
                }
            }
            combinedStr += ' and';
        }
        // Accounts for empty string due to first space in sentences
        for (let i = amtSame; i < splitB.length; i++) {
            if (splitB[i] === '.') {
                combinedStr += '.';
            }
            combinedStr += ' ' + splitB[i];
        }
        if (combinedStr.charAt(combinedStr.length - 1) != '.') {
            combinedStr += '.';
        }

        return ' ' + capitalizeFirstLetter(combinedStr);
    }
    // otherwise return array containing the two strings.
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

    for (let i = 0; i < stringArr.length; i++) {
        // have to add space at beginning of first string to make comparison work.
        if (i == stringArr.length - 1) tempComb = stringArr[i] + '.';
        else if (i === 0) {
            tempComb = compare(
                ' ' + capitalizeFirstLetter(stringArr[0]),
                stringArr[1],
                n
            );
        } else tempComb = compare(stringArr[i], stringArr[i + 1], n);
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
