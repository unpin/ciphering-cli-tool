import { Readable } from 'stream';
import fs from 'fs';

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
                return callback(
                    new Error('File does not exist. Try another file.')
                );
            }
            fs.open(this.filename, (err, fd) => {
                if (err) {
                    callback(new Error('Could not open the file. Try again.'));
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
                this.destroy(new Error('Could not read the file.'));
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
