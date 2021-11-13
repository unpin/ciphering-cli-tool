export default class IOError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = 'IOError';
        this.errorCode = errorCode;
    }
}
