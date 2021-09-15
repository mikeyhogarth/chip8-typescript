import {
  nnnDecoder,
  nullDecoder,
  xkkDecoder,
  xynDecoder,
  xyDecoder,
  xDecoder,
} from "./decoders";

describe("nullDecoder", () => {
  it("returns zero args", () => {
    expect(nullDecoder(0x1234)).toEqual({});
  });
});

describe("nnnDecoder", () => {
  it("returns the nnn portion of the opcode", () => {
    expect(nnnDecoder(0x0123)).toEqual({ nnn: 0x123 });
    expect(nnnDecoder(0x1123)).toEqual({ nnn: 0x123 });
  });
});

describe("xkkDecoder", () => {
  it("returns the x and kk portion of the opcode", () => {
    expect(xkkDecoder(0x3123)).toEqual({ x: 1, kk: 0x23 });
    expect(xkkDecoder(0x4232)).toEqual({ x: 2, kk: 0x32 });
  });
});

describe("xyDecoder", () => {
  it("returns the x and y portion of the opcode", () => {
    expect(xyDecoder(0x5120)).toEqual({ x: 1, y: 2 });
    expect(xyDecoder(0x8210)).toEqual({ x: 2, y: 1 });
  });
});

describe("xDecoder", () => {
  it("returns the x portion of the opcode", () => {
    expect(xDecoder(0x5120)).toEqual({ x: 1 });
    expect(xDecoder(0x8210)).toEqual({ x: 2 });
  });
});

describe("xynDecoder", () => {
  it("returns the x, y and n portion of the opcode", () => {
    expect(xynDecoder(0xd012)).toEqual({ x: 0, y: 1, n: 2 });
    expect(xynDecoder(0xd120)).toEqual({ x: 1, y: 2, n: 0 });
    expect(xynDecoder(0xd201)).toEqual({ x: 2, y: 0, n: 1 });
  });
});
