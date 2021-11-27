import parseConfig from '../../src/config/parseConfig.js';
import CaesarTransform from '../../src/transforms/CaesarTransform.js';
import AtbashTransform from '../../src/transforms/AtbashTransform.js';
import ROT8Transform from '../../src/transforms/ROT8Transform.js';
import InvalidConfigError from '../../src/errors/config/InvalidConfigError.js';

describe('parseConfig()', () => {
    it('should parse configuration string and return an array of transform streams in the right order', () => {
        const config = parseConfig('C1-A-R1');
        expect(config.length).toBe(3);
        expect(config[0]).toBeInstanceOf(CaesarTransform);
        expect(config[1]).toBeInstanceOf(AtbashTransform);
        expect(config[2]).toBeInstanceOf(ROT8Transform);
    });

    it('should throw InvalidConfigError invalid configuration string provided', () => {
        expect(() => parseConfig('1337')).toThrowError(InvalidConfigError);
    });

    it('should throw InvalidConfigError if cipher is unsupported', () => {
        expect(() => parseConfig('X')).toThrowError(InvalidConfigError);
        expect(() => parseConfig('X-A')).toThrowError(InvalidConfigError);
    });

    it('should throw InvalidConfigError if encoding flag is not provided when required', () => {
        expect(() => parseConfig('C')).toThrowError(InvalidConfigError);
        expect(() => parseConfig('R')).toThrowError(InvalidConfigError);
    });

    it('should throw InvalidConfigError if encoding flag other that 0 or 1 provided', () => {
        expect(() => parseConfig('C4')).toThrowError(InvalidConfigError);
        expect(() => parseConfig('R7')).toThrowError(InvalidConfigError);
    });

    it('should throw InvalidConfigError if encoding flag is provided when not required', () => {
        expect(() => parseConfig('A0')).toThrowError(InvalidConfigError);
        expect(() => parseConfig('A1')).toThrowError(InvalidConfigError);
    });
});
