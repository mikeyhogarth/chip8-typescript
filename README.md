# CHIP8 Typescript

An implementation of a [CHIP8 interpreter](https://en.wikipedia.org/wiki/CHIP-8), written entirely in TypeScript.

![npm](https://img.shields.io/npm/v/typescript-chip8)
![NPM](https://img.shields.io/npm/l/typescript-chip8)
[![Build Status](https://app.travis-ci.com/mikeyhogarth/chip8-typescript.svg?branch=main)](https://app.travis-ci.com/mikeyhogarth/chip8-typescript)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/52a13e41759a4d6a94b5000386df4464)](https://www.codacy.com/gh/mikeyhogarth/chip8-typescript/dashboard?utm_source=github.com&utm_medium=referral&utm_content=mikeyhogarth/chip8-typescript&utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/mikeyhogarth/chip8-typescript/badge.svg?branch=main)](https://coveralls.io/github/mikeyhogarth/chip8-typescript?branch=main)


## Installation
Install using NPM;
```
npm i typescript-chip8
```

## Usage

```javascript
  import { createCpu } from "typescript-chip8";
  let cpu = createCpu();

  // Roms are buffers of big-endian 2-byte instructions. You can hard code these...
  const rom = Buffer.from([0x60, 0xaa, 0x61, 0xbb, 0x62, 0xcc]);
  /*
  // Or fetch from a remote source somewhere...
  const rom = await fetch(`http://example.com/roms/HelloWorld.ch8`)
    .then((r) => r.arrayBuffer())
    .then((data) => new Uint8Array(data));
  */
  cpu.load(rom);

  // perform 1 CPU cycle (you could put this in a loop/interval to "run" the cpu forever) 
  cpu.cycle();
```

## Tests
This emulator is 100% unit tested and covered. Run tests with either of the following;
```
npm run test
npm run test -- --watch
```

## Thank you

This would not have been possible if not for these excellent guides;

- [Cowgod's Chip-8 Technical Reference v1.0](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM) - the main source I used when building this emulator. Covers every opcode.
- [Tania Rasca's emulator guide](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/) - this guide is absolutely amazing and without access to Tania's code to check I was doing things correctly, I probably would not have completed this project.
- [David Winter's Chip8 page](http://www.pong-story.com/chip8/) - David is the author of many chip8 roms as well as one of the earliest emulators.
