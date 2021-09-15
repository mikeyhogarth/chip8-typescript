import { createMemoryIO } from "./memory.io";
import hexSprites from "../hex-sprites";

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
    io.display[0][0] = 1;
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

describe("drawPixel", () => {
  describe("when the pixel is off to begin with", () => {
    let io: IOInterface;

    beforeEach(() => {
      io = createMemoryIO();
    });
    describe("when the pixel is set to 1", () => {
      it("draws a pixel at the x/y co-ordinate and returns false (because no pixel was 'erased')", () => {
        const result = io.drawPixel(1, 0, 0);
        expect(io.display[0][0]).toEqual(1);
        expect(result).toEqual(false);
      });
    });
    describe("when the pixel is set to 0", () => {
      it("does not draw a pixel at the x/y co-ordinate and returns false (because no pixel was 'erased')", () => {
        const result = io.drawPixel(0, 0, 0);
        expect(io.display[0][0]).toEqual(0);
        expect(result).toEqual(false);
      });
    });
  });

  describe("when the pixel is on to begin with", () => {
    let io: IOInterface;

    beforeEach(() => {
      io = createMemoryIO();
      io.display[0][0] = 1;
    });
    describe("when the pixel is set to 1", () => {
      it("erases the pixel at the x/y co-ordinate and returns true (because the pixel was 'erased')", () => {
        const result = io.drawPixel(1, 0, 0);
        expect(io.display[0][0]).toEqual(0);
        expect(result).toEqual(true);
      });
    });
    describe("when the pixel is set to 0", () => {
      it("Leaves the pixel at x/y alone and returns false (because no pixel was 'erased')", () => {
        const result = io.drawPixel(0, 0, 0);
        expect(io.display[0][0]).toEqual(1);
        expect(result).toEqual(false);
      });
    });
  });
});

describe("drawSprite", () => {
  describe("on a blank screen", () => {
    let io: IOInterface;

    beforeEach(() => {
      io = createMemoryIO();
    });

    describe("when drawn at 0, 0", () => {
      it("Simply draws the sprite at the appropriate co-ordinate", () => {
        const zero = hexSprites[0];
        const result = io.drawSprite(zero, 0, 0);
        // printScreen(io.display);
        expect(io.display).toMatchSnapshot();
        expect(result).toEqual(false);
      });
    });

    describe("when drawn at 61, 29", () => {
      it("Wraps the x/y around to the other side of the screen", () => {
        const zero = hexSprites[0];
        const result = io.drawSprite(zero, 61, 29);
        // printScreen(io.display);
        expect(io.display).toMatchSnapshot();
        expect(result).toEqual(false);
      });
    });
  });

  describe("on a non-blank screen", () => {
    let io: IOInterface;

    beforeEach(() => {
      io = createMemoryIO();
      // fill first row with pixels
      io.display[0].fill(1);
    });

    describe("when drawn at 0, 0", () => {
      it("Simply draws the sprite at the appropriate co-ordinate", () => {
        const zero = hexSprites[0];
        const result = io.drawSprite(zero, 0, 0);
        // printScreen(io.display);
        expect(io.display).toMatchSnapshot();
        expect(result).toEqual(true);
      });
    });
  });
});

// Utility functions
function isBlankDisplay(display: number[][]) {
  return display.every((row) => row.every((pixel) => pixel === 0));
}

// for debugging sprites
function printScreen(screen: number[][]) {
  let str = "";
  screen.forEach((row) => (str = str + row.join("") + "\n"));
  /* tslint:disable-next-line */
  console.log(str);
}
