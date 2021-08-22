import { createCpu, ICpu } from "../cpu";

let cpu: ICpu;
beforeEach(() => {
  cpu = createCpu();
});

describe("fetch", () => {
  it("Fetches the word currently being pointed to by the PC", () => {
    cpu.load(new Uint8ClampedArray([0x60, 0xaa]));

    // fetching should return the whole word representing the opcode
    expect(cpu.fetch()).toEqual(0x60aa);
  });
});

describe("decode", () => {
  // we're going to test each opcode works
});
