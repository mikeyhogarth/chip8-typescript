import { decode } from "./cpu/instruction-utils";
import { createMemoryIO } from "./io/memory.io";
import { InstructionMneumonic } from "./cpu/mneumonics";

// The first 0x1FF bytes of memory are reserved for the CHIP8 interpreter, so all
// CHIP8 programs start at 0x200.
const MEMORY_START = 0x200;

export class Cpu implements ICpu {
  constructor(
    public io: IOInterface = createMemoryIO(),
    // 4096 bytes of RAM
    public memory = new Uint8Array(0x1000),
    // 16 x 8-bit data registers named V0 to VF
    public registers = new Uint8Array(0x10),
    // 16 x 16-bit values for the stack
    public stack = new Uint16Array(0x10),
    // 16 bit program counter (which starts at 0x200 due to chip8 interpreter taking up the first 512 bytes)
    public pc = MEMORY_START,
    // 8 bit stack pointer
    public sp = -1,
    // 16-bit register called I, This register is generally used to store memory addresses.
    public i = -1,
    // 16 bit delay and sound timers
    public soundTimer = 0,
    public delayTimer = 0
  ) {}

  /**
   *
   * @param this the CPU loading the data
   * @param data the data to load
   */
  load(data: Buffer): void {
    data.forEach((d, i) => {
      this.memory[MEMORY_START + i] = d;
    });
  }

  /**
   * the FETCH part of the FDE cycle
   * @param this the CPU executing the instruction
   * @returns the fetched opcode (which will be 2 bytes long)
   */
  fetch(): number {
    // fetch the next opcode - each chunk of memory holds a byte (8 bits or 2 hex digits) but
    // the opcodes take up 2 bytes. For this reason, we need to fetch two of them and glue
    // them back together.

    // first thing then - get the byte pointed to by the PC as well as the next byte.
    const chunk1 = this.memory[this.pc];
    const chunk2 = this.memory[this.pc + 1];

    // To combine them, we're going to need to shift the first chunk 1 byte (8 bits) to the left
    // and then add on the second chunk.
    return (chunk1 << 8) + chunk2;
  }

  /**
   * The DECODE part of the FDE cycle
   * (note that this just hands off to a seperate 'decode' function defined elsewhere)
   */
  decode(opcode: number) {
    return decode(opcode);
  }

  /**
   * The EXECUTE part of the FDE cycle
   */
  execute(instruction: Instruction, args: InstructionArgs) {
    instruction.execute(this, args);
  }

  // run through one step of a CPU fetch-decode-execute (FDE) cycle.
  cycle() {
    const opcode = this.fetch();
    const { instruction, args } = decode(opcode);
    this.execute(instruction, args);
  }
}

/**
 * @returns a freshly initialised CHIP8 CPU
 * Remember:
 * 1 word = 16 bits = 4 hex digits
 * 1 byte = 8 bits = 2 hex digits
 * 1 nibble = 4 bits = 1 hex digit
 */
export function createCpu(io: IOInterface = createMemoryIO()): ICpu {
  return new Cpu(io);
}
