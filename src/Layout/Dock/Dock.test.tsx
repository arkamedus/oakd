import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dock from "./Dock";
it("supports named and numeric offsets", () => {
  const { rerender } = render(
    <Dock position="bottom-right" offset={12}>
      Docked
    </Dock>,
  );
  expect(screen.getByText("Docked")).toHaveClass("oakd-dock--bottom-right");
  expect(screen.getByText("Docked")).toHaveStyle("--oakd-dock-offset: 12px");
  rerender(<Dock offset="var(--oakd-leading)">Docked</Dock>);
  expect(screen.getByText("Docked")).toHaveStyle(
    "--oakd-dock-offset: var(--oakd-leading)",
  );
});

it("uses the OakD spacing token as the default inset", () => {
  render(<Dock>Docked</Dock>);
  expect(screen.getByText("Docked")).toHaveStyle(
    "--oakd-dock-offset: var(--oakd-leading)",
  );
});
