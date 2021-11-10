export function parser(args, { supportedOptions } = {}) {
    function parse(args) {
        const optionMap = new Map();

        for (let i = 0; i < args.length; ) {
            const option = args[i++];
            const value = args[i++];

            if (!isOptionValid(option)) {
                throw new Error(`Option ${option} is not valid.`);
            }

            let optionName = removeDashes(option);

            if (supportedOptions) {
                if (!isOptionSupported(optionName)) {
                    throw new Error(`Option ${option} is not supported.`);
                }
                optionName = getSupportedOptionName(option);
            }

            if (optionMap.has(optionName)) {
                throw new Error(`Option ${option} is duplicated.`);
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
                throw new Error(
                    `Option ${option.name} [${option.aliases}] is required but not provided.`
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
