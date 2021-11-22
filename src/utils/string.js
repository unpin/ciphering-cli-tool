export function isUpperCase(ch) {
    return ch.toUpperCase() === ch;
}

export function isLetter(symbol) {
    const charCode = symbol.charCodeAt(0);
    return (
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)
    );
}

export function mirrorLetter(char) {
    if (!isLetter(char)) return char;
    let charCode = char.toUpperCase().charCodeAt(0);
    let mirroredChar = String.fromCharCode(90 + 65 - charCode);
    return isUpperCase(char) ? mirroredChar : mirroredChar.toLowerCase();
}

export function shiftLetter(char, shift) {
    if (!isLetter(char)) return char;
    shift = shift % 26;
    const charCode = char.toUpperCase().charCodeAt(0);
    let shiftedCharCode = charCode + shift;
    if (shiftedCharCode > 90) {
        shiftedCharCode = shiftedCharCode - 26;
    } else if (shiftedCharCode < 65) {
        shiftedCharCode = shiftedCharCode + 26;
    }
    if (isUpperCase(char)) {
        return String.fromCharCode(shiftedCharCode);
    }
    return String.fromCharCode(shiftedCharCode).toLowerCase();
}
