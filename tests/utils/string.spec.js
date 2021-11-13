import {
    isUpperCase,
    isLetter,
    mirrorLetter,
    shiftLetter,
} from '../../src/utils/string.js';

describe('isUppercase() function', () => {
    test('should return true if passed char is uppercase', () => {
        expect(isUpperCase('A')).toBe(true);
    });

    test('should return false if passed char is not uppercase', () => {
        expect(isUpperCase('a')).toBe(false);
    });
});

describe('isLetter() function', () => {
    test('should return true if passed char is a letter', () => {
        expect(isLetter('a')).toBe(true);
    });

    test('should return false if passed char is not a letter', () => {
        expect(isLetter('1')).toBe(false);
    });
});

describe('mirrorLetter() function', () => {
    test('should mirror alphabet letter from A to Z', () => {
        expect(mirrorLetter('A')).toBe('Z');
    });

    test('should mirror alphabet letter from Z to A', () => {
        expect(mirrorLetter('Z')).toBe('A');
    });

    test('should return the same char if not letter', () => {
        expect(mirrorLetter('$')).toBe('$');
    });

    test('should return a mirrored lowercase letter when lowercase letter is being mirrored', () => {
        expect(mirrorLetter('a', 1)).toBe('z');
    });
});

describe('shiftLetter() function', () => {
    test('should shift a letter by one position', () => {
        expect(shiftLetter('A', 1)).toBe('B');
    });

    test('should shift a letter by two positions', () => {
        expect(shiftLetter('A', 2)).toBe('C');
    });

    test('shifting the last letter of the alphabet by one should return "A"', () => {
        expect(shiftLetter('Z', 1)).toBe('A');
    });

    test('should return a shifted lowercase letter when lowercase letter is being shifted', () => {
        expect(shiftLetter('a', 1)).toBe('b');
    });

    test('return the same char if not letter', () => {
        expect(shiftLetter('$', 1)).toBe('$');
    });

    test('should work with negative shifts', () => {
        expect(shiftLetter('A', -1)).toBe('Z');
    });
});
