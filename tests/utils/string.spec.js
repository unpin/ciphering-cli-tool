import { jest } from '@jest/globals';
import * as string from '../../src/utils/string.js';

describe('isUppercase() function', () => {
    test('should return true if passed char is uppercase', () => {
        const isUpperCaseMock = jest.spyOn(string, 'isUpperCase');
        const mockResult = isUpperCaseMock('A');
        expect(mockResult).toBeTruthy();
    });

    test('should return false if passed char is not uppercase', () => {
        const isUpperCaseMock = jest.spyOn(string, 'isUpperCase');
        const mockResult = isUpperCaseMock('a');
        expect(mockResult).toBeFalsy();
    });
});

describe('isLetter() function', () => {
    test('should return true if passed char is a letter', () => {
        expect(string.isLetter('a')).toBeTruthy();
    });

    test('should return false if passed char is not a letter', () => {
        expect(string.isLetter('1')).toBeFalsy();
    });
});

describe('mirrorLetter() function', () => {
    test('should mirror alphabet letter from A to Z', () => {
        expect(string.mirrorLetter('A')).toBe('Z');
    });

    test('should mirror alphabet letter from Z to A', () => {
        expect(string.mirrorLetter('Z')).toBe('A');
    });

    test('should return the same char if not letter', () => {
        expect(string.mirrorLetter('$')).toBe('$');
    });

    test('should return a mirrored lowercase letter when lowercase letter is being mirrored', () => {
        expect(string.mirrorLetter('a', 1)).toBe('z');
    });
});

describe('shiftLetter() function', () => {
    test('should shift a letter by one position', () => {
        expect(string.shiftLetter('A', 1)).toBe('B');
    });

    test('should shift a letter by two positions', () => {
        expect(string.shiftLetter('A', 2)).toBe('C');
    });

    test('shifting the last letter of the alphabet by one should return "A"', () => {
        expect(string.shiftLetter('Z', 1)).toBe('A');
    });

    test('should return a shifted lowercase letter when lowercase letter is being shifted', () => {
        expect(string.shiftLetter('a', 1)).toBe('b');
    });

    test('return the same char if not letter', () => {
        expect(string.shiftLetter('$', 1)).toBe('$');
    });

    test('should work with negative shifts', () => {
        expect(string.shiftLetter('A', -1)).toBe('Z');
    });
});
