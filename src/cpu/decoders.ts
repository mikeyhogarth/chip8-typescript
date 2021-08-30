import { instructions, Instruction } from "./instructions";

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
 * Decode arguments from opcodes of format XNNN
 * @param opcode
 * @returns
 */
export function nnnDecoder(opcode: number) {
  const nnn = opcode & 0x0fff;
  return { nnn };
}
