import React from "react";
import { render, screen } from "@testing-library/react";
import ScriptSandbox from "./ScriptSandbox";

describe("ScriptSandbox Component", () => {
  it("renders the sandbox title, controls, and iframe by default", () => {
    render(<ScriptSandbox src={`print("hello")`} />);

    expect(screen.getByText("Sandbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByTitle("ScriptSandbox")).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toHaveTextContent("idle");
  });

  it("hides the control bar when controls are disabled", () => {
    render(<ScriptSandbox src={`print("hello")`} controls={false} />);

    expect(
      screen.queryByRole("button", { name: /run/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByTitle("ScriptSandbox")).toBeInTheDocument();
  });

  it("enters the running state immediately when autoRun is enabled", () => {
    render(<ScriptSandbox src={`print("hello")`} autoRun />);
    expect(screen.getByText(/Status:/i)).toHaveTextContent("running");
  });
});
