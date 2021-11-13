const EXIT_CODES = {
    OK: 0,
    UncaughtFatalException: 1,
    INVALID_ARGUMENT: 9,
    UNKNOWN_ERROR: 255,
};

Object.seal(EXIT_CODES);

export default EXIT_CODES;
