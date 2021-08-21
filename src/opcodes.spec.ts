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
    opcodes.sys.execute(cpu, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00E0 - CLS
describe("cls", () => {
  it("Clears the display", () => {
    cpu = createCpu({ ...createMemoryIO(), clearDisplay: jest.fn() });
    opcodes.cls.execute(cpu);

    // clearDisplay behavior already tested elsewhere.
    expect(cpu.getIo().clearDisplay).toHaveBeenCalled();
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00EE - RET
describe("ret", () => {
  it("sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.", () => {
    cpu.stack[0] = 0x111;
    cpu.stack[1] = 0x222;
    cpu.sp = 1;

    opcodes.ret.execute(cpu);
    expect(cpu.pc).toEqual(0x222);
    expect(cpu.sp).toEqual(0);

    opcodes.ret.execute(cpu);
    expect(cpu.pc).toEqual(0x111);
    expect(cpu.sp).toEqual(-1);

    // this would be a stack "underflow"
    expect(() => opcodes.ret.execute(cpu)).toThrowError("Stack Underflow");
  });
});

// 1nnn - JP addr
describe("jmp", () => {
  it("correctly sets PC to the passed in address", () => {
    opcodes.jmp.execute(cpu, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0xf00);
  });
});

// 2nnn - CALL addr
describe("call", () => {
  it("Increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.", () => {
    opcodes.call.execute(cpu, { nnn: 0xf00 });
    expect(cpu.sp).toEqual(0);
    expect(cpu.stack[cpu.sp]).toEqual(0x200);
    expect(cpu.pc).toEqual(0xf00);
  });
});

// 3xkk - SE Vx, byte
describe("skipIfEqual", () => {
  it("Skips next instruction if Vx === kk", () => {
    const kk = 0xf0;

    // when register 0 is NOT set to KK, it should NOT skip
    opcodes.skipIfEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x202);

    // when register 0 is set to KK, it should skip
    cpu.registers[0] = kk;
    opcodes.skipIfEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 4xkk - SNE Vx, byte
describe("skipNotIfEqual", () => {
  it("Skips next instruction if Vx !== kk", () => {
    const kk = 0xf0;

    // when register 0 is NOT set to KK, it should skip
    opcodes.skipIfNotEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x204);

    // when register 0 is set to KK, it should NOT skip
    cpu.registers[0] = kk;
    opcodes.skipIfNotEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 5xy0 - SE Vx, Vy
describe("skipIfEqualRegisters", () => {
  it("Skips next instruction if Vx === Vy", () => {
    // when registers are equal, it should skip
    cpu.registers[0] = 1;
    cpu.registers[1] = 1;
    opcodes.skipIfEqualRegisters.execute(cpu, { x: 0, y: 1 });
    expect(cpu.pc).toEqual(0x204);

    // when registers are NOT equal, it should skip
    cpu.registers[0] = 1;
    cpu.registers[1] = 2;
    opcodes.skipIfEqualRegisters.execute(cpu, { x: 0, y: 1 });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 6xkk - LD Vx, byte
describe("load", () => {
  it("puts the value kk into register Vx.", () => {
    const kk = 0xf0;
    opcodes.load.execute(cpu, { x: 0, kk });
    expect(cpu.registers[0]).toEqual(kk);
    expect(cpu.pc).toEqual(0x202);
  });
});
