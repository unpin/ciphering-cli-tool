import fs from 'fs/promises';
import { spawn, exec } from 'child_process';

function createProcess(processPath, args = []) {
    args = [processPath].concat(args);
    return spawn('node', args);
}

function execute(processPath, args = []) {
    const childProcess = createProcess(processPath, args);
    childProcess.stdin.setEncoding('utf-8');
    const promise = new Promise((resolve, reject) => {
        childProcess.stderr.once('data', (err) => {
            reject(err.toString());
        });
        childProcess.on('error', reject);
        childProcess.stdout.once('data', (data) => {
            resolve(data.toString());
        });
        childProcess.on('close', () => {
            resolve();
        });
    });
    return promise;
}

describe('Ciphering CLI tool - Success scenarios', () => {
    const inputFile = './tests/test-input.txt';
    const outputFile = './tests/test-output.txt';

    beforeEach(async () => {
        await fs.truncate('./tests/test-output.txt');
    });

    it('should print encrypted string to stdout if -o option is not provided', async () => {
        const args = ['-c', 'C1', '-i', inputFile];
        try {
            const data = await execute('./index.js', args);
            expect(data).toMatch(/BAba/);
        } catch (error) {}
    });

    it('should write encrypted data from provided -i file to provided -o file', async () => {
        const args = ['-c', 'C1', '-i', inputFile, '-o', outputFile];
        await execute('./index.js', args);
        const output = await fs.readFile(outputFile, 'utf-8');
        expect(output).toMatch(/BAba/);
    });
});

describe('Ciphering CLI tool - Error scenarios', () => {
    it('should exit with error message when duplicate option provided', async () => {
        const args = ['-c', 'C1', '-c', 'R0'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/-c is duplicated/);
        }
    });

    it('should exit with error message when required option -c is not provided', async () => {
        const args = [];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/"--config" option is required/);
        }
    });

    it('should exit with error message invalid configuration string provided', async () => {
        const args = ['-c', 'C1_A_R1'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/Invalid config format/);
        }
    });

    it('should exit with error message if cipher is not supported', async () => {
        const args = ['-c', 'X'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/Cipher X is not supported/);
        }
    });

    it('should exit with error message if encryption flag is not provided when required', async () => {
        const args = ['-c', 'C'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(
                /Cipher CaesarTransform requires an encoding flag./
            );
        }
    });

    it('should exit with error message if encryption flag is provided when not required', async () => {
        const args = ['-c', 'A1'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(
                /Cipher AtbashTransform does not require an encoding flag./
            );
        }
    });

    it('should exit with error message when provided path for input stream does not exist', async () => {
        const args = ['-c', 'C1', '-i', 'does-not-exist.txt'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/"does-not-exist.txt" does not exist/);
        }
    });

    it('should exit with error message when provided path for output stream does not exist', async () => {
        const args = ['-c', 'C1', '-o', 'does-not-exist.txt'];
        try {
            await execute('./index.js', args);
        } catch (error) {
            expect(error).toMatch(/"does-not-exist.txt" does not exist/);
        }
    });
});
