import ExitCodeConstants from '../errors/ExitCodeConstants.js';
import ArgumentError from '../errors/arguments/ArgumentError.js';
import InvalidOptionError from '../errors/arguments/InvalidOptionError.js';
import DuplicateArgumentError from '../errors/arguments/DuplicateArgumentError.js';

export function parser(args, { supportedOptions } = {}) {
    function parse(args) {
        const optionMap = new Map();

        for (let i = 0; i < args.length; ) {
            const option = args[i++];
            const value = args[i++];

            if (!isOptionValid(option)) {
                throw new InvalidOptionError(
                    `Option ${option} is not valid.`,
                    ExitCodeConstants.INVALID_ARGUMENT
                );
            }

            if (!value || value.trim() === '' || isOptionValid(value)) {
                throw new ArgumentError(
                    `Value for option "${option}" is not provided.`,
                    ExitCodeConstants.INVALID_ARGUMENT
                );
            }

            let optionName = removeDashes(option);

            if (supportedOptions) {
                if (!isOptionSupported(optionName)) {
                    throw new InvalidOptionError(
                        `Option ${option} is not supported.`,
                        ExitCodeConstants.INVALID_ARGUMENT
                    );
                }
                optionName = getSupportedOptionName(option);
            }

            if (optionMap.has(optionName)) {
                throw new DuplicateArgumentError(
                    `Option ${option} is duplicated.`,
                    ExitCodeConstants.INVALID_ARGUMENT
                );
            }

            optionMap.set(optionName, value);
        }

        function isOptionSupported(option) {
            return supportedOptions.some((supported) =>
                supported.aliases.includes(option)
            );
        }

        function getSupportedOptionName(option) {
            option = removeDashes(option);
            const supported = supportedOptions.find((supported) =>
                supported.aliases.includes(option)
            );
            return supported.name;
        }

        return optionMap;
    }

    function ensureRequiredOptionsPresent(optionMap) {
        if (!supportedOptions) return;
        const requiredOptions = supportedOptions.filter(
            (option) => option.required
        );

        for (const option of requiredOptions) {
            if (!optionMap.has(option.name)) {
                throw new ArgumentError(
                    `The "--${option.name}" option is required but not provided.`
                );
            }
        }
    }

    const optionMap = parse(args);
    ensureRequiredOptionsPresent(optionMap);
    return Object.fromEntries(optionMap);
}

function isOptionValid(option) {
    const optionRegex = /^(-){1,2}[a-z][a-z0-9_-]*$/;
    return optionRegex.test(option);
}

function removeDashes(option) {
    return option.replace(/^-{1,2}/, '');
}
