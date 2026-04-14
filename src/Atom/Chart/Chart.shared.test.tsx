import { viridisColor } from "./Chart.shared";

describe("Chart.shared", () => {
  it("uses the softened viridis endpoints and midpoint", () => {
    expect(viridisColor(0)).toBe("rgb(88, 42, 118)");
    expect(viridisColor(0.5)).toBe("rgb(58, 165, 164)");
    expect(viridisColor(1)).toBe("rgb(249, 226, 78)");
  });

  it("clamps values outside the viridis range", () => {
    expect(viridisColor(-1)).toBe("rgb(88, 42, 118)");
    expect(viridisColor(2)).toBe("rgb(249, 226, 78)");
  });
});
