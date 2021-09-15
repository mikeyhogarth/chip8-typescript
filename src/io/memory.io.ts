export function createMemoryIO(): IOInterface {
  return {
    /** Keyboard */
    pressedKeys: 0,
    lastKeyPressed: -1,
    keyDown(key: number) {
      this.pressedKeys = this.pressedKeys + (1 << key);
      this.lastKeyPressed = key;
    },
    keyUp(key: number) {
      if (this.isKeyDown(key)) this.pressedKeys = this.pressedKeys - (1 << key);
    },
    isKeyDown(key: number): boolean {
      return ((this.pressedKeys >> key) & 1) === 1;
    },

    /** Display */
    display: createBlankDisplay(),
    // clear the display completely
    clearDisplay() {
      this.display = createBlankDisplay();
    },
    // xor the pixel, return true if the pixel gets blatted as a result (collision)
    drawPixel(value: number, xOrig: number, yOrig: number): boolean {
      const x: number = xOrig % 64; // wrap around X
      const y: number = yOrig % 32; // wrap around y
      const original = this.display[y][x];
      this.display[y][x] = this.display[y][x] ^ value;
      return original === 1 && this.display[y][x] === 0;
    },

    /**
     * draw all sprite pixels, return true if this results in any pixels getting blatted (collision)
     * @param sprite sprites are n-bytes long - a byte representing 8 bits with each being 1 pixel.
     * @param x
     * @param y
     */
    drawSprite(sprite: number[], x: number, y: number): boolean {
      let collided: boolean = false;
      sprite.forEach((row, rowNumber) => {
        for (let i = 0; i < 8; i++) {
          if (this.drawPixel((row >> (7 - i)) & 1, x + i, y + rowNumber)) {
            collided = true;
          }
        }
      });
      return collided;
    },
  };
}

function createBlankDisplay() {
  return new Array(32).fill(0).map(() => new Array(64).fill(0));
}
