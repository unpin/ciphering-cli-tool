import { parser } from '../../src/arg-parser/parser.js';
import ArgumentError from '../../src/errors/arguments/ArgumentError.js';
import InvalidOptionError from '../../src/errors/arguments/InvalidOptionError.js';
import DuplicateArgumentError from '../../src/errors/arguments/DuplicateArgumentError.js';

describe('parser', () => {
    it('should parse args and return an object with correct key/value pairs', () => {
        const args = parser([
            '--config',
            'C1-A-R1',
            '--input',
            'input.txt',
            '--output',
            'output.txt',
        ]);
        expect(args).toEqual({
            config: 'C1-A-R1',
            input: 'input.txt',
            output: 'output.txt',
        });
    });

    it('should throw InvalidOptionError if an invalid option provided', () => {
        expect(() => {
            parser(['option-with-no-dashes']);
        }).toThrowError(InvalidOptionError);
    });

    it('should throw ArgumentError if value for an option is not provided', () => {
        expect(() => {
            parser(['--option', '--another-option']);
        }).toThrowError(ArgumentError);

        expect(() => {
            parser(['--option']);
        }).toThrowError(ArgumentError);
    });

    it('should throw DuplicateArgumentError if an argument is provided twice', () => {
        expect(() => {
            parser(['--config', 'C1-A-R1', '--config', 'C0-A-R0']);
        }).toThrowError(DuplicateArgumentError);
    });

    it('should throw InvalidOptionError if provided option is not supported', () => {
        const supportedOptions = [
            {
                name: 'config',
                aliases: ['config', 'c'],
            },
        ];
        expect(() => {
            parser(['--config', 'value', '--not-supported-option', 'value'], {
                supportedOptions,
            });
        }).toThrowError(InvalidOptionError);
    });

    it('should throw ArgumentError if required option is not provided', () => {
        const supportedOptions = [
            {
                name: 'config',
                aliases: ['config', 'c'],
                required: true,
            },
            {
                name: 'output',
                aliases: ['output', 'o'],
                required: true,
            },
        ];
        expect(() => {
            parser(['--output', 'value'], {
                supportedOptions,
            });
        }).toThrowError(ArgumentError);
    });
});
