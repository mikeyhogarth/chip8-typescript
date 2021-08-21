import { IOpcodeArgs, OpcodeMneumonic, opcodes } from "./opcodes";
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

  // load stuff into memory
  load: (data: Uint8ClampedArray) => void;

  // the interchangable IO interface
  getIo: () => IOInterface;

  // FDE cycle
  fetch: () => number;
  decode: (opcode: number) => {
    opcode: OpcodeMneumonic;
    args: IOpcodeArgs;
  };
  execute: () => void;
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
    // fetch-decode-execute cycle -> https://en.wikipedia.org/wiki/Instruction_cycle
    // CUPs always have these.
    fetch,
    decode,
    execute,
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

/**
 *
 * @param opcode
 */
function decode(opcode: number): {
  opcode: OpcodeMneumonic;
  args: IOpcodeArgs;
} {
  // An opcode in chip8 is represented by a "word" (a.k.a 16 bits, 2 bytes or 4 hex digits)
  // the way chip8 works is that there are "patterns" within the hex codes. For example,
  // the opcode for loading a value into a register is 6xkk, where the "x" is the register number
  // and the "kk" is the value (two hexes, so a byte) to load into it - meaning that an opcode
  // of "6E10" would load the value "10" into register "E".
  //
  // So we therefore need a way to;
  // 1- detect which opcode "fired"
  // 2- figure out the arguments
  throw new Error("Not Implemented");
}

function execute() {
  throw new Error("Not Implemented");
}
