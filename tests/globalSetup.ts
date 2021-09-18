beforeAll(() => {
  // Note that "legacy" is used here because the documentation is not out yet for
  // the breaking changes to timers that were introduced in Jest27 (see discussion
  // here: https://github.com/facebook/jest/pull/11731)
  jest.useFakeTimers("legacy");
});

afterAll(() => {
  jest.useRealTimers();
});
