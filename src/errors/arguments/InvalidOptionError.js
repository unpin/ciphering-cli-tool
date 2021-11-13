import ArgumentError from './ArgumentError.js';

export default class InvalidOptionError extends ArgumentError {
    constructor(message, errorCode) {
        super(message, errorCode);
        this.name = 'InvalidOptionError';
    }
}
