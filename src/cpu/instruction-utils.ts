import { instructions } from "./instructions";
import { InstructionMneumonic } from "./mneumonics";

/**
 * the DECODE part of the FDE cycle
 * @param opcode the opcode to decode (2 bytes)
 * @returns an object identifying the instruction that fired and that instruction's arguments
 */
export function decode(opcode: number): {
  instruction: Instruction;
  args: InstructionArgs;
} {
  // An opcode in chip8 is represented by a "word" (a.k.a 16 bits, 2 bytes or 4 hex digits)
  // the way chip8 works is that there are "patterns" within the hex codes. For example,
  // the opcode for loading a value into a register is 6xkk, where the "x" is the register number
  // and the "kk" is the value (two hexes, so a byte) to load into it - meaning that an opcode
  // of "6E10" would load the value "10" into register "E".
  const instructionMetadata = findByBytecode(opcode);
  return {
    instruction: instructionMetadata,
    args: instructionMetadata.decodeArgs(opcode),
  };
}

/**
 * Reterieve instruction based on opcode.
 * @param byteCode a 16-bit opcode that should match to one of the instructions
 * @returns the matched instruction
 * @throws error if no instruction matches passed-in opcode
 */
export function findByBytecode(opcode: number): Instruction {
  const opcodeValues = Object.values(instructions);
  const retVal =
    // some opcodes are literals - in which case return those before pattern matching.
    opcodeValues.find((o) => o.pattern === opcode) ||
    // otherwise resort to applying bitmasks to discover correct instruction represented
    opcodeValues.find((o) => (o.mask & opcode) === o.pattern);

  if (retVal) {
    return retVal;
  } else {
    throw new Error("Opcode not matched");
  }
}

// generate a random number between 0 and 255
export function random() {
  return Math.floor(Math.random() * 255);
}
