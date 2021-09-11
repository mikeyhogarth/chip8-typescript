import { instructions } from "./instructions";
import { createCpu } from "../cpu";
import { createMemoryIO } from "../io/memory.io";

let cpu: ICpu;

beforeEach(() => {
  cpu = createCpu();
});

describe("instructions", () => {
  it("is as long as it should be", () => {
    // There are 35 opcodes in chip8 - this test is purely here as a
    // gauge to figure out how far along the project is, but will eventually
    // be a test to make sure there are as many opcodes as there should be.
    expect(Object.keys(instructions).length).toEqual(19);
  });
});

// 0nnn - SYS addr
describe("sys", () => {
  it("does nothing except increment the PC", () => {
    instructions.sys.execute(cpu, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00E0 - CLS
describe("cls", () => {
  it("Clears the display", () => {
    cpu = createCpu({ ...createMemoryIO(), clearDisplay: jest.fn() });
    instructions.cls.execute(cpu);

    // clearDisplay behavior already tested elsewhere.
    expect(cpu.io.clearDisplay).toHaveBeenCalled();
    expect(cpu.pc).toEqual(0x202);
  });
});

// 00EE - RET
describe("ret", () => {
  it("sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.", () => {
    cpu.stack[0] = 0x111;
    cpu.stack[1] = 0x222;
    cpu.sp = 1;

    instructions.ret.execute(cpu);
    expect(cpu.pc).toEqual(0x222);
    expect(cpu.sp).toEqual(0);

    instructions.ret.execute(cpu);
    expect(cpu.pc).toEqual(0x111);
    expect(cpu.sp).toEqual(-1);

    // this would be a stack "underflow"
    expect(() => instructions.ret.execute(cpu)).toThrowError("Stack Underflow");
  });
});

// 1nnn - JP addr
describe("jmp", () => {
  it("correctly sets PC to the passed in address", () => {
    instructions.jmp.execute(cpu, { nnn: 0xf00 });
    expect(cpu.pc).toEqual(0xf00);
  });
});

// 2nnn - CALL addr
describe("call", () => {
  it("Increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.", () => {
    instructions.call.execute(cpu, { nnn: 0xf00 });
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
    instructions.skipIfEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x202);

    // when register 0 is set to KK, it should skip
    cpu.registers[0] = kk;
    instructions.skipIfEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 4xkk - SNE Vx, byte
describe("skipNotIfEqual", () => {
  it("Skips next instruction if Vx !== kk", () => {
    const kk = 0xf0;

    // when register 0 is NOT set to KK, it should skip
    instructions.skipIfNotEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x204);

    // when register 0 is set to KK, it should NOT skip
    cpu.registers[0] = kk;
    instructions.skipIfNotEqual.execute(cpu, { x: 0, kk });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 5xy0 - SE Vx, Vy
describe("skipIfEqualRegisters", () => {
  it("Skips next instruction if Vx === Vy", () => {
    // when registers are equal, it should skip
    cpu.registers[0] = 1;
    cpu.registers[1] = 1;
    instructions.skipIfEqualRegisters.execute(cpu, { x: 0, y: 1 });
    expect(cpu.pc).toEqual(0x204);

    // when registers are NOT equal, it should skip
    cpu.registers[0] = 1;
    cpu.registers[1] = 2;
    instructions.skipIfEqualRegisters.execute(cpu, { x: 0, y: 1 });
    expect(cpu.pc).toEqual(0x206);
  });
});

// 6xkk - LD Vx, byte
describe("load", () => {
  it("puts the value kk into register Vx.", () => {
    const kk = 0xf0;
    instructions.load.execute(cpu, { x: 0, kk });
    expect(cpu.registers[0]).toEqual(kk);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 7xkk - ADD Vx, byte
describe("add", () => {
  it("Adds the value kk to the value of register Vx, then stores the result in Vx.", () => {
    const kk = 0x01;
    cpu.registers[0] = 5;
    instructions.add.execute(cpu, { x: 0, kk });
    expect(cpu.registers[0]).toEqual(6);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 8xy0 - LD Vx, Vy
describe("add", () => {
  it("Stores the value of register Vy in register Vx.", () => {
    cpu.registers[1] = 5;
    instructions.loadReg.execute(cpu, { x: 0, y: 1 });
    expect(cpu.registers[0]).toEqual(5);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 8xy1 - OR Vx, Vy
describe("or", () => {
  it("Bitwise OR's Vy and Vx, stores result in Vx", () => {
    cpu.registers[0] = 0b00010100;
    cpu.registers[1] = 0b00101000;
    const resultOfOr = 0b00111100;
    instructions.or.execute(cpu, { x: 0, y: 1 });
    expect(cpu.registers[0]).toEqual(resultOfOr);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 8xy2 - AND Vx, Vy
describe("and", () => {
  it("Bitwise OR's Vy and Vx, stores result in Vx", () => {
    cpu.registers[0] = 0b00110100;
    cpu.registers[1] = 0b00101100;
    const resultOfAnd = 0b00100100;
    instructions.and.execute(cpu, { x: 0, y: 1 });
    expect(cpu.registers[0]).toEqual(resultOfAnd);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 8xy3 - XOR Vx, Vy
describe("xor", () => {
  it("Bitwise XOR's Vy and Vx, stores result in Vx", () => {
    cpu.registers[0] = 0b00110100;
    cpu.registers[1] = 0b00101100;
    const resultOfXor = 0b00011000;
    instructions.xor.execute(cpu, { x: 0, y: 1 });
    expect(cpu.registers[0]).toEqual(resultOfXor);
    expect(cpu.pc).toEqual(0x202);
  });
});

// 8xy4 - ADD Vx, Vy
describe("addReg", () => {
  describe("when result of addition is less than 8 bits (255)", () => {
    it("Adds the values of the registers together and leaves Vf alone", () => {
      cpu.registers[0] = 1;
      cpu.registers[1] = 2;
      instructions.addReg.execute(cpu, { x: 0, y: 1 });
      expect(cpu.registers[0]).toEqual(3);
      expect(cpu.registers[0xf]).toEqual(0);
      expect(cpu.pc).toEqual(0x202);
    });
  });
  describe("when the result of an addition is equal to 8 bits (255)", () => {
    it("Adds the values of the registers together and sets Vf to 0 - only keeps 8 bits", () => {
      cpu.registers[0] = 0b11111110;
      cpu.registers[1] = 0b00000001;
      instructions.addReg.execute(cpu, { x: 0, y: 1 });
      // reg 0 should equal 0 because carry bit set and reg only stores 8 bits (1 byte)
      expect(cpu.registers[0]).toEqual(0b11111111);
      expect(cpu.registers[0xf]).toEqual(0);
      expect(cpu.pc).toEqual(0x202);
    });
  });
  describe("when the result of an addition is greater than 8 bits (255)", () => {
    it("Adds the values of the registers together and sets Vf to 1 - only keeps 8 bits", () => {
      cpu.registers[0] = 0b11111111;
      cpu.registers[1] = 1;
      instructions.addReg.execute(cpu, { x: 0, y: 1 });
      // reg 0 should equal 0 because carry bit set and reg only stores 8 bits (1 byte)
      expect(cpu.registers[0]).toEqual(0);
      expect(cpu.registers[0xf]).toEqual(1);
      expect(cpu.pc).toEqual(0x202);
    });
  });
});

// 8xy5 - SUB Vx, Vy
describe("sub", () => {
  describe("if vx > vy", () => {
    it("subtracts vy from vx and sets vf to 1", () => {
      cpu.registers[0] = 5;
      cpu.registers[1] = 4;
      instructions.sub.execute(cpu, { x: 0, y: 1 });
      expect(cpu.registers[0]).toEqual(1);
      expect(cpu.registers[0xf]).toEqual(1);
      expect(cpu.pc).toEqual(0x202);
    });
  });

  describe("if vx === vy", () => {
    it("subtracts vy from vx and sets vf to 0", () => {
      cpu.registers[0] = 5;
      cpu.registers[1] = 5;
      instructions.sub.execute(cpu, { x: 0, y: 1 });
      expect(cpu.registers[0]).toEqual(0);
      expect(cpu.registers[0xf]).toEqual(0);
      expect(cpu.pc).toEqual(0x202);
    });
  });

  describe("if vx <= vy", () => {
    it("subtracts vy from vx and sets vf to 0", () => {
      cpu.registers[0] = 4;
      cpu.registers[1] = 5;
      instructions.sub.execute(cpu, { x: 0, y: 1 });
      expect(cpu.registers[0]).toEqual(0b11111111);
      expect(cpu.registers[0xf]).toEqual(0);
      expect(cpu.pc).toEqual(0x202);
    });
  });

  // 8xy6 - SHR Vx {, Vy}
  describe("shr", () => {
    describe("If the least-significant bit of Vx is 1", () => {
      it("sets VF to 1, then Vx is divided by 2.", () => {
        const x = 0;
        const val = 0b00000101;
        cpu.registers[x] = val;
        instructions.shr.execute(cpu, { x });
        expect(cpu.registers[0xf]).toEqual(1);
        expect(cpu.registers[x]).toEqual(Math.floor(val / 2));
        expect(cpu.pc).toEqual(0x202);
      });
    });

    describe("If the least-significant bit of Vx is 0", () => {
      it("sets VF to 0, then Vx is divided by 2.", () => {
        const x = 0;
        const val = 0b00000100;
        cpu.registers[x] = val;
        instructions.shr.execute(cpu, { x });
        expect(cpu.registers[0xf]).toEqual(0);
        expect(cpu.registers[x]).toEqual(Math.floor(val / 2));
        expect(cpu.pc).toEqual(0x202);
      });
    });
  });

  // 8xy7 - SUBN Vx, Vy
  describe("subn", () => {
    describe("if vy > vx", () => {
      it("subtracts vx from vy and sets vf to 1", () => {
        cpu.registers[0] = 4;
        cpu.registers[1] = 5;
        instructions.subn.execute(cpu, { x: 0, y: 1 });
        expect(cpu.registers[0]).toEqual(1);
        expect(cpu.registers[0xf]).toEqual(1);
        expect(cpu.pc).toEqual(0x202);
      });
    });

    describe("if vy === vy", () => {
      it("subtracts vx from vy and sets vf to 0", () => {
        cpu.registers[0] = 5;
        cpu.registers[1] = 5;
        instructions.subn.execute(cpu, { x: 0, y: 1 });
        expect(cpu.registers[0]).toEqual(0);
        expect(cpu.registers[0xf]).toEqual(0);
        expect(cpu.pc).toEqual(0x202);
      });
    });

    describe("if vy <= vx", () => {
      it("subtracts vx from vy and sets vf to 0", () => {
        cpu.registers[0] = 5;
        cpu.registers[1] = 4;
        instructions.subn.execute(cpu, { x: 0, y: 1 });
        expect(cpu.registers[0]).toEqual(0b11111111);
        expect(cpu.registers[0xf]).toEqual(0);
        expect(cpu.pc).toEqual(0x202);
      });
    });
  });

  // 8xyE - SHL Vx {, Vy}
  describe("shl", () => {
    describe("If the most-significant bit of Vx is 1", () => {
      it("sets VF to 1, then Vx is multiplied by 2.", () => {
        cpu.registers[0] = 0b11000000;
        instructions.shl.execute(cpu, { x: 0 });
        expect(cpu.registers[0]).toEqual(0b10000000);
        expect(cpu.registers[0xf]).toEqual(1);
        expect(cpu.pc).toEqual(0x202);
      });
    });
    describe("If the most-significant bit of Vx is 0", () => {
      it("sets VF to 0, then Vx is multiplied by 2.", () => {
        cpu.registers[0] = 0b00000011;
        instructions.shl.execute(cpu, { x: 0 });
        expect(cpu.registers[0]).toEqual(0b00000110);
        expect(cpu.registers[0xf]).toEqual(0);
        expect(cpu.pc).toEqual(0x202);
      });
    });
  });
});
