import { Readable, Writable, pipeline } from 'stream';
import { jest } from '@jest/globals';
import AtbashTransform from '../../src/transforms/AtbashTransform.js';
import CaesarTransform from '../../src/transforms/CaesarTransform.js';
import ROT8Transform from '../../src/transforms/ROT8Transform.js';
import * as stringModule from '../../src/utils/string.js';

class CharReader extends Readable {
    constructor(string) {
        super();
        this.string = string;
        this.index = 0;
    }
    _read(_) {
        if (this.index < this.string.length) {
            this.push(this.string[this.index]);
            this.index++;
        } else {
            this.push(null);
        }
    }
}

class StringStorage extends Writable {
    constructor() {
        super({ highWaterMark: 1024 });
        this.data = '';
    }
    _write(chunk, encoding, callback) {
        this.data += chunk;
        callback();
    }
}

describe('AtbashTransform', () => {
    test('shift should be called once for every Latin letter', () => {
        const mirrorLetterMock = jest.spyOn(stringModule, 'mirrorLetter');
        pipeline(
            new CharReader('AZazАЯая'),
            new AtbashTransform(),
            new StringStorage(),
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('ZAzaАЯая');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
        expect(mirrorLetterMock).toHaveBeenCalledTimes(4);
        // mirrorLetterMock.mockRestore();
    });

    it('should return a string with Latin chars mirrored', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZazАЯая'),
            new AtbashTransform(),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('ZAzaАЯая');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });

    it('should not change non-Latin chars', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('你好'),
            new AtbashTransform(),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('你好');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });
});

describe('CaesarTransform', () => {
    it('should return a string with Latin chars shifted forward by 1', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZaz'),
            new CaesarTransform(true),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('BAba');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });

    it('should return a string with Latin chars shifted backwards by 1', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZaz'),
            new CaesarTransform(false),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('ZYzy');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });
});

describe('ROT8Transform', () => {
    it('should return a string with Latin chars shifted forward by 8', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZaz'),
            new ROT8Transform(true),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toBe('IHih');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });

    it('should return a string with Latin chars shifted backwards by 8', (done) => {
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZaz'),
            new ROT8Transform(false),
            storage,
            (error) => {
                try {
                    expect(error).toBeUndefined();
                    expect(storage.data).toMatch('SRsr');
                    done();
                } catch (error) {
                    done(error);
                }
            }
        );
    });
});
