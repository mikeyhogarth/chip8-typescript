import { ICpu } from "../cpu";
import { nnnDecoder, nullDecoder } from "./decoders";

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type IXKKArgs = { x: number; kk: number };
type INullArgs = {};
export type InstructionArgs = INNNArgs | IXYArgs | IXKKArgs | INullArgs;

export interface Instruction {
  id: InstructionMneumonic;
  execute: (cpu: ICpu, args?: InstructionArgs) => void;
  decodeArgs: (opcode: number) => InstructionArgs;
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
  add = "add",
  loadReg = "loadReg",
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
    id: InstructionMneumonic.sys,
    pattern: 0x0000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
    execute: (cpu) => {
      cpu.pc += 0x2;
    },
  },

  // 00E0 - CLS
  cls: {
    id: InstructionMneumonic.cls,
    pattern: 0x00e0,
    mask: 0xffff,
    decodeArgs: nullDecoder,
    execute(cpu) {
      cpu.getIo().clearDisplay();
      cpu.pc += 0x2;
    },
  },

  // 00EE - RET
  ret: {
    id: InstructionMneumonic.ret,
    pattern: 0x00ee,
    mask: 0xffff,
    decodeArgs: nullDecoder,
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
    id: InstructionMneumonic.jmp,
    pattern: 0x1000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.pc = nnn;
    },
  },

  // 2nnn - CALL addr
  call: {
    id: InstructionMneumonic.call,
    pattern: 0x2000,
    mask: 0xf000,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.sp++;
      cpu.stack[cpu.sp] = cpu.pc;
      cpu.pc = nnn;
    },
  },

  // 3xkk - SE Vx, byte
  skipIfEqual: {
    id: InstructionMneumonic.skipIfEqual,
    pattern: 0x3000,
    mask: 0xf000,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },

  // 4xkk - SNE Vx, byte
  skipIfNotEqual: {
    id: InstructionMneumonic.skipIfNotEqual,
    pattern: 0x4000,
    mask: 0xf000,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 2 : 4;
    },
  },

  // 5xy0 - SE Vx, Vy
  skipIfEqualRegisters: {
    id: InstructionMneumonic.skipIfEqualRegisters,
    pattern: 0x5000,
    mask: 0xf00f,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.pc += cpu.registers[x] === cpu.registers[y] ? 4 : 2;
    },
  },

  // 6xkk - LD Vx, byte
  load: {
    id: InstructionMneumonic.load,
    pattern: 0x6000,
    mask: 0xf000,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = kk;
      cpu.pc += 0x2;
    },
  },

  // 7xkk - ADD Vx, byte
  add: {
    id: InstructionMneumonic.add,
    pattern: 0x7000,
    mask: 0xf000,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = cpu.registers[x] + kk;
      cpu.pc += 0x2;
    },
  },

  // 8xy0 - LD Vx, Vy
  loadReg: {
    id: InstructionMneumonic.loadReg,
    pattern: 0x8000,
    mask: 0xf00f,
    decodeArgs: (opcode: number) => {
      throw new Error("Not Implemented");
    },
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[x] = cpu.registers[y];
      cpu.pc += 0x2;
    },
  },
};
