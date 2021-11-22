export default class ArgumentError extends Error {
    constructor(errorMessage, errorCode) {
        super(errorMessage);
        this.name = 'ArgumentError';
        this.errorCode = errorCode;
    }
}
