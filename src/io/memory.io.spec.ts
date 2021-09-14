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

describe("keyDown", () => {
  it("sets a particular key to the down position", () => {
    const io = createMemoryIO();
    io.keyDown(1);
    io.keyDown(3);
    expect(io.isKeyDown(1)).toEqual(true);
    expect(io.isKeyDown(2)).toEqual(false);
    expect(io.isKeyDown(3)).toEqual(true);
  });
});

describe("isKeyDown", () => {
  it("returns true if a particular key is currently down", () => {
    const io = createMemoryIO();
    expect(io.isKeyDown(0)).toEqual(false);
    io.keyDown(0);
    expect(io.isKeyDown(0)).toEqual(true);
  });
});

describe("keyUp", () => {
  it("unsets a particular key to the down position", () => {
    const io = createMemoryIO();
    io.keyDown(1);
    io.keyDown(3);
    io.keyUp(3);
    expect(io.isKeyDown(1)).toEqual(true);
    expect(io.isKeyDown(2)).toEqual(false);
    io.keyUp(2);
    expect(io.isKeyDown(2)).toEqual(false);
    expect(io.isKeyDown(3)).toEqual(false);
    io.keyUp(1);
    expect(io.isKeyDown(1)).toEqual(false);
  });
});

describe("getPressedKeys", () => {
  describe("when no keys are pressed", () => {
    it("returns 0", () => {
      const io = createMemoryIO();
      expect(io.pressedKeys).toEqual(0);
    });
  });
  describe("when keys are pressed", () => {
    it("returns a number representing the keys currently pressed", () => {
      const io = createMemoryIO();
      io.keyDown(0);
      io.keyDown(2);
      io.keyDown(4);
      io.keyDown(0xf);
      expect(io.pressedKeys).toEqual(0b1000000000010101);
    });
  });
});

describe("lastKeyPressed", () => {
  it("is set to the value of whatever the last key pressed was", () => {
    const io = createMemoryIO();
    io.keyDown(0);
    io.keyDown(2);
    io.keyDown(4);
    expect(io.lastKeyPressed).toEqual(4);
  });
});

// Utility functions
function isBlankDisplay(display: boolean[][]) {
  return display.every((row) => row.every((pixel) => pixel === false));
}
