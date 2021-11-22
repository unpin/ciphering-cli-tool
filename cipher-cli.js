import { pipeline } from 'stream';
import { parser as argParser } from './src/arg-parser/parser.js';
import parseConfig from './src/config/parseConfig.js';
import * as createStream from './src/streams/createStream.js';
import ExitCodeConstants from './src/errors/ExitCodeConstants.js';
import IOError from './src/errors/io/IOError.js';
import ArgumentError from './src/errors/arguments/ArgumentError.js';
import InvalidConfigError from './src/errors/config/InvalidConfigError.js';

const supportedOptions = [
    {
        name: 'config',
        aliases: ['config', 'c'],
        required: true,
        description: 'Ciphering pipeline configuration.',
    },
    {
        name: 'input',
        aliases: ['input', 'i'],
        required: false,
        description: 'Path to input file.',
    },
    {
        name: 'output',
        aliases: ['output', 'o'],
        required: false,
        description: 'Path to output file.',
    },
];

function app(args, supportedOptions) {
    try {
        const streamArray = [];
        const { config, input, output } = argParser(args, {
            supportedOptions,
        });
        const transformStreams = parseConfig(config);
        streamArray.push(
            createStream.createFileInputStream(input, process.stdin)
        );
        streamArray.push(...transformStreams);
        streamArray.push(
            createStream.createFileOutputStream(output, process.stdout)
        );
        pipeline(...streamArray, pipelineErrorHandler);
    } catch (error) {
        console.error(error.message);
        if (
            error instanceof ArgumentError ||
            error instanceof InvalidConfigError
        ) {
            process.exitCode =
                error.errorCode ?? ExitCodeConstants.INVALID_ARGUMENT;
        } else {
            process.exitCode = ExitCodeConstants.UNKNOWN_ERROR;
        }
    }
}

function pipelineErrorHandler(error) {
    if (!error) return;
    console.error(error.message);
    if (error instanceof IOError) {
        process.exitCode =
            error.errorCode ?? ExitCodeConstants.INVALID_ARGUMENT;
    } else {
        process.exitCode = ExitCodeConstants.UNKNOWN_ERROR;
    }
}

const args = process.argv.slice(2);
app(args, supportedOptions);
