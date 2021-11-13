import CaesarTransform from '../transforms/CaesarTransform.js';
import AtbashTransform from '../transforms/AtbashTransform.js';
import ROT8Transform from '../transforms/ROT8Transform.js';
import InvalidConfigError from '../errors/config/InvalidConfigError.js';

const ENCODING_FLAG_REGEX = /^[0-1]$/;
const SUPPORTED_TRANSFORM_STREAMS = [
    {
        className: 'CaesarTransform',
        class: CaesarTransform,
        cipherChar: 'C',
        encodingFlagRequired: true,
    },
    {
        className: 'AtbashTransform',
        class: AtbashTransform,
        cipherChar: 'A',
        encodingFlagRequired: false,
    },
    {
        className: 'ROT8Transform',
        class: ROT8Transform,
        cipherChar: 'R',
        encodingFlagRequired: true,
    },
];

export default function validateConfig(optionsArray) {
    for (const option of optionsArray) {
        const [cipherChar, encodingFlag, ...rest] = option;
        if (rest.length > 0)
            throw new InvalidConfigError(`Invalid cipher config: ${option}.`);
        if (!cipherChar)
            throw new InvalidConfigError(
                'Invalid configuration string provided.'
            );

        const cipher = SUPPORTED_TRANSFORM_STREAMS.find(
            (c) => c.cipherChar === cipherChar
        );
        if (!cipher) {
            throw new InvalidConfigError(
                `Cipher ${cipherChar} is not supported.`
            );
        }

        if (cipher.encodingFlagRequired) {
            if (!encodingFlag) {
                throw new InvalidConfigError(
                    `Cipher ${cipher.className} requires an encoding flag.`
                );
            }
            if (!encodingFlag.match(ENCODING_FLAG_REGEX)) {
                throw new InvalidConfigError(
                    `Invalid encoding flag ${option}.`
                );
            }
        } else {
            if (encodingFlag) {
                throw new InvalidConfigError(
                    `Cipher ${cipher.className} does not require an encoding flag.`
                );
            }
        }
    }
}
