import { decode, findByBytecode, random } from "./instruction-utils";
import { instructions } from "./instructions";

describe("instruction utils", () => {
  // Each item in this list should be an array of length three, with the elements represeting;
  // element 0: an opcode
  // element 1: the instrution that opcode should match to
  // element 2: the arguments that should be extracted from the opcode
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
    [0x3123, instructions.seq, { x: 1, kk: 0x23 }],
    // 4xkk - SNE Vx, byte
    [0x4123, instructions.sne, { x: 1, kk: 0x23 }],
    // 5xy0 - SE Vx, Vy
    [0x5120, instructions.seqReg, { x: 1, y: 2 }],
    // 6xkk - LD Vx, byte
    [0x6123, instructions.load, { x: 1, kk: 0x23 }],
    // 7xkk - ADD Vx, byte
    [0x7123, instructions.add, { x: 1, kk: 0x23 }],
    // 8xy0 - LD Vx, Vy
    [0x8120, instructions.loadReg, { x: 1, y: 2 }],
    // 8xy1 - OR Vx, Vy
    [0x8011, instructions.or, { x: 0, y: 1 }],
    // 8xy2 - AND Vx, Vy
    [0x8012, instructions.and, { x: 0, y: 1 }],
    // 8xy3 - XOR Vx, Vy
    [0x8013, instructions.xor, { x: 0, y: 1 }],
    // 8xy4 - ADD Vx, Vy
    [0x8014, instructions.addReg, { x: 0, y: 1 }],
    // 8xy5 - ADD Vx, Vy
    [0x8015, instructions.sub, { x: 0, y: 1 }],
    // 8xy6 - SHR Vx {, Vy}
    [0x8016, instructions.shr, { x: 0, y: 1 }],
    // 8xy7 - SUBN Vx, Vy
    [0x8017, instructions.subn, { x: 0, y: 1 }],
    // 8xyE - SHL Vx {, Vy}
    [0x801e, instructions.shl, { x: 0, y: 1 }],
    // 9xy0 - SNE Vx, Vy
    [0x9010, instructions.sneReg, { x: 0, y: 1 }],
    // Annn - LD I, addr
    [0xa123, instructions.loadI, { nnn: 0x123 }],
    // Bnnn - JP V0, addr
    [0xb123, instructions.jmpReg, { nnn: 0x123 }],
    // Cxkk - RND Vx, byte
    [0xc012, instructions.rnd, { x: 0, kk: 0x12 }],
    // Ex9E - SKP Vx
    [0xe09e, instructions.skpKey, { x: 0 }],
    // Dxyn - DRW Vx, Vy, nibble
    [0xd012, instructions.draw, { x: 0, y: 1, n: 2 }],
    // ExA1 - SKNP Vx
    [0xe0a1, instructions.skpNotKey, { x: 0 }],
    // Fx07 - LD Vx, DT
    [0xf007, instructions.getDelay, { x: 0 }],
    // Fx0A - LD Vx, K
    [0xf00a, instructions.waitKey, { x: 0 }],
    // Fx15 - LD DT, Vx
    [0xf015, instructions.setDelay, { x: 0 }],
    // Fx18 - LD ST, Vx
    [0xf018, instructions.setSound, { x: 0 }],
    // Fx1E - ADD I, Vx
    [0xf01e, instructions.addIReg, { x: 0 }],
    // Fx29 - LD F, Vx
    [0xf029, instructions.loadHexSprite, { x: 0 }],
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
      describe(`given bytecode ${bytecode.toString(16)}`, () => {
        it("finds the instruction correctly", () => {
          expect(findByBytecode(bytecode)).toEqual(instruction);
        });
      });
    });
  });

  describe("decode", () => {
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
    // test each of the cases defined above
    opcodeTestPairs.forEach(([bytecode, instruction, args]) => {
      describe(`given bytecode ${bytecode.toString(16)}`, () => {
        it("decodes the arguments correctly", () => {
          expect(instruction.decodeArgs(bytecode)).toEqual(args);
        });
      });
    });
  });
});

describe("random", () => {
  describe("when Math.random returns 1", () => {
    it("returns 255", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(1);
      expect(random()).toEqual(255);
      jest.spyOn(global.Math, "random").mockRestore();
    });
  });

  describe("when Math.random returns 0", () => {
    it("returns 0", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0);
      expect(random()).toEqual(0);
      jest.spyOn(global.Math, "random").mockRestore();
    });
  });

  describe("when Math.random returns 0.5", () => {
    it("returns 255/2 floored (127)", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(0.5);
      expect(random()).toEqual(127);
      jest.spyOn(global.Math, "random").mockRestore();
    });
  });
});
