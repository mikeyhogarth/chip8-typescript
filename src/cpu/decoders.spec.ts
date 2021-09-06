import { nnnDecoder, nullDecoder, xkkDecoder, xyDecoder } from "./decoders";

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
