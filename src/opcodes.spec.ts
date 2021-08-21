import { opcodes } from "./opcodes";
import { createCpu, ICpu } from "./cpu";
import { createMemoryIO } from "./io/memory.io";

let cpu: ICpu;

beforeEach(() => {
  cpu = createCpu();
});

// 0nnn - SYS addr
describe("sys", () => {
  it("does nothing except increment the PC", () => {
    cpu.execute(opcodes.sys, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00E0 - CLS
describe("cls", () => {
  it("Clears the display", () => {
    cpu = createCpu({ ...createMemoryIO(), clearDisplay: jest.fn() });
    cpu.execute(opcodes.cls);

    // clearDisplay behavior already tested elsewhere.
    expect(cpu.getInterface().clearDisplay).toHaveBeenCalled();
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00EE - RET
describe("ret", () => {
  it("sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.", () => {
    cpu.stack[0] = 0x111;
    cpu.stack[1] = 0x222;
    cpu.sp = 1;

    cpu.execute(opcodes.ret);
    expect(cpu.pc).toEqual(0x222);
    expect(cpu.sp).toEqual(0);

    cpu.execute(opcodes.ret);
    expect(cpu.pc).toEqual(0x111);
    expect(cpu.sp).toEqual(-1);

    // this would be a stack "underflow"
    expect(() => cpu.execute(opcodes.ret)).toThrowError("Stack Underflow");
  });
});

// 1nnn - JP addr
describe("jmp", () => {
  it("correctly sets PC to the passed in address", () => {
    cpu.execute(opcodes.jmp, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0xf00);
  });
});

// 2nnn - CALL addr
describe("call", () => {
  it("Increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.", () => {
    cpu.execute(opcodes.call, { nnn: 0xf00 });
    expect(cpu.sp).toEqual(0);
    expect(cpu.stack[cpu.sp]).toEqual(0x200);
    expect(cpu.pc).toEqual(0xf00);
  });
});

// 3xkk - SE Vx, byte
describe("skipIf", () => {
  it("Skips next instruction if Vx = kk", () => {
    const kk = 0xf0;
    cpu.execute(opcodes.skipIf, { x: 0, kk });
    expect(cpu.pc).toEqual(0x202);

    cpu.registers[0] = kk;
    cpu.execute(opcodes.skipIf, { x: 0, kk });
    expect(cpu.pc).toEqual(0x206);
  });
});
