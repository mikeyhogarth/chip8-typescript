import {
  xkkDecoder,
  nnnDecoder,
  nullDecoder,
  xDecoder,
  xyDecoder,
  xynDecoder,
} from "./decoders";
import { random } from "./instruction-utils";
import { InstructionMneumonic } from "./mneumonics";
import hexSprites from "../hex-sprites";

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
  seq: {
    pattern: 0x3000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 4 : 2;
    },
  },

  // 4xkk - SNE Vx, byte
  sne: {
    pattern: 0x4000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.pc += cpu.registers[x] === kk ? 2 : 4;
    },
  },

  // 5xy0 - SE Vx, Vy
  seqReg: {
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
      cpu.registers[0xf] = cpu.registers[x] & 1; // & 1 gets us the LSB
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

  // 8xyE - SHL Vx {, Vy}
  shl: {
    pattern: 0x800e,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x } = args as IXYArgs;
      cpu.registers[0xf] = cpu.registers[x] >> 7; // >> 7 gets us the MSB in a byte
      cpu.registers[x] = cpu.registers[x] << 1;
      cpu.pc += 0x2;
    },
  },

  // 9xy0 - SNE Vx, Vy
  sneReg: {
    pattern: 0x9000,
    mask: 0xf00f,
    decodeArgs: xyDecoder,
    execute(cpu, args) {
      const { x, y } = args as IXYArgs;
      cpu.pc += cpu.registers[x] !== cpu.registers[y] ? 2 : 4;
    },
  },

  // Annn - LD I, addr
  loadI: {
    pattern: 0xa000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.i = nnn;
      cpu.pc += 2;
    },
  },

  // Bnnn - JP V0, addr
  jmpReg: {
    pattern: 0xb000,
    mask: 0xf000,
    decodeArgs: nnnDecoder,
    execute(cpu, args) {
      const { nnn } = args as INNNArgs;
      cpu.pc = nnn + cpu.registers[0];
    },
  },

  // Cxkk - RND Vx, byte
  rnd: {
    pattern: 0xc000,
    mask: 0xf000,
    decodeArgs: xkkDecoder,
    execute(cpu, args) {
      const { x, kk } = args as IXKKArgs;
      cpu.registers[x] = random() & kk;
      cpu.pc += 2;
    },
  },

  // Dxyn - DRW Vx, Vy, nibble
  draw: {
    pattern: 0xd000,
    mask: 0xf000,
    decodeArgs: xynDecoder,
    execute(cpu, args) {
      const { x, y, n } = args as IXYNArgs;

      cpu.registers[0xf] = cpu.io.drawSprite(
        cpu.memory.slice(cpu.i, cpu.i + n),
        cpu.registers[x],
        cpu.registers[y]
      )
        ? 1
        : 0;
      cpu.pc += 2;
    },
  },

  // Ex9E - SKP Vx
  skpKey: {
    pattern: 0xe09e,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.pc += cpu.io.isKeyDown(cpu.registers[x]) ? 4 : 2;
    },
  },

  // ExA1 - SKNP Vx
  skpNotKey: {
    pattern: 0xe0a1,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.pc += cpu.io.isKeyDown(cpu.registers[x]) ? 2 : 4;
    },
  },

  // Fx07 - LD Vx, DT
  getDelay: {
    pattern: 0xf007,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.registers[x] = cpu.delayTimer;
      cpu.pc += 2;
    },
  },

  // Fx0A - LD Vx, K
  waitKey: {
    pattern: 0xf00a,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      // no pressed keys - do nothing and return
      if (cpu.io.pressedKeys === 0) return;
      // A key is pressed - get the last one pressed and put it into the register
      cpu.registers[x] = cpu.io.lastKeyPressed;
      cpu.pc += 2;
    },
  },

  // Fx15 - LD DT, Vx
  setDelay: {
    pattern: 0xf015,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.delayTimer = cpu.registers[0];
      cpu.pc += 2;
    },
  },

  // Fx18 - LD ST, Vx
  setSound: {
    pattern: 0xf018,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.soundTimer = cpu.registers[0];
      cpu.pc += 2;
    },
  },

  // Fx1E - ADD I, Vx
  addIReg: {
    pattern: 0xf01e,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.i = cpu.i + cpu.registers[x];
      cpu.pc += 2;
    },
  },

  // Fx29 - LD F, Vx
  loadHexSprite: {
    pattern: 0xf029,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      cpu.i = cpu.registers[x] * 5;
      cpu.pc += 2;
    },
  },

  // Fx33 - LD B, Vx
  loadBCD: {
    pattern: 0xf033,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      // hundreds
      cpu.memory[cpu.i] = Math.floor(cpu.registers[x] / 100);
      // tens
      cpu.memory[cpu.i + 1] = Math.floor(cpu.registers[x] / 10) % 10;
      // units
      cpu.memory[cpu.i + 2] = cpu.registers[x] % 10;
      cpu.pc += 2;
    },
  },

  // Fx55 - LD [I], Vx
  storeMem: {
    pattern: 0xf055,
    mask: 0xf0ff,
    decodeArgs: xDecoder,
    execute(cpu, args) {
      const { x } = args as IXArgs;
      for (let i = 0; i <= x; i++) {
        cpu.memory[cpu.i + i] = cpu.registers[i];
      }
      cpu.pc += 2;
    },
  },
};
