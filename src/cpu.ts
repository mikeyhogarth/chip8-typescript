import { InstructionArgs, InstructionMneumonic } from "./cpu/instructions";
import { fetch, decode, execute } from "./cpu/fde";
import { IOInterface } from "./io";
import { createMemoryIO } from "./io/memory.io";

// The first 0x1FF bytes of memory are reserved for the CHIP8 interpreter, so all
// CHIP8 programs start at 0x200.
const MEMORY_START = 0x200;

/*
 * Tech spec:
 * http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
 */
export interface ICpu {
  // CPU components
  stack: Uint16Array;
  memory: Uint8ClampedArray;
  registers: Uint8ClampedArray;
  pc: number;
  sp: number;
  delayTimer: number;
  soundTimer: number;

  // load data into memory
  load: (data: Uint8ClampedArray) => void;

  // Retrieve the IO interface
  getIo: () => IOInterface;

  // FDE cycle
  fetch: () => number;
  decode: (opcode: number) => {
    instruction: InstructionMneumonic;
    args: InstructionArgs;
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

/**
 *
 * @param this the CPU loading the data
 * @param data the data to load
 */
function load(this: ICpu, data: Uint8ClampedArray): void {
  data.forEach((d, i) => {
    this.memory[MEMORY_START + i] = d;
  });
}
