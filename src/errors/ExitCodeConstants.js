const EXIT_CODES = {
    OK: 0,
    UNCAUGHT_EXCEPTION: 1,
    INVALID_ARGUMENT: 9,
    UNKNOWN_ERROR: 255,
};

Object.freeze(EXIT_CODES);
Object.seal(EXIT_CODES);

export default EXIT_CODES;
