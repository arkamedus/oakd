import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pill from "./Pill";

it("renders as a static OakD surface rather than a button", () => {
  render(
    <Pill size="large" variant="success" wide>
      Status
    </Pill>,
  );
  const pill = screen.getByText("Status").closest(".oakd-pill");
  expect(pill?.tagName).toBe("SPAN");
  expect(pill).toHaveClass("oakd-pill--large", "type-success", "wide");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
