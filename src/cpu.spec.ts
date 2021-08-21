import { createCpu } from "./cpu";

describe("createCpu", () => {
  it("returns a valid, fresh CPU", () => {
    const cpu = createCpu();

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
    const cpu = createCpu();
    cpu.load(new Uint8ClampedArray([0x60, 0xaa, 0x60, 0xbb]));

    // Those chunks above should have been loaded into 4 memory slots...
    expect(cpu.memory[0x200]).toEqual(0x60);
    expect(cpu.memory[0x201]).toEqual(0xaa);
    expect(cpu.memory[0x202]).toEqual(0x60);
    expect(cpu.memory[0x203]).toEqual(0xbb);
  });
});

describe("fetch", () => {
  it("Fetches the word currently being pointed to by the PC", () => {
    const cpu = createCpu();
    cpu.load(new Uint8ClampedArray([0x60, 0xaa]));

    // fetching should return the whole word representing the opcode
    expect(cpu.fetch()).toEqual(0x60aa);
  });
});
