export default class InvalidConfigError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.name = 'InvalidConfigError';
        this.errorCode = errorCode;
    }
}
