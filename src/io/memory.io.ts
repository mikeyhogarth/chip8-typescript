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
    clearDisplay() {
      this.display = createBlankDisplay();
    },
  };
}

function createBlankDisplay() {
  return new Array(32).fill(false).map(() => new Array(64).fill(false));
}
