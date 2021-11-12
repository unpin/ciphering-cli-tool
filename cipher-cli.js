import { pipeline } from 'stream';
import { parser as argParser } from './src/arg-parser/parser.js';
import parseConfig from './src/config/parseConfig.js';
import FileReader from './src/streams/FileReader.js';
import FileWriter from './src/streams/FileWriter.js';

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
    const { config, input, output, help } = argParser(args, {
        supportedOptions,
    });
    const streamArray = [];
    const transformStreams = parseConfig(config);
    try {
        if (input) {
            streamArray.push(new FileReader(input));
        } else {
            streamArray.push(process.stdin);
        }
        streamArray.push(...transformStreams);
        if (output) {
            streamArray.push(new FileWriter(output));
        } else {
            streamArray.push(process.stdout);
        }
    } catch (error) {
        pipelineErrorHandler(error);
    }

    pipeline(...streamArray, pipelineErrorHandler);
}

function pipelineErrorHandler(err) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
app(args);
