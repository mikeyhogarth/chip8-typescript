import { createMemoryIO } from "./memory.io";

describe("createMemoryIo", () => {
  it("initializes an empty 32 x 64 array", () => {
    const io = createMemoryIO();
    expect(io.display.length).toEqual(32);
    expect(io.display[0].length).toEqual(64);
    expect(isBlankDisplay(io.display)).toEqual(true);
  });
});

describe("clearDisplay", () => {
  it("blanks out the display", () => {
    const io = createMemoryIO();
    io.display[0][0] = true;
    expect(isBlankDisplay(io.display)).toEqual(false);
    io.clearDisplay();
    expect(isBlankDisplay(io.display)).toEqual(true);
  });
});

// Utility functions
function isBlankDisplay(display: boolean[][]) {
  return display.every((row) => row.every((pixel) => pixel === false));
}
