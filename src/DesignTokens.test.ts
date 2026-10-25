import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import postcss from "postcss";

const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
const styles = files(__dirname).filter(file => file.endsWith(".css"));

test("every CSS custom property definition and reference uses the OakD namespace", () => {
  for (const file of styles) {
    const source = readFileSync(file, "utf8");
    const tokens = [...source.matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)\s*:|var\(\s*(--[\w-]+)/g)]
      .map(match => match[1] || match[2]);
    expect(tokens.filter(token => !token.startsWith("--oakd-"))).toEqual([]);
  }
});

test("built-in themes override the canonical foundation tokens directly", () => {
  const css = postcss.parse(readFileSync(join(__dirname, "index.css"), "utf8"));
  const values: Record<string, Record<string, string>> = {};
  css.walkRules(rule => {
    if (rule.parent?.type !== "root") return;
    values[rule.selector] = {};
    rule.walkDecls(decl => { values[rule.selector][decl.prop] = decl.value; });
  });
  expect(values[":root"]["--oakd-leading"]).toBe("7pt");
  expect(values[":root"]["--oakd-radius"]).toBe("0");
  expect(values[".theme-soft"]["--oakd-radius"]).toBe("3pt");
  expect(values[".theme-tight"]["--oakd-leading"]).toBe("4pt");
  expect(values[".theme-high-contrast"]["--oakd-font-color"]).toBe("#ffffff");
});

test("component radii use shared tokens without local multipliers or offsets", () => {
  for (const file of styles.filter(file => !file.endsWith("index.css"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/border(?:-[\w]+)?-radius:\s*([^;]+);/g)) {
      expect(["var(--oakd-radius)", "var(--oakd-radius-round)", "0", "inherit"])
        .toContain(match[1].trim());
    }
  }
  for (const file of files(__dirname).filter(file => file.endsWith(".tsx") && !/\.(test|stories)\.tsx$/.test(file))) {
    for (const match of readFileSync(file, "utf8").matchAll(/border(?:TopLeft|TopRight|BottomLeft|BottomRight)?Radius:\s*([^,\n}]+)/g)) {
      expect(['"var(--oakd-radius)"', '"var(--oakd-radius-round)"', "0"])
        .toContain(match[1].trim());
    }
  }
});
