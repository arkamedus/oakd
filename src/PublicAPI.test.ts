import * as OakD from "./index";

describe("public API", () => {
  it("exports the supported foundation and editor surface from the package root", () => {
    [
      "AppShell",
      "ContentRail",
      "ScrollArea",
      "Dock",
      "Textarea",
      "Checkbox",
      "RangeInput",
      "FileInput",
      "ActionList",
      "ActionListItem",
      "Badge",
      "Pill",
      "EmptyState",
      "Tooltip",
      "DataTable",
      "VectorField",
      "ColorField",
      "colorToHex",
      "normalizeColorValue",
      "ThumbnailGrid",
      "Tabs",
      "Tab",
    ].forEach((name) => expect(OakD).toHaveProperty(name));
  });
});
