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

/**
 * Decode arguments from opcodes of format X
 * @param opcode
 * @returns
 */
export function xDecoder(opcode: number) {
  return { x: (opcode & 0x0f00) >> 8 };
}
