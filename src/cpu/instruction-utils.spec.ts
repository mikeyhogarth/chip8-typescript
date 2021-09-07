import { decode, findByBytecode } from "./instruction-utils";
import { instructions } from "./instructions";

describe("decode", () => {
  // test the behavior on a couple of opcodes (they're all tested independently
  // below - these tests are purely testing the behavior of the 'decode' function)
  it("correctly decodes 0nnn", () => {
    expect(decode(0x0123)).toEqual({
      instruction: instructions.sys,
      args: { nnn: 0x123 },
    });
  });

  it("correctly decodes 00e0", () => {
    expect(decode(0x00e0)).toEqual({
      instruction: instructions.cls,
      args: {},
    });
  });
});

describe("Instruction decoding", () => {
  const opcodeTestPairs: [number, Instruction, InstructionArgs][] = [
    // 0nnn - SYS addr
    [0x0123, instructions.sys, { nnn: 0x123 }],
    // 00E0 - CLS
    [0x00e0, instructions.cls, {}],
    // 00EE - RET
    [0x00ee, instructions.ret, {}],
    // 1nnn - JP addr
    [0x1123, instructions.jmp, { nnn: 0x123 }],
    // 2nnn - CALL addr
    [0x2123, instructions.call, { nnn: 0x123 }],
    // 3xkk - SE Vx, byte
    [0x3123, instructions.skipIfEqual, { x: 1, kk: 0x23 }],
    // 4xkk - SNE Vx, byte
    [0x4123, instructions.skipIfNotEqual, { x: 1, kk: 0x23 }],
    // 5xy0 - SE Vx, Vy
    [0x5120, instructions.skipIfEqualRegisters, { x: 1, y: 2 }],
    // 6xkk - LD Vx, byte
    [0x6123, instructions.load, { x: 1, kk: 0x23 }],
    // 7xkk - ADD Vx, byte
    [0x7123, instructions.add, { x: 1, kk: 0x23 }],
    // 8xy0 - LD Vx, Vy
    [0x8120, instructions.loadReg, { x: 1, y: 2 }],
    // 8xy1 - OR Vx, Vy
    [0x8011, instructions.or, { x: 0, y: 1 }],
  ];

  // yes, this is a test FOR the tests to make sure we're fully covered
  it("tests each opcode at least once", () => {
    const testedOpcodes = new Set(opcodeTestPairs.map((p) => p[1]));
    expect(testedOpcodes.size).toEqual(Object.values(instructions).length);
  });

  describe("findByBytecode", () => {
    it("throws an error if no opcode is matched", () => {
      expect(() => findByBytecode(0x5123)).toThrowError("Opcode not matched");
    });

    // test each of the cases defined above
    opcodeTestPairs.forEach(([bytecode, instruction]) => {
      describe(instruction.id, () => {
        it("is found correctly", () => {
          expect(findByBytecode(bytecode)).toEqual(instruction);
        });
      });
    });

    describe("arg decoding", () => {
      // test each of the cases defined above
      opcodeTestPairs.forEach(([bytecode, instruction, args]) => {
        describe(instruction.id, () => {
          it("decodes args correctly", () => {
            expect(instruction.decodeArgs(bytecode)).toEqual(args);
          });
        });
      });
    });
  });
});
