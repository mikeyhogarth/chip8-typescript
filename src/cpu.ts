import { opcodes, IOpcode, IOpcodeArgs } from "./opcodes";
import { IOInterface } from "./io";
import { createMemoryIO } from "./io/memory.io";

const MEMORY_START = 0x200;

/*
 * Tech spec:
 * http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
 */
export interface ICpu {
  stack: Uint16Array;
  memory: Uint8ClampedArray;
  registers: Uint8ClampedArray;
  pc: number;
  sp: number;
  delayTimer: number;
  soundTimer: number;

  // the interchangable IO interface
  getIo: () => IOInterface;

  // ...
  fetch: () => number;
  load: (data: Uint8ClampedArray) => void;
}

/**
 * @returns a freshly initialised CHIP8 CPU
 * Remember:
 * 1 word = 16 bits = 4 hex digits
 * 1 byte = 8 bits = 2 hex digits
 * 1 nibble = 4 bits = 1 hex digit
 */
export function createCpu(io: IOInterface = createMemoryIO()): ICpu {
  return {
    // 4096 8-bit data registers
    memory: new Uint8ClampedArray(0x1000),
    // 16 8-bit data registers named V0 to VF
    registers: new Uint8ClampedArray(0x10),
    // 16 x 16 bit values for the stack
    stack: new Uint16Array(0x10),
    // 16 bit program counter (which starts at 0x200 due to chip8 interpreter taking up the first 512 bytes)
    pc: MEMORY_START,
    // 16 bit stack pointer
    sp: -1,
    // 16 bit delay and sound timers
    soundTimer: 0,
    delayTimer: 0,
    // load data into memory
    load,
    // fetch
    fetch,
    // the IO interface (in memory by default)
    getIo: () => io,
  };
}

function load(this: ICpu, data: Uint8ClampedArray) {
  data.forEach((d, i) => {
    this.memory[MEMORY_START + i] = d;
  });
}

/**
 *
 * @param this the CPU executing the instruction
 * @param opcode the instruction to execute
 * @param args the arguments to execute
 */
function fetch(this: ICpu): number {
  // fetch the next opcode - each chunk of memory holds a byte (8 bits or 2 hex digits) but
  // the opcodes take up 2 bytes. For this reason, we need to fetch two of them and glue
  // them back together.

  // first thing then - get the byte pointed to by the PC as well as the next byte.
  const chunk1 = this.memory[this.pc];
  const chunk2 = this.memory[this.pc + 1];

  // To combine them, we're going to need to shift the first chunk 1 byte (8 bits) to the left
  // and then add on the second chunk.
  return (chunk1 << 8) + chunk2;
}
