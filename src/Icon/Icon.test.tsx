import React from "react";
import { render } from "@testing-library/react";
import Icon, { IconStack } from "./Icon";
import { IconProps } from "./Icon.types";
import { CoreIconNameType, IconComment, IconTrash } from "./Icons.bin";

describe("Icon Component", () => {
  let props: IconProps;

  beforeEach(() => {
    props = {
      size: "default",
      name: "Comment",
      className: "custom-icon",
      style: { color: "blue" }
    };
  });

  const renderComponent = (name: CoreIconNameType, extraProps: Partial<IconProps> = {}) =>
    render(<Icon name={name} data-testid="Icon" {...extraProps} />);

  it("should render the Icon component", () => {
    const { getByTestId } = renderComponent("Comment");
    expect(getByTestId("Icon")).toBeInTheDocument();
  });

  it("should apply the correct size class", () => {
    const { getByTestId } = renderComponent("Trash", { size: "large" });
    expect(getByTestId("Icon")).toHaveClass("icon-large");
  });

  it("should apply custom class names", () => {
    const { getByTestId } = renderComponent("Comment", { className: "custom-icon" });
    expect(getByTestId("Icon")).toHaveClass("custom-icon");
  });

  it("should apply inline styles correctly", () => {
    const { getByTestId } = render(<Icon {...props} />);
    expect(getByTestId("Icon")).toHaveStyle("color: blue");
  });

  it("should render specific icon components correctly", () => {
    const { getByTestId } = render(<IconTrash data-testid="IconTrash" />);
    expect(getByTestId("IconTrash")).toBeInTheDocument();
  });

  it("should render different icons correctly", () => {
    const { getByTestId } = render(<IconComment data-testid="IconComment" />);
    expect(getByTestId("IconComment")).toBeInTheDocument();
  });

  it("should set the correct mask URL", () => {
    const { getByTestId } = renderComponent("Comment");
    const component = getByTestId("Icon");
    expect(component.getAttribute("style")).toContain("mask: url");
  });

  it("should log a warning if an invalid icon name is used", () => {
    console.warn = jest.fn();
    // @ts-ignore
    renderComponent("InvalidIcon");
    expect(console.warn).toHaveBeenCalledWith('Icon "InvalidIcon" not found.');
  });

  it("should render null if an invalid icon name is provided", () => {
    // @ts-ignore
    const { container } = renderComponent("InvalidIcon");
    expect(container.firstChild).toBeNull();
  });
});

describe("IconStack Component", () => {
  it("should render children inside IconStack", () => {
    const { getByTestId } = render(
      <IconStack data-testid="IconStack">
        <Icon name="Comment" />
        <Icon name="Trash" />
      </IconStack>
    );
    expect(getByTestId("IconStack")).toBeInTheDocument();
  });

  it("should apply custom class names to IconStack", () => {
    const { getByTestId } = render(
      <IconStack className="custom-stack" data-testid="IconStack" />
    );
    expect(getByTestId("IconStack")).toHaveClass("custom-stack");
  });

  it("should render multiple icons inside IconStack", () => {
    const { container } = render(
      <IconStack>
        <Icon name="Comment" />
        <Icon name="Trash" />
      </IconStack>
    );
    expect(container.querySelectorAll(".oakd.icon").length).toBe(2);
  });
});
