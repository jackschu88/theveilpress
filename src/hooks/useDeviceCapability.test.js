import { describe, expect, it } from "vitest";
import { computeDeviceTier } from "./useDeviceCapability";

describe("computeDeviceTier", () => {
  it("returns high for a typical modern desktop", () => {
    expect(computeDeviceTier({ cores: 8, dpr: 2, saveData: false })).toBe("high");
  });

  it("returns low when the browser requests reduced data usage", () => {
    expect(computeDeviceTier({ cores: 8, dpr: 2, saveData: true })).toBe("low");
  });

  it("returns low for two or fewer CPU cores", () => {
    expect(computeDeviceTier({ cores: 2, dpr: 1, saveData: false })).toBe("low");
  });

  it("returns low for a mid core count paired with very high pixel density", () => {
    expect(computeDeviceTier({ cores: 4, dpr: 3, saveData: false })).toBe("low");
  });

  it("defaults to high when called with no arguments", () => {
    expect(computeDeviceTier()).toBe("high");
  });
});
