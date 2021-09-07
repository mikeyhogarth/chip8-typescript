/**
 * Instruction Types
 */
export enum InstructionMneumonic {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
  call = "call",
  skipIfEqual = "skipIfEqual",
  skipIfNotEqual = "skipIfNotEqual",
  skipIfEqualRegisters = "skipIfEqualRegisters",
  load = "load",
  add = "add",
  loadReg = "loadReg",
  or = "or",
}
