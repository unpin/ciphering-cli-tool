import { Transform } from 'stream';
import { shiftLetter } from '../utils/string.js';

export default class ROT8Transform extends Transform {
    constructor(isEncoding) {
        super();
        this.shift = 8;
        this.isEncoding = isEncoding;
    }
    _transform(chunk, encoding, callback) {
        const shift = this.isEncoding ? this.shift : -this.shift;
        const transformed = chunk
            .toString()
            .split('')
            .map((char) => shiftLetter(char, shift))
            .join('');
        this.push(transformed, 'utf-8');
        callback();
    }
}
