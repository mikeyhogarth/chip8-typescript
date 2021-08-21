import { opcodes, IOpcode, IOpcodeArgs } from "./opcodes";
import { IOInterface } from "./io";
import { createMemoryIO } from "./io/memory.io";

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
  getInterface: () => IOInterface;

  execute: (opcode: IOpcode, args?: IOpcodeArgs) => void;
}

/**
 * @returns a freshly initialised CHIP8 CPU
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
    pc: 0x200,
    // 16 bit stack pointer
    sp: -1,
    // 16 bit delay and sound timers
    soundTimer: 0,
    delayTimer: 0,
    execute,
    // the IO interface (in memory by default)
    getInterface: () => io,
  };
}

/**
 *
 * @param this the CPU executing the instruction
 * @param opcode the instruction to execute
 * @param args the arguments to execute
 */
function execute(this: ICpu, opcode: IOpcode, args?: IOpcodeArgs) {
  opcode.execute(this, args);
}
