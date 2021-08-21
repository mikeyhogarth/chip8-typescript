import { createCpu } from "./cpu";

describe("createCpu", () => {
  it("returns a valid, fresh CPU", () => {
    const cpu = createCpu();

    expect(cpu.registers.length).toEqual(16);
    expect(cpu.stack.length).toEqual(16);
    expect(cpu.memory.length).toEqual(4096);
    expect(cpu.pc).toEqual(512);
    expect(cpu.sp).toEqual(-1);
    expect(cpu.soundTimer).toEqual(0);
    expect(cpu.delayTimer).toEqual(0);
  });
});
