import { nnnDecoder, nullDecoder } from "./decoders";

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
