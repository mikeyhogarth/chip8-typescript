/**
 * IO Interface
 */
interface IOInterface {
  display: boolean[][];
  pressedKeys: number;
  isKeyDown: (key: number) => boolean;
  keyDown: (key: number) => void;
  keyUp: (key: number) => void;
  clearDisplay: () => void;
}

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type IXKKArgs = { x: number; kk: number };
type INullArgs = {};
type InstructionArgs = INNNArgs | IXYArgs | IXKKArgs | INullArgs;

interface Instruction {
  execute: (cpu: ICpu, args?: InstructionArgs) => void;
  decodeArgs: (opcode: number) => InstructionArgs;
  // Each opcode has a "pattern" and a "mask" that will reveal that pattern.
  pattern: number;
  mask: number;
}

/**
 * CPU types
 */

/*
 * Tech spec:
 * http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
 */
interface ICpu {
  // CPU components
  stack: Uint16Array;
  memory: Uint8Array;
  registers: Uint8Array;
  pc: number;
  sp: number;
  i: number;
  delayTimer: number;
  soundTimer: number;

  // load data into memory
  load: (data: Buffer) => void;

  // The IO interface
  io: IOInterface;

  // FDE cycle
  fetch: () => number;
  decode: (opcode: number) => {
    instruction: Instruction;
    args: InstructionArgs;
  };
  execute: (instruction: Instruction, arguments: InstructionArgs) => void;

  // Run a CPU fetch-decode-execute cycle
  cycle: () => void;
}
