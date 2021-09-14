export function createMemoryIO(): IOInterface {
  return {
    pressedKeys: 0,
    keyDown(key: number) {
      this.pressedKeys = this.pressedKeys + (1 << key);
    },
    keyUp(key: number) {
      if (this.isKeyDown(key)) this.pressedKeys = this.pressedKeys - (1 << key);
    },
    isKeyDown(key: number): boolean {
      return ((this.pressedKeys >> key) & 1) === 1;
    },
    getPressedKeys(): number {
      return this.pressedKeys;
    },
    display: createBlankDisplay(),
    clearDisplay() {
      this.display = createBlankDisplay();
    },
  };
}

function createBlankDisplay() {
  return new Array(32).fill(false).map(() => new Array(64).fill(false));
}
