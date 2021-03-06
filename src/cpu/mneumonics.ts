/**
 * Instruction Types
 */
export enum InstructionMneumonic {
  sys = "sys",
  cls = "cls",
  jmp = "jmp",
  ret = "ret",
  call = "call",
  seq = "seq",
  sne = "sne",
  seqReg = "seqReg",
  load = "load",
  add = "add",
  loadReg = "loadReg",
  or = "or",
  and = "and",
  xor = "xor",
  addReg = "addReg",
  sub = "sub",
  shr = "shr",
  subn = "subn",
  shl = "shl",
  sneReg = "sneReg",
  loadI = "loadI",
  jmpReg = "jmpReg",
  rnd = "rnd",
  skpKey = "skpKey",
  skpNotKey = "skpNotKey",
  getDelay = "getDelay",
  waitKey = "waitKey",
  setDelay = "setDelay",
  setSound = "setSound",
  addIReg = "addIReg",
  draw = "draw",
  loadHexSprite = "loadHexSprite",
  loadBCD = "loadBCD",
  storeMem = "storeMem",
  readMem = "readMem",
}
