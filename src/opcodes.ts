import { ICpu } from "./cpu";

type INNNArgs = { nnn: number };
type IXYArgs = { x: number; y: number };
type INullArgs = undefined;
export type IOpcodeArgs = INNNArgs | IXYArgs | INullArgs;

export interface IOpcode {
  execute: (cpu: ICpu, args: IOpcodeArgs) => void;
}

enum OpcodeMneumonics {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
}

export const opcodes: { [key in OpcodeMneumonics]: IOpcode } = {
  // 0nnn - SYS addr
  sys: {
    execute: () => null,
  },

  // 00E0 - CLS
  cls: {
    execute(cpu) {
      cpu.getInterface().clearDisplay();
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
      cpu.pc = (args as INNNArgs).nnn;
    },
  },
};
