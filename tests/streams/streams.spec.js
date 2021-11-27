import fs from 'fs/promises';
import {
    createFileInputStream,
    createFileOutputStream,
} from '../../src/streams/createStream.js';
import FileReader from '../../src/streams/FileReader.js';
import FileWriter from '../../src/streams/FileWriter.js';

const inputFile = './tests/test-input.txt';
const outputFile = './tests/test-output.txt';

describe('FileReader', () => {
    it('should read data from provided text file', (done) => {
        const reader = new FileReader(inputFile);
        let data = '';
        reader.on('data', (chunk) => {
            data += chunk;
        });

        reader.on('close', () => {
            expect(data).toBe('AZaz');
            done();
        });
    });

    it('should throw if provided file does not exist', (done) => {
        const reader = new FileReader('does-not-exist.txt');
        reader.on('data', () => {});
        reader.on('error', (error) => {
            expect(error.message).toMatch('does not exist');
            done();
        });
    });
});

describe('FileWriter', () => {
    it('should throw if provided destination file does not exist', () => {
        const writer = new FileWriter('does-not-exist.txt');
        writer.on('error', (error) => {
            expect(error.message).toMatch('does not exist');
        });
    });
    it('should write content to provided output file', async () => {
        const writer = new FileWriter(outputFile);
        await fs.truncate(outputFile);
        writer.write('brown little fox');
        writer.on('close', () => {
            const reader = new FileReader(outputFile);
            reader.on('data', (data) => {
                expect(data).toBe('brown little fox');
            });
        });
    });
});

describe('createStream()', () => {
    it('should create an instance of FileReader', () => {
        const fileReader = createFileInputStream(inputFile);
        expect(fileReader).toBeInstanceOf(FileReader);
    });

    it('should create an instance of FileWriter', () => {
        const fileWriter = createFileOutputStream(outputFile);
        expect(fileWriter).toBeInstanceOf(FileWriter);
    });

    it('should return a reference to stdin if input file is not provided', () => {
        const fileReader = createFileInputStream(undefined, process.stdin);
        expect(fileReader).toBe(process.stdin);
    });

    it('should return a reference to stdout if output file is not provided', () => {
        const fileWriter = createFileOutputStream(undefined, process.stdout);
        expect(fileWriter).toBe(process.stdout);
    });
});
