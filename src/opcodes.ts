import { ICpu } from "./cpu";

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type IXKKArgs = { x: number; kk: number };
type INullArgs = undefined;
export type IOpcodeArgs = INNNArgs | IXYArgs | IXKKArgs | INullArgs;

export interface IOpcode {
  execute: (cpu: ICpu, args: IOpcodeArgs) => void;
}

enum OpcodeMneumonics {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
  call = "call",
  skipIf = "skipIf",
}

export const opcodes: { [key in OpcodeMneumonics]: IOpcode } = {
  // 0nnn - SYS addr
  sys: {
    execute: (cpu) => {
      cpu.pc += 2;
    },
  },

  // 00E0 - CLS
  cls: {
    execute(cpu) {
      cpu.getInterface().clearDisplay();
      cpu.pc += 2;
    },
  },

  // 00EE - RET
  ret: {
    execute(cpu) {
      if (cpu.sp <= -1) throw new Error("Stack Underflow");
      cpu.pc = cpu.stack[cpu.sp];
      cpu.sp--;
    },
  },

  // 1nnn - JP addr
  jmp: {
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.pc = nnn;
    },
  },

  // 2nnn - CALL addr
  call: {
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.sp++;
      cpu.stack[cpu.sp] = cpu.pc;
      cpu.pc = nnn;
    },
  },

  skipIf: {
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },
};
