import { Readable, Writable, pipeline } from 'stream';
import AtbashTransform from '../../src/transforms/AtbashTransform.js';
import CaesarTransform from '../../src/transforms/CaesarTransform.js';
import ROT8Transform from '../../src/transforms/ROT8Transform.js';

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
    it('should call mirrorLetter for every Latin letter', (done) => {
        const mirrorLetterMock = jest.spyOn(string, 'mirrorLetter');
        mirrorLetterMock.mockImplementation((letter) => letter + letter);
        const storage = new StringStorage();
        pipeline(
            new CharReader('AZazАЯая'),
            new AtbashTransform(),
            storage,
            (error) => {
                expect(mirrorLetterMock).toHaveBeenCalled();
                mirrorLetterMock.mockRestore();
                done();
            }
        );
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
