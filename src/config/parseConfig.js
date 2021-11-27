import CaesarTransform from '../transforms/CaesarTransform.js';
import AtbashTransform from '../transforms/AtbashTransform.js';
import ROT8Transform from '../transforms/ROT8Transform.js';
import validateConfig from './validateConfig.js';

export default function parseConfig(cipherConfig) {
    const ciphers = [];
    validateConfig(cipherConfig);
    const options = cipherConfig.split('-');
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
        }
    }
    return ciphers;
}
