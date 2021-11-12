<h1 align="center">Ciphering CLI Tool</h1>

## Description

Ciphering CLI Tool provides the easiest way to protect valuable information. Comes with the most sophisticated, secure encryption algorithms out of the box, including:

-   <b>Caesar Cipher</b> Powerful, "unbreakable” encryption algorithm used by Julius Caesar himself to communicate with his allies, keeping the valuable information safe from prying eyes.
-   <b>Atbash</b> Simple, blazingly fast, yet secure.
-   <b>ROT8</b> A modern, state-of-the-art algorithm, which is the next iteration of <b>Caesar Cipher</b>, for those who want to get their security to the next level.

## Options

```
Options

-c, --config            [Required] Configuration string with the            [string]
                        pattern "XY-XY" where "X" stands for the cipher
                        and "Y" for the encoding/decoding.

                        "X" can be one of the following:
                            "C" is the Caesar cipher
                            "A" is the Atbash cipher
                            "R" is the ROT-8 cipher

                        "Y" can either be:
                            "0" for decoding information, or
                            "1" for encoding information.
                        Note: "Y" flag must not be provided
                        for "A" cipher.

-i, --input             [Optional] Source for readable stream.              [string]
                        Note: process.stdin will be used as the underlying
                        resource if not provided.

-o, --output            [Optional] Destination for writable stream.         [string]
                        Note: process.stdout will be used as the
                        output destination if not provided.
```

## Usage

### Example

```bash
node cipher-cli.js -c "C1-A-R0" -i ./path/to/file -o ./path/to/file
node cipher-cli.js -c "C1-A-R0" -i ./path/to/file
node cipher-cli.js -c "C1-A-R0" -o ./path/to/file
node cipher-cli.js -c "C0-R1-A"
```

> Note: `-c [--config]` option is <b>required</b>, the application will be terminated with a non-zero exit status if not provided. `-i [--input]` and `-o [--output]` are optional and standard `process.stdin` and `process.stdout` streams will be used instead if respective options are not provided.

## Supported Node.js Versions

16.13.0 LTS and above.
