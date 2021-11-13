import { Readable } from 'stream';
import fs from 'fs';
import ExitCodeConstants from '../errors/ExitCodeConstants.js';
import IOError from '../errors/io/IOError.js';
import FileNotFoundError from '../errors/io/FileNotFoundError.js';

const defaultOptions = {
    highWaterMark: 1024,
    encoding: 'utf8',
    objectMode: false,
    emitClose: true,
    autoDestroy: true,
};

export default class FileReader extends Readable {
    constructor(filename, options) {
        super(Object.assign({}, defaultOptions, options));
        this.filename = filename;
        this.fd = null;
    }

    _construct(callback) {
        fs.stat(this.filename, (err, stats) => {
            if (err) {
                process.exitCode = 1;
                return callback(
                    new FileNotFoundError(
                        `Provided input file "${this.filename}" does not exist.`,
                        ExitCodeConstants.INVALID_ARGUMENT
                    )
                );
            }
            fs.open(this.filename, (err, fd) => {
                if (err) {
                    process.exitCode = 1;
                    callback(
                        new IOError(
                            `Could not open the file "${this.filename}".`,
                            ExitCodeConstants.INVALID_ARGUMENT
                        )
                    );
                } else {
                    this.fd = fd;
                    callback();
                }
            });
        });
    }

    _read(n) {
        const buffer = Buffer.alloc(n);
        fs.read(this.fd, buffer, 0, n, null, (err, bytesRead) => {
            if (err) {
                this.destroy(
                    new IOError(
                        `Could not read the file "${this.filename}".`,
                        ExitCodeConstants.INVALID_ARGUMENT
                    )
                );
            } else {
                this.push(bytesRead > 0 ? buffer.slice(0, bytesRead) : null);
            }
        });
    }

    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}
