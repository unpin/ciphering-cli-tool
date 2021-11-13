import IOError from './IOError.js';

export default class FileNotFoundError extends IOError {
    constructor(message, errorCode) {
        super(message, errorCode);
        this.name = 'FileNotFoundError';
    }
}
