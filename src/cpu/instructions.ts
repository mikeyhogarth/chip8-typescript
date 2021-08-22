import { ICpu } from "../cpu";

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type IXKKArgs = { x: number; kk: number };
type INullArgs = undefined;
export type InstructionArgs = INNNArgs | IXYArgs | IXKKArgs | INullArgs;

export interface Instruction {
  execute: (cpu: ICpu, args?: InstructionArgs) => void;
  // Each opcode has a "pattern" and a "mask" that will reveal that pattern.
  pattern: number;
  mask: number;
}

export enum InstructionMneumonic {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
  call = "call",
  skipIfEqual = "skipIfEqual",
  skipIfNotEqual = "skipIfNotEqual",
  skipIfEqualRegisters = "skipIfEqualRegisters",
  load = "load",
}

/**
 * Reterieve instruction based on opcode.
 * @param byteCode a 16-bit opcode that should match to one of the instructions
 * @returns the matched instruction
 * @throws error if no instruction matches passed-in opcode
 */
export function findByBytecode(opcode: number): Instruction {
  const opcodeValues = Object.values(instructions);
  const retVal =
    // some opcodes are literals - in which case return those before pattern matching.
    opcodeValues.find((o) => o.pattern === opcode) ||
    // otherwise resort to applying bitmasks to discover correct instruction represented
    opcodeValues.find((o) => (o.mask & opcode) === o.pattern);

  if (retVal) {
    return retVal;
  } else {
    throw new Error("Opcode not matched");
  }
}

/**
 * list of instructions
 */
export const instructions: { [key in InstructionMneumonic]: Instruction } = {
  // 0nnn - SYS addr
  sys: {
    pattern: 0x0000,
    mask: 0xf000,
    execute: (cpu) => {
      cpu.pc += 0x2;
    },
  },

  // 00E0 - CLS
  cls: {
    pattern: 0x00e0,
    mask: 0xffff,
    execute(cpu) {
      cpu.getIo().clearDisplay();
      cpu.pc += 0x2;
    },
  },

  // 00EE - RET
  ret: {
    pattern: 0x00ee,
    mask: 0xffff,
    execute(cpu) {
      if (cpu.sp <= -1) {
        throw new Error("Stack Underflow");
      }
      cpu.pc = cpu.stack[cpu.sp];
      cpu.sp--;
    },
  },

  // 1nnn - JP addr
  jmp: {
    pattern: 0x1000,
    mask: 0xf000,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.pc = nnn;
    },
  },

  // 2nnn - CALL addr
  call: {
    pattern: 0x2000,
    mask: 0xf000,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.sp++;
      cpu.stack[cpu.sp] = cpu.pc;
      cpu.pc = nnn;
    },
  },

  // 3xkk - SE Vx, byte
  skipIfEqual: {
    pattern: 0x3000,
    mask: 0xf000,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },

  // 4xkk - SNE Vx, byte
  skipIfNotEqual: {
    pattern: 0x4000,
    mask: 0xf000,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 2 : 4;
    },
  },

  // 5xy0 - SE Vx, Vy
  skipIfEqualRegisters: {
    pattern: 0x5000,
    mask: 0xf00f,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.pc += cpu.registers[x] === cpu.registers[y] ? 4 : 2;
    },
  },

  // 6xkk - LD Vx, byte
  load: {
    pattern: 0x6000,
    mask: 0xf000,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = kk;
      cpu.pc += 0x2;
    },
  },
};
