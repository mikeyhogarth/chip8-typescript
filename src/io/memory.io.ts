import { IOInterface } from "../io";

export function createMemoryIO(): IOInterface {
  return {
    display: createBlankDisplay(),
    clearDisplay() {
      this.display = createBlankDisplay();
    },
  };
}

function createBlankDisplay() {
  return new Array(32).fill(false).map(() => new Array(64).fill(false));
}
