import React from "react";
import { render } from "@testing-library/react";
import Icon, { IconTrash, IconComment } from "./Icon";
import { CoreIconNameType, IconProps } from "./Icon.types";

describe("Icon Component", () => {
  let props: IconProps;

  beforeEach(() => {
    props = {
      size: "default",
      name: "Comment",
    };
  });

  const renderComponent = (
    name: CoreIconNameType,
    size: "small" | "default" | "large" = "default",
  ) => render(<Icon name={name} size={size} data-testid="Icon" />);

  it("should render the icon component", () => {
    const { getByTestId } = renderComponent("Trash");
    expect(getByTestId("Icon")).toBeInTheDocument();
  });

  it("should apply the correct size class", () => {
    const { container } = renderComponent("Trash", "large");
    expect(container.firstChild).toHaveClass("icon-large");
  });

  it("should render specific icon components correctly", () => {
    const { getByTestId } = render(<IconTrash data-testid="IconTrash" />);
    expect(getByTestId("IconTrash")).toBeInTheDocument();
  });

  it("should render different icons correctly", () => {
    const { getByTestId } = render(<IconComment data-testid="IconComment" />);
    expect(getByTestId("IconComment")).toBeInTheDocument();
  });
});
