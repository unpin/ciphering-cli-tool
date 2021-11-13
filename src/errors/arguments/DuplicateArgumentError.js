import ArgumentError from './ArgumentError.js';

export default class DuplicateArgumentError extends ArgumentError {
    constructor(errorMessage, errorCode) {
        super(errorMessage, errorCode);
        this.name = 'DuplicateArgumentError';
    }
}
