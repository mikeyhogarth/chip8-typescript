import { nnnDecoder, nullDecoder, findByBytecode } from "./decoders";
import { Instruction, instructions } from "./instructions";

describe("nullDecoder", () => {
  it("returns zero args", () => {
    expect(nullDecoder(0x1234)).toEqual({});
  });
});

describe("nnnDecoder", () => {
  it("returns the nnn portion of the opcode", () => {
    expect(nnnDecoder(0x0123)).toEqual({ nnn: 0x123 });
    expect(nnnDecoder(0x1123)).toEqual({ nnn: 0x123 });
  });
});

describe("findByBytecode", () => {
  const opcodeTestPairs: [number, Instruction][] = [
    [0x0123, instructions.sys],
    [0x00e0, instructions.cls],
    [0x00ee, instructions.ret],
    [0x1123, instructions.jmp],
    [0x2123, instructions.call],
    [0x3123, instructions.skipIfEqual],
    [0x4123, instructions.skipIfNotEqual],
    [0x5120, instructions.skipIfEqualRegisters],
    [0x6123, instructions.load],
    [0x7123, instructions.add],
    [0x8120, instructions.loadReg],
  ];

  // yes, this is a test FOR the tests to make sure we're fully covered
  it("tests each opcode at least once", () => {
    const testedOpcodes = new Set(opcodeTestPairs.map((p) => p[1]));
    expect(testedOpcodes.size).toEqual(Object.values(instructions).length);
  });

  it("throws an error if no opcode is matched", () => {
    expect(() => findByBytecode(0x5123)).toThrowError("Opcode not matched");
  });

  // test each of the cases defined above
  opcodeTestPairs.forEach(([bytecode, mneumonic]) => {
    it("matches", () => {
      expect(findByBytecode(bytecode)).toEqual(mneumonic);
    });
  });
});
