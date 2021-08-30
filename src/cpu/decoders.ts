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
