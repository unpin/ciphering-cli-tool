import { pipeline } from 'stream';
import { parser as argParser } from './src/arg-parser/parser.js';
import parseConfig from './src/config/parseConfig.js';
import FileReader from './src/streams/FileReader.js';
import FileWriter from './src/streams/FileWriter.js';
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

function app(args) {
    try {
        const streamArray = [];
        const { config, input, output } = argParser(args, {
            supportedOptions,
        });
        const transformStreams = parseConfig(config);
        if (input) {
            streamArray.push(new FileReader(input));
        } else {
            streamArray.push(process.stdin);
            console.log('Enter text:');
        }
        streamArray.push(...transformStreams);
        if (output) {
            streamArray.push(new FileWriter(output));
        } else {
            streamArray.push(process.stdout);
        }
        pipeline(...streamArray, pipelineErrorHandler);
    } catch (error) {
        pipelineErrorHandler(error);
    }
}

function pipelineErrorHandler(error) {
    if (!error) return;
    if (
        error instanceof IOError ||
        error instanceof ArgumentError ||
        error instanceof InvalidConfigError
    ) {
        console.error(error.message);
        process.exitCode =
            error.errorCode || ExitCodeConstants.INVALID_ARGUMENT;
    } else {
        console.error(error);
        process.exitCode = ExitCodeConstants.UNKNOWN_ERROR;
    }
}

const args = process.argv.slice(2);
app(args);
