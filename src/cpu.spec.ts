import { createCpu, ICpu } from "./cpu";
import * as decoders from "./cpu/decoders";
import * as fs from "fs";
import * as path from "path";

let cpu: ICpu;
beforeEach(() => {
  cpu = createCpu();
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
    const spy = jest.spyOn(decoders, "decode");
    cpu.decode(0x00e0);
    expect(spy).toHaveBeenCalledWith(0x00e0);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
