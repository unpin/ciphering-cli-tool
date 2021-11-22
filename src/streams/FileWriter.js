import { Writable } from 'stream';
import fs from 'fs';
import ExitCodeConstants from '../errors/ExitCodeConstants.js';
import IOError from '../errors/io/IOError.js';
import FileNotFoundError from '../errors/io/FileNotFoundError.js';

export default class FileWriterStream extends Writable {
    constructor(filename) {
        super();
        this.filename = filename;
    }

    _construct(callback) {
        fs.stat(this.filename, (err, stats) => {
            if (err) {
                return callback(
                    new FileNotFoundError(
                        `Provided destination file "${this.filename}" does not exist.`,
                        ExitCodeConstants.INVALID_ARGUMENT
                    )
                );
            }
            fs.open(this.filename, 'a', (err, fd) => {
                if (err) {
                    callback(
                        new IOError(
                            `Could not open the file. "${this.filename}"`,
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

    _write(chunk, encoding, callback) {
        fs.write(this.fd, chunk, callback);
    }

    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }

    _final(callback) {
        fs.write(this.fd, '\n', callback);
    }
}
