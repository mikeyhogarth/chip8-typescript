import { createCpu, Cpu } from "./cpu";
import * as utils from "./cpu/instruction-utils";
import * as fs from "fs";
import * as path from "path";
import { instructions } from "./cpu/instructions";

let cpu: ICpu;
beforeEach(() => {
  cpu = createCpu();
});

describe("Cpu", () => {
  it("Can be constructed", () => {
    expect(() => new Cpu()).not.toThrowError();
  });
});

describe("createCpu", () => {
  it("returns a valid, fresh CPU", () => {
    expect(cpu.registers.length).toEqual(16);
    expect(cpu.stack.length).toEqual(16);
    expect(cpu.memory.length).toEqual(4096);
    expect(cpu.pc).toEqual(512);
    expect(cpu.sp).toEqual(-1);
    expect(cpu.soundTimer).toEqual(0);
    expect(cpu.delayTimer).toEqual(0);
  });
});

describe("load", () => {
  it("loads the given data into memory", () => {
    cpu.load(Buffer.from([0x60, 0xaa, 0x60, 0xbb]));

    // Those chunks above should have been loaded into 4 memory slots...
    expect(cpu.memory[0x200]).toEqual(0x60);
    expect(cpu.memory[0x201]).toEqual(0xaa);
    expect(cpu.memory[0x202]).toEqual(0x60);
    expect(cpu.memory[0x203]).toEqual(0xbb);
  });

  it("Reads from a file", () => {
    const file = fs.readFileSync(path.join(__dirname, "../roms/test.ch8"));
    cpu.load(file);

    // this file should set the values in memory to 60 01 70 01 81 00
    expect(cpu.memory[0x200]).toEqual(0x60);
    expect(cpu.memory[0x201]).toEqual(0x01);
    expect(cpu.memory[0x202]).toEqual(0x70);
    expect(cpu.memory[0x203]).toEqual(0x01);
    expect(cpu.memory[0x204]).toEqual(0x81);
    expect(cpu.memory[0x205]).toEqual(0x00);
  });
});

describe("fetch", () => {
  it("Fetches the word currently being pointed to by the PC", () => {
    cpu.load(Buffer.from([0x60, 0xaa]));

    // fetching should return the whole word representing the opcode
    expect(cpu.fetch()).toEqual(0x60aa);
  });
});

describe("decode", () => {
  it("Offloads the work to the external 'decode' function", () => {
    const spy = jest.spyOn(utils, "decode");
    cpu.decode(0x00e0);
    expect(spy).toHaveBeenCalledWith(0x00e0);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe("execute", () => {
  it("executes an instruction", () => {
    const instruction = instructions.load;
    const x = 0;
    const kk = 0xf0;
    cpu.execute(instruction, { x, kk });
    expect(cpu.registers[x]).toEqual(kk);
  });
});

describe("cycle", () => {
  it("advances the program counter", () => {
    const originalPC = cpu.pc;
    cpu.cycle();
    expect(cpu.pc).toEqual(originalPC + 2);
  });

  it("runs an FDE cycle", () => {
    // 6xkk should load kk into register x

    cpu.load(Buffer.from([0x60, 0xf0]));
    cpu.cycle();
    expect(cpu.registers[0]).toEqual(0xf0);
  });

  it("can be run several times in a row", () => {
    // 6xkk should load kk into register x - this program loads
    // 0xaa, 0xbb and 0xcc into registers 0, 1, and 2 respectively.
    const program = Buffer.from([0x60, 0xaa, 0x61, 0xbb, 0x62, 0xcc]);
    cpu.load(program);
    cpu.cycle();
    expect(cpu.registers[0]).toEqual(0xaa);
    expect(cpu.registers[1]).toEqual(0);
    expect(cpu.registers[2]).toEqual(0);
    cpu.cycle();
    expect(cpu.registers[0]).toEqual(0xaa);
    expect(cpu.registers[1]).toEqual(0xbb);
    expect(cpu.registers[2]).toEqual(0);
    cpu.cycle();
    expect(cpu.registers[0]).toEqual(0xaa);
    expect(cpu.registers[1]).toEqual(0xbb);
    expect(cpu.registers[2]).toEqual(0xcc);
  });
});
