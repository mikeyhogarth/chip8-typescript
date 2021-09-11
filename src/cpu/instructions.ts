import { xkkDecoder, nnnDecoder, nullDecoder, xyDecoder } from "./decoders";
import { InstructionMneumonic } from "./mneumonics";
/**
 * list of instructions
 */
export const instructions: { [key in InstructionMneumonic]: Instruction } = {
  // 0nnn - SYS addr
  sys: {
    pattern: 0x0000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
    execute: (cpu) => {
      cpu.pc += 0x2;
    },
  },

  // 00E0 - CLS
  cls: {
    pattern: 0x00e0,
    mask: 0xffff,
    decodeArgs: nullDecoder,
    execute(cpu) {
      cpu.io.clearDisplay();
      cpu.pc += 0x2;
    },
  },

  // 00EE - RET
  ret: {
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
    pattern: 0x2000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
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
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },

  // 4xkk - SNE Vx, byte
  skipIfNotEqual: {
    pattern: 0x4000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 2 : 4;
    },
  },

  // 5xy0 - SE Vx, Vy
  skipIfEqualRegisters: {
    pattern: 0x5000,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.pc += cpu.registers[x] === cpu.registers[y] ? 4 : 2;
    },
  },

  // 6xkk - LD Vx, byte
  load: {
    pattern: 0x6000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = kk;

      cpu.pc += 0x2;
    },
  },

  // 7xkk - ADD Vx, byte
  add: {
    pattern: 0x7000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = cpu.registers[x] + kk;
      cpu.pc += 0x2;
    },
  },

  // 8xy0 - LD Vx, Vy
  loadReg: {
    pattern: 0x8000,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[x] = cpu.registers[y];
      cpu.pc += 0x2;
    },
  },

  // 8xy1 - OR Vx, Vy
  or: {
    pattern: 0x8001,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[x] = cpu.registers[x] | cpu.registers[y];
      cpu.pc += 0x2;
    },
  },

  // 8xy2 - OR Vx, Vy
  and: {
    pattern: 0x8002,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[x] = cpu.registers[x] & cpu.registers[y];
      cpu.pc += 0x2;
    },
  },

  // 8xy3 - XOR Vx, Vy
  xor: {
    pattern: 0x8003,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[x] = cpu.registers[x] ^ cpu.registers[y];
      cpu.pc += 0x2;
    },
  },

  // 8xy4 - ADD Vx, Vy
  addReg: {
    pattern: 0x8004,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      const sum = cpu.registers[x] + cpu.registers[y];
      cpu.registers[0xf] = sum > 0xff ? 1 : 0;
      cpu.registers[x] = sum;
      cpu.pc += 0x2;
    },
  },

  // 8xy5 - SUB Vx, Vy
  sub: {
    pattern: 0x8005,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[0xf] = cpu.registers[x] > cpu.registers[y] ? 1 : 0;
      cpu.registers[x] = cpu.registers[x] - cpu.registers[y];
      cpu.pc += 0x2;
    },
  },

  // 8xy6 - SHR Vx {, Vy}
  shr: {
    pattern: 0x8006,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x } = args as IXYArgs;
      cpu.registers[0xf] = cpu.registers[x] & 1;
      cpu.registers[x] = cpu.registers[x] >> 1;
      cpu.pc += 0x2;
    },
  },

  // 8xy7 - SUBN Vx, Vy
  subn: {
    pattern: 0x8007,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.registers[0xf] = cpu.registers[y] > cpu.registers[x] ? 1 : 0;
      cpu.registers[x] = cpu.registers[y] - cpu.registers[x];
      cpu.pc += 0x2;
    },
  },
};
