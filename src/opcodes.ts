import { ICpu } from "./cpu";

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type IXKKArgs = { x: number; kk: number };
type INullArgs = undefined;
export type IOpcodeArgs = INNNArgs | IXYArgs | IXKKArgs | INullArgs;

export interface IOpcode {
  execute: (cpu: ICpu, args: IOpcodeArgs) => void;
  // Some opcodes mess around with the PC directly: we won't want to be
  // automatically incrementing it for these.
  manipulatesPC?: boolean;
}

enum OpcodeMneumonics {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
  call = "call",
  skipIfEqual = "skipIfEqual",
  skipIfNotEqual = "skipIfNotEqual",
  skipIfEqualRegisters = "skipIfEqualRegisters",
}

export const opcodes: { [key in OpcodeMneumonics]: IOpcode } = {
  // 0nnn - SYS addr
  sys: {
    execute: (cpu) => {
      return;
    },
  },

  // 00E0 - CLS
  cls: {
    execute(cpu) {
      cpu.getInterface().clearDisplay();
    },
  },

  // 00EE - RET
  ret: {
    manipulatesPC: true,
    execute(cpu) {
      if (cpu.sp <= -1) throw new Error("Stack Underflow");
      cpu.pc = cpu.stack[cpu.sp];
      cpu.sp--;
    },
  },

  // 1nnn - JP addr
  jmp: {
    manipulatesPC: true,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.pc = nnn;
    },
  },

  // 2nnn - CALL addr
  call: {
    manipulatesPC: true,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.sp++;
      cpu.stack[cpu.sp] = cpu.pc;
      cpu.pc = nnn;
    },
  },

  // 3xkk - SE Vx, byte
  skipIfEqual: {
    manipulatesPC: true,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },

  // 4xkk - SNE Vx, byte
  skipIfNotEqual: {
    manipulatesPC: true,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 2 : 4;
    },
  },

  // 5xy0 - SE Vx, Vy
  skipIfEqualRegisters: {
    manipulatesPC: true,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.pc += cpu.registers[x] === cpu.registers[y] ? 4 : 2;
    },
  },
};
