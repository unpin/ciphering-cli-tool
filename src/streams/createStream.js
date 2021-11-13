import FileReader from './FileReader.js';
import FileWriter from './FileWriter.js';

export function createFileInputStream(filename, defaultStream) {
    if (filename) {
        return new FileReader(filename);
    }
    return defaultStream;
}

export function createFileOutputStream(filename, defaultStream) {
    if (filename) {
        return new FileWriter(filename);
    }
    return defaultStream;
}
