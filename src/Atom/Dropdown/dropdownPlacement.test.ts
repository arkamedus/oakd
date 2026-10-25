import { getAdaptiveDropdownPlacement } from "./dropdownPlacement";

afterEach(() => jest.restoreAllMocks());

test.each([ ["9.33333px", "9.33333px"], ["24px", "24px"], ["0px", "0px"], ["", "8px"] ])(
  "uses browser-resolved scoped spacing %s and removes its measuring element",
  (resolved, expected) => {
    const host = document.createElement("div");
    host.style.setProperty("--oakd-leading", "7pt");
    document.body.appendChild(host);
    jest.spyOn(window, "getComputedStyle").mockImplementation(element => {
      if (element === host) return { length: 0 } as CSSStyleDeclaration;
      expect(element.parentElement).toBe(host);
      // jsdom does not resolve CSS variables; emulate the browser’s computed width.
      return { width: resolved } as CSSStyleDeclaration;
    });
    const result = getAdaptiveDropdownPlacement(host, "bottom-left");
    expect(result.style).toMatchObject({
      "--oakd-dropdown-fixed-top": expected,
      "--oakd-dropdown-fixed-left": expected,
    });
    expect(host.children).toHaveLength(0);
    host.remove();
  },
);
