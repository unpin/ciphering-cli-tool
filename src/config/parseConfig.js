import CaesarTransform from '../transforms/CaesarTransform.js';
import AtbashTransform from '../transforms/AtbashTransform.js';
import ROT8Transform from '../transforms/ROT8Transform.js';
import validateConfig from './validateConfig.js';
import InvalidOptionError from '../errors/arguments/InvalidOptionError.js';
import ExitCodeConstants from '../errors/ExitCodeConstants.js';

export default function parseConfig(cipherConfig) {
    const ciphers = [];
    const options = cipherConfig.split('-');
    validateConfig(options);
    for (const option of options) {
        const [cipherChar, encodingFlag] = option;
        switch (cipherChar) {
            case 'C':
                ciphers.push(
                    new CaesarTransform(Boolean(Number(encodingFlag)))
                );
                break;
            case 'A':
                ciphers.push(new AtbashTransform());
                break;
            case 'R':
                ciphers.push(new ROT8Transform(Boolean(Number(encodingFlag))));
                break;
            default:
                throw new InvalidOptionError(
                    `Cipher "${cipherChar}" is not supported.`,
                    ExitCodeConstants.INVALID_ARGUMENT
                );
        }
    }
    return ciphers;
}
