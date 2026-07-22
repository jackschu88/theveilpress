import { describe, expect, it } from "vitest";
import { generateDustField } from "./dustField";

describe("generateDustField", () => {
  it("returns the requested particle count", () => {
    expect(generateDustField(50, 1)).toHaveLength(50);
  });

  it("is deterministic for a given seed", () => {
    const a = generateDustField(20, 42);
    const b = generateDustField(20, 42);
    expect(a).toEqual(b);
  });

  it("produces different output for different seeds", () => {
    const a = generateDustField(20, 1);
    const b = generateDustField(20, 2);
    expect(a).not.toEqual(b);
  });

  it("keeps depth (z) within the near/far range", () => {
    const particles = generateDustField(200, 7);
    particles.forEach((p) => {
      expect(p.z).toBeLessThanOrEqual(0);
      expect(p.z).toBeGreaterThanOrEqual(-8);
    });
  });

  it("gives every particle a positive size", () => {
    const particles = generateDustField(200, 7);
    particles.forEach((p) => expect(p.size).toBeGreaterThan(0));
  });
});
