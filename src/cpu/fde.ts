import { ICpu } from "../cpu";
import { InstructionArgs, InstructionMneumonic } from "./instructions";

/**
 * the FETCH part of the FDE cycle
 * @param this the CPU executing the instruction
 * @param opcode the instruction to execute
 * @param args the arguments to execute
 */
export function fetch(this: ICpu): number {
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
 * the DECODE part of the FDE cycle
 * @param opcode the opcode to decode
 * @returns an object identifying the instruction that fired and that instruction's arguments
 */
export function decode(
  this: ICpu,
  opcode: number
): {
  instruction: InstructionMneumonic;
  args: InstructionArgs;
} {
  // An opcode in chip8 is represented by a "word" (a.k.a 16 bits, 2 bytes or 4 hex digits)
  // the way chip8 works is that there are "patterns" within the hex codes. For example,
  // the opcode for loading a value into a register is 6xkk, where the "x" is the register number
  // and the "kk" is the value (two hexes, so a byte) to load into it - meaning that an opcode
  // of "6E10" would load the value "10" into register "E".
  //
  // So we therefore need a way to;
  // 1- detect which opcode "fired"
  // 2- figure out the arguments for that opcode
  throw new Error("Not Implemented");
}

/**
 * The EXECUTE part of the FDE cycle
 */
export function execute(this: ICpu) {
  throw new Error("Not Implemented");
}
