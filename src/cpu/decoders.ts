import {
  instructions,
  Instruction,
  InstructionMneumonic,
  InstructionArgs,
} from "./instructions";

/**
 * the DECODE part of the FDE cycle
 * @param opcode the opcode to decode (2 bytes)
 * @returns an object identifying the instruction that fired and that instruction's arguments
 */
export function decode(opcode: number): {
  instruction: InstructionMneumonic;
  args: InstructionArgs;
} {
  // An opcode in chip8 is represented by a "word" (a.k.a 16 bits, 2 bytes or 4 hex digits)
  // the way chip8 works is that there are "patterns" within the hex codes. For example,
  // the opcode for loading a value into a register is 6xkk, where the "x" is the register number
  // and the "kk" is the value (two hexes, so a byte) to load into it - meaning that an opcode
  // of "6E10" would load the value "10" into register "E".
  const instructionMetadata = findByBytecode(opcode);
  return {
    instruction: instructionMetadata.id,
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

/**
 * Decode arguments from opcodes which don't have any arguments
 * @param opcode
 * @returns
 */
export function nullDecoder(opcode: number) {
  return {};
}

/**
 * Decode arguments from opcodes of format NNN
 * @param opcode
 * @returns
 */
export function nnnDecoder(opcode: number) {
  const nnn = opcode & 0x0fff;
  return { nnn };
}

/**
 * Decode arguments from opcodes of format XKK
 * @param opcode
 * @returns
 */
export function xkkDecoder(opcode: number) {
  const xkk = opcode & 0x0fff;
  return { x: xkk >> 8, kk: xkk & 0x0ff };
}

/**
 * Decode arguments from opcodes of format XY
 * @param opcode
 * @returns
 */
export function xyDecoder(opcode: number) {
  const xy = (opcode & 0x0ff0) >> 4;
  return { x: xy >> 4, y: xy & 0x0f };
}
