import { Transform } from 'stream';
import { mirrorLetter } from '../utils/string.js';

export default class AtbashTransform extends Transform {
    constructor() {
        super();
    }
    _transform(chunk, encoding, callback) {
        const transformed = chunk
            .toString()
            .split('')
            .map(mirrorLetter)
            .join('');
        this.push(transformed, 'utf-8');
        callback();
    }
}
